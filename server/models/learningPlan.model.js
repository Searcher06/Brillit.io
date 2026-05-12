import mongoose from "mongoose";

const planStepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    query: { type: String, required: true, trim: true },
    youtubeId: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { _id: false }
);

const learningPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 180,
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
      index: true,
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
    },
    steps: {
      type: [planStepSchema],
      validate: [
        (value) => Array.isArray(value) && value.length > 0,
        "At least one step is required",
      ],
    },
  },
  { timestamps: true }
);

export const learningPlanModel = mongoose.model("LearningPlan", learningPlanSchema);

