import axios from "axios";
import dontenv from "dotenv";
import { videoModel } from "../models/video.model.js";
import client from "../config/typesenseClient.js";
import { getVideosFromMongo } from "../lib/getVideosfromDB.js";
import { fetchYouTubeVideos } from "../lib/fetchYoutube.js";

dontenv.config();
import { userModel } from "../models/user.model.js";
const key = process.env.API_KEY;

export const videoId = async (req, res) => {
  // const id = req.params.id;
  // const query = req.query.q;
  const videoTitle = req.query.title;
  const channelId = req.query.channelId;

  try {
    // getting the current user
    const user = await userModel.findById(req.user._id);
    if (videoTitle) {
      user.videosWatched = [...user.videosWatched, videoTitle];
    }

    user.save();
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in youtube ID controller : ", error);
    res.status(500);
    throw new Error("Internal error");
  }
};
