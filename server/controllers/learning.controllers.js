import mongoose from "mongoose";
import axios from "axios";
import { learningPlanModel } from "../models/learningPlan.model.js";
import { learningSessionModel } from "../models/learningSession.model.js";
import { learningQueueModel } from "../models/learningQueue.model.js";
import { checkpointAttemptModel } from "../models/checkpointAttempt.model.js";

const YOUTUBE_API_KEY = process.env.API_KEY;
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const buildDefaultSteps = (goal, keywords = []) => {
  const picked = keywords.slice(0, 8);
  const seed = picked.length > 0 ? picked : [goal.trim()];

  return seed.map((topic, index) => ({
    order: index + 1,
    title: `${topic} - Step ${index + 1}`,
    query: `${topic} tutorial`,
    youtubeId: "",
    status: "pending",
  }));
};

const sortSteps = (steps = []) => [...steps].sort((a, b) => a.order - b.order);

const toQueueResponse = (queue) => ({
  _id: queue._id,
  planId: queue.planId,
  sessionId: queue.sessionId,
  currentIndex: queue.currentIndex,
  isCompleted: queue.isCompleted,
  currentItem: queue.items[queue.currentIndex] || null,
  items: queue.items,
});

const buildCheckpointQuestions = (item) => [
  {
    id: "q1",
    type: "short_text",
    question: `In one sentence, what is the main idea from "${item.title}"?`,
  },
  {
    id: "q2",
    type: "short_text",
    question: `Give one practical use-case for ${item.query}.`,
  },
  {
    id: "q3",
    type: "short_text",
    question: "What part was unclear and what will you review next?",
  },
];

const hydrateStepWithYoutubeVideo = async (step) => {
  if (step.youtubeId || !YOUTUBE_API_KEY) return step;

  try {
    const search = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        q: step.query,
        part: "id",
        type: "video",
        maxResults: 1,
        key: YOUTUBE_API_KEY,
      },
    });

    const id = search.data?.items?.[0]?.id?.videoId;
    if (!id) return step;

    const details = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        part: "snippet",
        id,
        key: YOUTUBE_API_KEY,
      },
    });

    const snippet = details.data?.items?.[0]?.snippet;
    return {
      ...step,
      youtubeId: id,
      title: snippet?.title || step.title,
      channelTitle: snippet?.channelTitle || "",
      thumbnail:
        snippet?.thumbnails?.maxres?.url ||
        snippet?.thumbnails?.high?.url ||
        snippet?.thumbnails?.medium?.url ||
        "",
    };
  } catch (error) {
    return step;
  }
};

export const createPlan = async (req, res) => {
  const { goal, steps } = req.body;
  if (!goal || !goal.trim()) return res.status(400).json({ message: "Goal is required" });

  const generatedSteps =
    Array.isArray(steps) && steps.length > 0
      ? steps.map((step, index) => ({
          order: Number(step.order) || index + 1,
          title: step.title?.trim() || `Step ${index + 1}`,
          query: step.query?.trim() || `${goal.trim()} tutorial`,
          youtubeId: step.youtubeId?.trim() || "",
          status: "pending",
        }))
      : buildDefaultSteps(goal, req.user.suggestedKeywords || []);

  const normalizedSteps = sortSteps(generatedSteps).map((step, index) => ({
    ...step,
    order: index + 1,
  }));

  const plan = await learningPlanModel.create({
    userId: req.user._id,
    goal: goal.trim(),
    status: "active",
    currentStep: 1,
    steps: normalizedSteps,
  });

  return res.status(201).json(plan);
};

export const listPlans = async (req, res) => {
  const plans = await learningPlanModel.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(plans);
};

export const getPlanById = async (req, res) => {
  const { planId } = req.params;
  if (!isValidObjectId(planId)) return res.status(400).json({ message: "Invalid plan id" });

  const plan = await learningPlanModel.findOne({ _id: planId, userId: req.user._id });
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  return res.status(200).json(plan);
};

