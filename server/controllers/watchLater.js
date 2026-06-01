import { userModel } from "../models/user.model.js";

// GET /api/v1/users/watch-later
export const getWatchLater = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("watchLater");
    res.status(200).json(user.watchLater);
  } catch (error) {
    console.error("Error fetching watch later:", error);
    res.status(500).json({ message: "Internal error" });
  }
};

// POST /api/v1/users/watch-later/:videoId
export const addToWatchLater = async (req, res) => {
  const { videoId } = req.params;
  const { title, thumbnail, channelTitle, duration } = req.body;

  try {
    const user = await userModel.findById(req.user._id).select("watchLater");

    // Idempotent — don't add duplicates
    const alreadySaved = user.watchLater.some((v) => v.videoId === videoId);
    if (alreadySaved) {
      return res.status(200).json({ message: "Already saved", saved: true });
    }

    await userModel.findByIdAndUpdate(req.user._id, {
      $push: {
        watchLater: {
          $each: [{ videoId, title, thumbnail, channelTitle, duration, savedAt: new Date() }],
          $position: 0,
        },
      },
    });

    res.status(200).json({ message: "Saved to Watch Later", saved: true });
  } catch (error) {
    console.error("Error adding to watch later:", error);
    res.status(500).json({ message: "Internal error" });
  }
};

// DELETE /api/v1/users/watch-later/:videoId
export const removeFromWatchLater = async (req, res) => {
  const { videoId } = req.params;
  try {
    await userModel.findByIdAndUpdate(req.user._id, {
      $pull: { watchLater: { videoId } },
    });
    res.status(200).json({ message: "Removed from Watch Later", saved: false });
  } catch (error) {
    console.error("Error removing from watch later:", error);
    res.status(500).json({ message: "Internal error" });
  }
};

// DELETE /api/v1/users/watch-later
export const clearWatchLater = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user._id, { watchLater: [] });
    res.status(200).json({ message: "Watch Later cleared" });
  } catch (error) {
    console.error("Error clearing watch later:", error);
    res.status(500).json({ message: "Internal error" });
  }
};
