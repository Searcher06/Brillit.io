import { Router } from "express";
import protect from "../middlewares/authMiddlware.js";
import {
  createPlan,
  endActiveSession,
  getActiveQueue,
  getActiveSession,
  getCheckpointQuestions,
  getLearningDashboard,
  getPlanById,
  getQueueById,
  listPlans,
  startSession,
  submitCheckpoint,
  updatePlan,
} from "../controllers/learning.controllers.js";

const router = Router();

router.use(protect);

router.get("/dashboard", getLearningDashboard);

router.post("/plans", createPlan);
router.get("/plans", listPlans);
router.get("/plans/:planId", getPlanById);
router.patch("/plans/:planId", updatePlan);

router.post("/sessions/start", startSession);
router.get("/sessions/active", getActiveSession);
router.post("/sessions/end", endActiveSession);

router.get("/queue/active", getActiveQueue);
router.get("/queue/:queueId", getQueueById);

router.get("/checkpoints/questions", getCheckpointQuestions);
router.post("/checkpoints/submit", submitCheckpoint);

export default router;

