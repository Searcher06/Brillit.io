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
  // const videoTitle = req.query.title;
  const channelId = req.query.channelId;

  try {
    // getting the current user
    const user = await userModel.findById(req.user._id);

    // // Finding the video using youtube Id from the DB
    // const videoInfo = await videoModel.findOne({ youtubeId: id });

    // if (!videoInfo) {
    //   res.status(404);
    //   throw new Error("Video not found");
    // }

    // if (videoInfo) {
    //   const videoTitle = videoInfo.title;
    //   user.videosWatched = [...user.videosWatched, videoTitle];
    // }

    // user.save();

    // // Getting the video channelId from the videoInfo variable
    // const channelId = videoInfo.channelId;
    // console.log(channelId);

    // const title = videoInfo.title;

    // // Hitting the youtube API to get videos from the same channel (IDs)
    // const response = await axios.get(
    //   "https://www.googleapis.com/youtube/v3/search",
    //   {
    //     params: {
    //       part: "snippet",
    //       channelId: channelId,
    //       type: "video",
    //       key,
    //       order: "date",
    //       maxResults: 15,
    //       type: "video",
    //     },
    //   }
    // );

    // // Getting the video IDs from the first API call
    // const videoIds = response.data.items
    //   .map((item) => item.id.videoId)
    //   .join(",");

    // const videoRes = await axios.get(
    //   "https://www.googleapis.com/youtube/v3/videos",
    //   {
    //     params: {
    //       key,
    //       id: videoIds,
    //       part: "snippet,contentDetails", // get all the good stuff
    //     },
    //   }
    // );

    // // Storing the channel videos in a variable
    // const channelVideos = await videoRes.data;

    // // Searching recommended videos from typesense
    // const recommendedTypesense = await client
    //   .collections("videos")
    //   .documents()
    //   .search({
    //     q: query,
    //     query_by: "title,channel,tags", // if the problem persist remove 'tags'
    //     query_by_weights: "5,2,1",
    //     sort_by: "views:desc",
    //   });

    // // getting the vidoes IDs
    // const ids = recommendedTypesense.hits.map((hit) => hit.document.id);

    // // getting the recommended videos from the DB by their IDs
    // let recommendedDB = await getVideosFromMongo(ids);
    // recommendedDB = recommendedDB.filter((current, index) => {
    //   return current.title !== title;
    // });
    // const recommendedVideos = recommendedDB;

    // If the query is empty, we will return the channel videos

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId,
          type: "video",
          key,
          order: "date",
          maxResults: 15,
          type: "video",
        },
      }
    );

    const videoIds = response.data.items
      .map((item) => item.id.videoId)
      .join(",");

    const videoRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key,
          id: videoIds,
          part: "snippet,contentDetails", // get all the good stuff
        },
      }
    );
    // Storing the channel videos in a variable
    const channelVideos = await videoRes.data;
    res.status(200).json({ channelVideos });
  } catch (error) {
    console.log("Error in youtube ID controller : ", error);
    res.status(500);
    throw new Error("Internal error");
  }
};
