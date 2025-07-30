import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const key = process.env.API_KEY;
import { videoModel } from "../models/video.model.js";
import client from "../config/typesenseClient.js";
import { fetchYouTubeVideos } from "../lib/fetchYoutube.js";
import { getVideosFromMongo } from "../lib/getVideosfromDB.js";
import { Error } from "mongoose";

export const searchVideos = async (req, res) => {
  // Getting the search query
  const query = req.query.q;

  // Checking the search query
  if (!query) {
    res.status(400);
    throw new Error("Empty search query");
  }

  try {
    const freshVideos = await fetchYouTubeVideos(query, res);

    if (freshVideos[0]) {
      console.log(
        `Founded ${freshVideos.length} videos from the youtube response`
      );
      return res.status(200).json(freshVideos);
    }
  } catch (error) {
    console.log("search error: ", error);
    res.status(500);
    throw new Error(error.message || error);
  }
};
