import dontenv from "dotenv";
import { userModel } from "../models/user.model.js";

dontenv.config();

export const videoId = async (req, res) => {
  const videoTitle = req.query.title;

  try {
    // getting the current user
    const user = await userModel.findById(req.user._id);

    if (videoTitle) {
      // Store structured watch entry with timestamp instead of raw title string
      const watchEntry = {
        title: videoTitle,
        watchedAt: new Date().toISOString(),
      };
      user.videosWatched = [...user.videosWatched, JSON.stringify(watchEntry)];
      await user.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in youtube ID controller : ", error);
    res.status(500).json({ message: "Internal error" });
  }
};
