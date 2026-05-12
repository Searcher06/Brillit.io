import mongoose from "mongoose";

const queueItemSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true, min: 1 },
    stepOrder: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    query: { type: String, required: true, trim: true },
    youtubeId: { type: String, default: "", trim: true },
    channelTitle: { type: String, default: "", trim: true },
    thumbnail: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["locked", "ready", "completed"],
      default: "locked",
    },
    checkpointPassed: { type: Boolean, default: false },
  },
  { _id: false }
);

const learningQueueSchema = new mongoose.Schema(
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
    currentIndex: {
      type: Number,
      default: 0,
      min: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    items: {
      type: [queueItemSchema],
      validate: [
        (value) => Array.isArray(value) && value.length > 0,
        "Queue requires at least one item",
      ],
    },
  },
  { timestamps: true }
);

export const learningQueueModel = mongoose.model("LearningQueue", learningQueueSchema);
