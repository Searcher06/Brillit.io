import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
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

const app = express();
const port = process.env.PORT || 5000;
const DATABASE_URI = process.env.DATABASE_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ⚠️ IMPORTANT: Update this in production
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(Logger);

// Routes
app.use("/api/v1/videos", videos);
app.use("/api/v1/users", router);
app.use("/api/v1/ai", aiRoutes);

app.get("/api/v1/special", async (req, res) => {
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

app.get("/api/v1/getAll", async (req, res) => {
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
