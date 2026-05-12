import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const checkpointAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningPlan",
      required: true,
      index: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningSession",
      required: true,
      index: true,
    },
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningQueue",
      required: true,
      index: true,
    },
    itemIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const checkpointAttemptModel = mongoose.model("CheckpointAttempt", checkpointAttemptSchema);

