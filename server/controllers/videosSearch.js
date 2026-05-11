import dotenv from "dotenv";
dotenv.config();
import { fetchYouTubeVideos } from "../lib/fetchYoutube.js";

export const searchVideos = async (req, res) => {
  // Getting and sanitizing the search query
  const rawQuery = req.query.q;

  if (!rawQuery || !rawQuery.trim()) {
    return res.status(400).json({ message: "Empty search query" });
  }

  // Sanitize: strip HTML tags and limit length
  const query = rawQuery.trim().replace(/<[^>]*>/g, "").slice(0, 200);

  try {
    const freshVideos = await fetchYouTubeVideos(req, res, query);

    if (freshVideos && freshVideos.length > 0) {
      console.log(
        `Found ${freshVideos.length} videos from the YouTube response`
      );
      return res.status(200).json(freshVideos);
    }

    return res.status(200).json([]);
  } catch (error) {
    console.log("search error: ", error);
    return res.status(500).json({ message: error.message || "Error in search" });
  }
};
