import mongoose from "mongoose";

const learningSessionSchema = new mongoose.Schema(
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
    durationMinutes: {
      type: Number,
      required: true,
      min: 10,
      max: 180,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endsAt: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const learningSessionModel = mongoose.model("LearningSession", learningSessionSchema);

