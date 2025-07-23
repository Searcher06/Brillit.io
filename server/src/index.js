import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
const port = process.env.PORT;
import videos from "../routes/videosRoutes.js";
import connectDB from "../config/connectDB.js";
const DATABASE_URI = process.env.DATABASE_URI;
import router from "../routes/userRoutes.js";
import Logger from "../middlewares/logger.js";
import { errorHandler } from "../middlewares/errorhandler.js";
import { seedDB, videoModel } from "../models/video.model.js";
import setupTypesense, {
  deleteDocuments,
  getAllDocs,
} from "../config/setUpTypesense.js";
import { seedTypeSense } from "../config/setUpTypesense.js";
import client from "../config/typesenseClient.js";
import protect from "../middlewares/authMiddlware.js";
import dashboardRoute from "../routes/dashboard.js";
import aiRoutes from "../routes/aiSuggestions.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(Logger);

app.use("/api/v1/videos/", videos);
app.use("/api/v1/users", router);
app.use("/api/v1/ai", aiRoutes);

app.get("/api/v1/special", async (req, res) => {
  try {
    const jsonL = await client.collections("videos").documents().export();

    const jsonArray = jsonL
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    console.log("Fetched all the docs successfully from typesense ");
    res.status(200).json(jsonArray);
  } catch (error) {
    console.log("Error in getting docs : ", error);
  }
});
app.get("/api/v1/getAll", async (req, res) => {
  try {
    const allVideos = await videoModel.find({});
    res.status(200).json(allVideos);
  } catch (error) {
    console.log("Error in getting all videos from DB");
  }
});

// private route
app.use("/api/v1/", protect, dashboardRoute);

connectDB(DATABASE_URI);
// seedDB()
// setupTypesense();
// deleteDocuments()
// seedTypeSense()

app.use(errorHandler);
app.listen(port, "0.0.0.0", () => {
  console.log("Server up and running on port 😁 : " + port);
});