export const updatePlan = async (req, res) => {
  const { planId } = req.params;
  const { goal, status } = req.body;
  if (!isValidObjectId(planId)) return res.status(400).json({ message: "Invalid plan id" });

  const plan = await learningPlanModel.findOne({ _id: planId, userId: req.user._id });
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  if (goal && goal.trim()) plan.goal = goal.trim();
  if (status && ["active", "completed", "archived"].includes(status)) plan.status = status;

  await plan.save();
  return res.status(200).json(plan);
};

export const startSession = async (req, res) => {
  const { planId, durationMinutes = 45, queueSize = 3 } = req.body;
  if (!isValidObjectId(planId)) return res.status(400).json({ message: "Invalid plan id" });

  const plan = await learningPlanModel.findOne({ _id: planId, userId: req.user._id });
  if (!plan) return res.status(404).json({ message: "Plan not found" });
  if (plan.status !== "active") return res.status(400).json({ message: "Plan is not active" });

  const pendingSteps = sortSteps(plan.steps)
    .filter((step) => step.status === "pending")
    .slice(0, clamp(Number(queueSize) || 3, 1, 10));

  if (pendingSteps.length === 0) {
    return res.status(400).json({ message: "Plan has no pending steps" });
  }

  await learningSessionModel.updateMany({ userId: req.user._id, isActive: true }, { isActive: false });

  const now = Date.now();
  const safeDuration = clamp(Number(durationMinutes) || 45, 10, 180);
  const endsAt = new Date(now + safeDuration * 60 * 1000);

  const session = await learningSessionModel.create({
    userId: req.user._id,
    planId: plan._id,
    durationMinutes: safeDuration,
    startedAt: new Date(now),
    endsAt,
    isActive: true,
  });

  const hydrated = await Promise.all(pendingSteps.map((step) => hydrateStepWithYoutubeVideo(step)));
  const queueItems = hydrated.map((step, index) => ({
    position: index + 1,
    stepOrder: step.order,
    title: step.title,
    query: step.query,
    youtubeId: step.youtubeId || "",
    channelTitle: step.channelTitle || "",
    thumbnail: step.thumbnail || "",
    status: index === 0 ? "ready" : "locked",
    checkpointPassed: false,
  }));

  const queue = await learningQueueModel.create({
    userId: req.user._id,
    planId: plan._id,
    sessionId: session._id,
    currentIndex: 0,
    isCompleted: false,
    items: queueItems,
  });

  return res.status(201).json({
    session,
    queue: toQueueResponse(queue),
  });
};

export const getActiveSession = async (req, res) => {
  const session = await learningSessionModel.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
  if (!session) return res.status(404).json({ message: "No active session" });

  if (new Date(session.endsAt).getTime() <= Date.now()) {
    session.isActive = false;
    await session.save();
    return res.status(404).json({ message: "No active session" });
  }

  return res.status(200).json(session);
};

export const endActiveSession = async (req, res) => {
  const session = await learningSessionModel.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
  if (!session) return res.status(404).json({ message: "No active session" });

  session.isActive = false;
  await session.save();

  return res.status(200).json({ message: "Session ended", session });
};

export const getActiveQueue = async (req, res) => {
  const session = await learningSessionModel.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
  if (!session) return res.status(404).json({ message: "No active session" });

  const queue = await learningQueueModel.findOne({ userId: req.user._id, sessionId: session._id });
  if (!queue) return res.status(404).json({ message: "No queue found for active session" });

  return res.status(200).json(toQueueResponse(queue));
};

export const getQueueById = async (req, res) => {
  const { queueId } = req.params;
  if (!isValidObjectId(queueId)) return res.status(400).json({ message: "Invalid queue id" });

  const queue = await learningQueueModel.findOne({ _id: queueId, userId: req.user._id });
  if (!queue) return res.status(404).json({ message: "Queue not found" });

  return res.status(200).json(toQueueResponse(queue));
};

export const getCheckpointQuestions = async (req, res) => {
  const { queueId, itemIndex } = req.query;
  if (!isValidObjectId(queueId)) return res.status(400).json({ message: "Invalid queue id" });

  const index = Number(itemIndex);
  if (Number.isNaN(index) || index < 0) {
    return res.status(400).json({ message: "itemIndex must be a valid non-negative number" });
  }

  const queue = await learningQueueModel.findOne({ _id: queueId, userId: req.user._id });
  if (!queue) return res.status(404).json({ message: "Queue not found" });

  const item = queue.items[index];
  if (!item) return res.status(404).json({ message: "Queue item not found" });

  return res.status(200).json({
    queueId,
    itemIndex: index,
    title: item.title,
    questions: buildCheckpointQuestions(item),
  });
};

