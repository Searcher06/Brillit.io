import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import videos from "../routes/videosRoutes.js";
import connectDB from "../config/connectDB.js";
import router from "../routes/userRoutes.js";
import Logger from "../middlewares/logger.js";
import { errorHandler } from "../middlewares/errorhandler.js";
import { videoModel } from "../models/video.model.js";
import client from "../config/typesenseClient.js";
import protect from "../middlewares/authMiddlware.js";
import dashboardRoute from "../routes/dashboard.js";
import aiRoutes from "../routes/aiSuggestions.js";
import learningRoutes from "../routes/learningRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
const DATABASE_URI = process.env.DATABASE_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// IMPORTANT: Update this in production
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(Logger);

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { message: "Too many AI requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { message: "Too many search requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

const learningLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 40,
  message: { message: "Too many learning requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use("/api/v1/videos", searchLimiter, videos);
app.use("/api/v1/users/sign-in", authLimiter);
app.use("/api/v1/users/sign-up", authLimiter);
app.use("/api/v1/users", router);
app.use("/api/v1/ai", aiLimiter, aiRoutes);
app.use("/api/v1/learning", learningLimiter, learningRoutes);

// Protected utility routes
app.get("/api/v1/special", protect, async (req, res) => {
  try {
    const jsonL = await client.collections("videos").documents().export();

    const jsonArray = jsonL
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));

    console.log("Fetched all the docs successfully from typesense");
    res.status(200).json(jsonArray);
  } catch (error) {
    console.error("Error in getting docs from Typesense: ", error);
    res.status(500).json({ error: "Failed to fetch docs" });
  }
});

app.get("/api/v1/getAll", protect, async (req, res) => {
  try {
    const allVideos = await videoModel.find({});
    res.status(200).json(allVideos);
  } catch (error) {
    console.error("Error in getting all videos from DB", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Private routes
app.use("/api/v1", protect, dashboardRoute);

// Health check
app.get("/api/v1/hello", async (req, res) => {
  res.status(200).json({ message: "Hello am active and running online" });
});

// DB Connection
connectDB(DATABASE_URI);

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log("Server up and running on port: " + port);
});

// Global error catchers (so your app never crashes unexpectedly)
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
