import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const key = process.env.API_KEY;

export const fetchYouTubeVideos = async (req, res, query) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: query,
          part: "id",
          type: "video",
          maxResults: 50,
          key,
        },
      }
    );

    // getting the video ID's
    const ids = await response.data.items
      .map((current) => {
        return current.id.videoId;
      })
      .toString();

    const response2 = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet,contentDetails",
          id: ids,
          key,
        },
      }
    );

    const filtered = await response2.data.items.filter((current) => {
      return (
        current.snippet.categoryId === "26" ||
        current.snippet.categoryId === "27"
      );
    });

    return filtered;
  } catch (error) {
    console.log("Fetch youtube videos error : ", error.message);
    res.status(500);
    throw new Error(error.message);
  }
};
