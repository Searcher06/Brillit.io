import dotenv from "dotenv";
import { userModel } from "../models/user.model.js";

dotenv.config();

export const videoId = async (req, res) => {
  const { id: videoId } = req.params;
  const { title, thumbnail, channelTitle, duration } = req.query;

  try {
    if (videoId && title) {
      const newEntry = {
        videoId,
        title:        decodeURIComponent(title),
        thumbnail:    thumbnail    ? decodeURIComponent(thumbnail)    : "",
        channelTitle: channelTitle ? decodeURIComponent(channelTitle) : "",
        duration:     duration     ? decodeURIComponent(duration)     : "",
        watchedAt:    new Date(),
      };

      // Step 1: remove any existing entry for this video (dedup)
      await userModel.findByIdAndUpdate(req.user._id, {
        $pull: { videosWatched: { videoId } },
      });

      // Step 2: add new entry to the front
      await userModel.findByIdAndUpdate(req.user._id, {
        $push: { videosWatched: { $each: [newEntry], $position: 0, $slice: 200 } },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in videoId controller:", error);
    res.status(500).json({ message: "Internal error" });
  }
};
