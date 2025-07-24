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
    const searchResults = await client
      .collections("videos")
      .documents()
      .search({
        q: query,
        query_by: "title,channel,tags", // if the problem persist remove 'tags'
        query_by_weights: "5,1,3",
        sort_by: "views:desc",
        prefix: "true",
      });

    // checking if the result is < 2 || nothing (call the youtube api)
    if (searchResults.hits.length < 3 || null) {
      const freshVideos = await fetchYouTubeVideos(query, res);
      let savedVideos = [];

      if (freshVideos[0]) {
        console.log(
          `Founded ${freshVideos.length} videos from the youtube response`
        );
        const createVideoPromises = freshVideos.map(async (element) => {
          try {
            const video = await videoModel.create({
              youtubeId: element.id,
              title: element.snippet.title,
              description: element.snippet.description,
              channelTitle: element.snippet.channelTitle,
              channelId: element.snippet.channelId,
              thumbnails: {
                default: element.snippet.thumbnails.default.url,
                medium: element.snippet.thumbnails.medium.url,
                high: element.snippet.thumbnails.high.url,
              },
              tags: element.snippet.tags,
              category:
                element.snippet.category === "27"
                  ? "Education"
                  : element.snippet.category === "28"
                  ? "Science and technology"
                  : "",
              publishedAt: element.snippet.publishedAt,
              duration: element.contentDetails.duration,
              searchTerms: query,
              curated: true,
              addedBySearch: true,
              createdAt: Date.now(),
            });

            savedVideos.push(video);
          } catch (err) {
            if (err.code === 11000) {
              console.log(`Duplicate video skipped: ${element.id}`);
            } else {
              console.error("Error creating video:", err);
            }
          }
        });

        await Promise.all(createVideoPromises);

        if (savedVideos) {
          try {
            const typesenseFormat = savedVideos.map((current) => ({
              id: current.youtubeId,
              title: current.title || "",
              description: current.description || "",
              url: `https://youtube.com/watch?v=${current.youtubeId}`,
              channel: current.channelTitle,
              tags: current.tags || [],
              views: 0,
              publishedAt: current.publishedAt
                ? new Date(current.publishedAt).getTime()
                : Date.now(),
              createdAt: Date.now(),
            }));

            // storing videos in typesense
            const typesenseResult = await client
              .collections("videos")
              .documents()
              .import(typesenseFormat, { action: "upsert" });
            console.log("Saved to typesense successfully : ", typesenseResult);
          } catch (error) {
            console.log("Typesense insert error", error);
          }
        }

        return res.status(200).json(savedVideos);
      }
    } else {
      const ids = searchResults.hits.map((hit) => hit.document.id);

      const dbVideos = await getVideosFromMongo(ids);

      // const typesenseVid = searchResults.hits.map(hit => hit.document)

      if (dbVideos) {
        res.status(200).json(dbVideos);
      }
    }
  } catch (error) {
    console.log("search error: ", error);
    res.status(500);
    throw new Error(error);
  }
};
