/* eslint-disable no-unused-vars */
import { Navbar } from "./Navbar";
import FormatYouTubeDuration from "./FormatTime";
import { Sidebar } from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { GetNew } from "./GetNew";
import { useContext, useEffect, useState } from "react";
import { Loader } from "./Loader";
import { SearchContext } from "../Context/SearchContext";
import axios from "../utils/axiosConfig";
import { useCurrentVideo } from "../Context/currentVideoContext";
import { searchedVideosContext } from "../Context/searchVideosContext";
import { ActiveContext } from "../Context/ActiveContext";
import { useTabContext } from "../Context/TabContext";
import { useAuth } from "../Context/AuthContext";
import { useTabVideosContext } from "../Context/TabVideosContext";

export default function Videoplay() {
  const [loading, setLoading] = useState(true);
  const { search } = useContext(SearchContext);
  const { currentVideo, setCurrentVideo } = useCurrentVideo();
  const { id } = useParams();
  const { searchedVideos } = useContext(searchedVideosContext);
  const navigate = useNavigate();
  const { active } = useContext(ActiveContext);
  const { tabVideos } = useTabVideosContext();
  const { tab } = useAuth();

  const title = currentVideo?.snippet?.title;
  const channelTitle = currentVideo?.snippet?.channelTitle;

  useEffect(() => {
    const updateWatchHistory = async () => {
      setLoading(true);
      try {
        // Update watch history
        if (title) {
          await axios.get(`/api/v1/videos/${id}?title=${encodeURIComponent(title)}`);
        }
        // Optionally refresh AI keywords in background
        axios.post("/api/v1/ai/videoSuggestion").catch(() => {});
      } catch (err) {
        console.warn("Watch history update failed:", err);
      } finally {
        setLoading(false);
      }
    };
    updateWatchHistory();
  }, [id]);

  const relatedVideos =
    active === "search"
      ? searchedVideos[search] || []
      : tabVideos[tab]?.items || [];

  return (
    <>
      <Navbar />
      <div className="flex" style={{ backgroundColor: "#0a0a0f" }}>
        <Sidebar />

        <main className="flex-1 sm:ml-16 mt-16 mb-16 sm:mb-0 min-h-screen">
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 p-3 sm:p-5 lg:p-6">

            {/* Left — player + info */}
            <div className="flex-1 min-w-0">
              {/* Player */}
              <div
                className="w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: "16/9", background: "#000" }}
              >
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${id}`}
                  width="100%"
                  height="100%"
                  controls
                  config={{
                    youtube: {
                      playerVars: { modestbranding: 1, rel: 0 },
                    },
                  }}
                />
              </div>

              {/* Video info */}
              <div className="mt-4 px-1">
                <h1 className="text-white font-semibold text-base sm:text-lg leading-snug mb-1">
                  {title || "Loading..."}
                </h1>
                <p className="text-gray-500 text-sm">{channelTitle}</p>
              </div>
            </div>

            {/* Right — related videos */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <p className="text-gray-400 text-sm font-medium mb-3 px-1">Related videos</p>

              {loading ? (
                <Loader />
              ) : (
                <div className="flex flex-col gap-3">
                  {relatedVideos.slice(0, 15).map((video, index) => {
                    const date = new Date(video.snippet.publishedAt);
                    const isoDuration = video.contentDetails.duration;
                    const thumb =
                      video.snippet.thumbnails.maxres?.url ||
                      video.snippet.thumbnails.standard?.url ||
                      video.snippet.thumbnails.high?.url ||
                      null;

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setCurrentVideo(video);
                          navigate(`/videos/${video.id}`);
                        }}
                        className="flex gap-3 cursor-pointer group rounded-xl p-2 transition-all hover:bg-white/5"
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-36 h-20 rounded-lg overflow-hidden bg-gray-900">
                          {thumb && (
                            <img
                              src={thumb}
                              alt={video.snippet.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <span
                            className="absolute bottom-1 right-1 text-[10px] text-white px-1 rounded"
                            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
                          >
                            <FormatYouTubeDuration isoDuration={isoDuration} />
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium leading-snug line-clamp-2 mb-1 group-hover:text-violet-300 transition-colors">
                            {video.snippet.title}
                          </p>
                          <p className="text-gray-600 text-xs truncate">
                            {video.snippet.channelTitle}
                          </p>
                          <p className="text-gray-700 text-xs mt-0.5">
                            <GetNew date={date} />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
