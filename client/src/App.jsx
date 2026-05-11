/* eslint-disable no-unused-vars */
import { Sidebar } from "./Components/Sidebar";
import { Navbar } from "./Components/Navbar";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "./Context/SearchContext";
import { Loader } from "./Components/Loader";
import { useNavigate } from "react-router-dom";
import { CallContext } from "./Context/CallContext";
import { ActiveContext } from "./Context/ActiveContext";
import { NetworkError } from "./Components/NetworkError";
import { useSearchedVideos } from "./Context/searchVideosContext";
import FormatYouTubeDuration from "./Components/FormatTime";
import { GetNew } from "./Components/FormatDate";
import { useAuth } from "./Context/AuthContext";
import { useCurrentVideo } from "./Context/currentVideoContext";
import axios from "./utils/axiosConfig";
import Recommendation from "./Components/Recommendation";
import { useTabVideosContext } from "./Context/TabVideosContext";
import { useTabContext } from "./Context/TabContext";
import { useLoading } from "./Context/LoadingContext";
import { SearchX } from "lucide-react";

const recommended = [
  "All", "Calculus", "Differential equation", "Kirchoffs law",
  "Big bang theory", "Java programming", "Indices", "Mail merge",
  "Discrete structures", "Trigonometry",
];

function VideoCard({ video, onClick }) {
  const date = new Date(video.snippet.publishedAt);
  const isoDuration = video.contentDetails.duration;
  const thumb =
    video.snippet.thumbnails.maxres?.url ||
    video.snippet.thumbnails.standard?.url ||
    video.snippet.thumbnails.high?.url ||
    null;

  return (
    <div onClick={onClick} className="video-card fade-in">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt={video.snippet.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            <span className="text-gray-600 text-xs">No thumbnail</span>
          </div>
        )}
        {/* Duration badge */}
        <span
          className="absolute bottom-2 right-2 text-xs text-white font-medium px-1.5 py-0.5 rounded"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <FormatYouTubeDuration isoDuration={isoDuration} />
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-white text-sm font-medium leading-snug line-clamp-2 mb-1.5">
          {video.snippet.title}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-xs truncate max-w-[70%]">
            {video.snippet.channelTitle}
          </p>
          <p className="text-gray-600 text-xs flex-shrink-0">
            <GetNew date={date} />
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)" }}
      >
        <SearchX size={28} className="text-violet-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">No results found</h3>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        No videos found for &ldquo;{query}&rdquo;. Try a different search term.
      </p>
    </div>
  );
}

export default function App() {
  const { search } = useContext(SearchContext);
  const { LLoading, setLLoading } = useLoading();
  const [error, setError] = useState(null);
  const { called } = useContext(CallContext);
  const { searchedVideos, setSearchedVideos } = useSearchedVideos();
  const { setCurrentVideo } = useCurrentVideo();
  const { user, tab, setTab } = useAuth();
  const { tabVideos, setTabVideos } = useTabVideosContext();
  const { active, setActive } = useContext(ActiveContext);
  const navigate = useNavigate();

  const searchVideos = async () => {
    try {
      if (searchedVideos[search]) return; // cache hit
      const response = await axios.get(`/api/v1/videos/search?q=${encodeURIComponent(search)}`, {
        withCredentials: true,
      });
      setSearchedVideos((prev) => ({ ...prev, [search]: response.data }));
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLLoading(false);
    }
  };

  const searchTabVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/videos/search?q=${encodeURIComponent(tab)}`, {
        withCredentials: true,
      });
      setTabVideos((prev) => ({
        ...prev,
        [tab]: { items: [...response.data], tabName: tab },
      }));
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLLoading(false);
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      setLLoading(true);
      searchVideos();
    }
  }, [called]);

  useEffect(() => {
    if (tab && !tabVideos[tab]) {
      setLLoading(true);
      searchTabVideos();
    }
  }, [tab]);

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
    navigate(`/videos/${video.id}`);
  };

  const currentVideos =
    active === "search"
      ? searchedVideos[search]
      : tabVideos[tab]?.items;

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />

        {/* Main content — offset for sidebar on desktop, bottom bar on mobile */}
        <main className="flex-1 sm:ml-16 mt-16 mb-16 sm:mb-0 min-h-screen"
          style={{ backgroundColor: "#0a0a0f" }}>
          {/* Recommendation chips */}
          <div
            className="sticky top-16 z-30 py-2"
            style={{
              backgroundColor: "rgba(10, 10, 15, 0.9)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Recommendation
              user={user}
              recommended={recommended}
              tab={tab}
              setError={setError}
              setTab={setTab}
              setActive={setActive}
            />
          </div>

          {/* Video grid */}
          <div className="px-3 sm:px-4 py-6">
            {LLoading ? (
              <Loader />
            ) : error ? (
              <NetworkError
                error={error}
                onRetry={() => {
                  setError(null);
                  setLLoading(true);
                  active === "search" ? searchVideos() : searchTabVideos();
                }}
              />
            ) : currentVideos?.length === 0 ? (
              <EmptyState query={active === "search" ? search : tab} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {currentVideos?.map((video, index) => (
                  <VideoCard
                    key={video.id || index}
                    video={video}
                    onClick={() => handleVideoClick(video)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