export const submitCheckpoint = async (req, res) => {
  const { queueId, itemIndex, score, answers = [] } = req.body;
  const numericScore = Number(score) || 0;
  const passed = numericScore >= 70;

  if (!isValidObjectId(queueId)) return res.status(400).json({ message: "Invalid queue id" });
  if (typeof itemIndex !== "number" || itemIndex < 0) {
    return res.status(400).json({ message: "itemIndex must be a valid non-negative number" });
  }

  const queue = await learningQueueModel.findOne({ _id: queueId, userId: req.user._id });
  if (!queue) return res.status(404).json({ message: "Queue not found" });

  const item = queue.items[itemIndex];
  if (!item) return res.status(404).json({ message: "Queue item not found" });
  if (item.status !== "ready") return res.status(400).json({ message: "Only current ready item can be checkpointed" });

  const session = await learningSessionModel.findOne({
    _id: queue.sessionId,
    userId: req.user._id,
    isActive: true,
  });
  if (!session) return res.status(400).json({ message: "Session is not active" });

  const attempt = await checkpointAttemptModel.create({
    userId: req.user._id,
    planId: queue.planId,
    sessionId: queue.sessionId,
    queueId: queue._id,
    itemIndex,
    score: numericScore,
    passed,
    answers: Array.isArray(answers) ? answers : [],
  });

  if (!passed) {
    return res.status(200).json({
      message: "Checkpoint submitted. Retry required to unlock next item.",
      passed: false,
      attempt,
      queue: toQueueResponse(queue),
    });
  }

  item.status = "completed";
  item.checkpointPassed = true;

  const nextIndex = itemIndex + 1;
  if (queue.items[nextIndex]) {
    queue.items[nextIndex].status = "ready";
    queue.currentIndex = nextIndex;
  } else {
    queue.isCompleted = true;
    session.isActive = false;
    await session.save();
  }
  await queue.save();

  const plan = await learningPlanModel.findOne({ _id: queue.planId, userId: req.user._id });
  if (plan) {
    const currentStep = plan.steps.find((step) => step.order === item.stepOrder);
    if (currentStep) currentStep.status = "completed";

    const nextPending = sortSteps(plan.steps).find((step) => step.status === "pending");
    if (nextPending) {
      plan.currentStep = nextPending.order;
    } else {
      plan.status = "completed";
    }
    await plan.save();
  }

  return res.status(200).json({
    message: "Checkpoint passed. Next queue item unlocked.",
    passed: true,
    attempt,
    queue: toQueueResponse(queue),
  });
};

export const getLearningDashboard = async (req, res) => {
  const [plans, activeSession] = await Promise.all([
    learningPlanModel.find({ userId: req.user._id }).sort({ createdAt: -1 }),
    learningSessionModel.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 }),
  ]);

  const activePlan = plans.find((plan) => plan.status === "active") || null;
  const activeQueue = activeSession
    ? await learningQueueModel.findOne({ userId: req.user._id, sessionId: activeSession._id })
    : null;

  const completedPlans = plans.filter((plan) => plan.status === "completed").length;
  const totalPlans = plans.length;

  const attempts = await checkpointAttemptModel.countDocuments({ userId: req.user._id, passed: true });

  const activePlanProgress = activePlan
    ? (() => {
        const total = activePlan.steps.length || 1;
        const done = activePlan.steps.filter((step) => step.status === "completed").length;
        return {
          totalSteps: total,
          completedSteps: done,
          percentage: Math.round((done / total) * 100),
        };
      })()
    : null;

  return res.status(200).json({
    summary: {
      totalPlans,
      completedPlans,
      passedCheckpoints: attempts,
    },
    activePlan,
    activeSession,
    activeQueue: activeQueue ? toQueueResponse(activeQueue) : null,
    activePlanProgress,
  });
};

