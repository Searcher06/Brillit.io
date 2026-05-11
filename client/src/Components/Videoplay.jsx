/* eslint-disable no-unused-vars */
import { Navbar } from "./Navbar";
import FormatYouTubeDuration from "./FormatTime";
import { Sidebar } from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { GetNew } from "./GetNew";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../Context/SearchContext";
import axios from "../utils/axiosConfig";
import { useCurrentVideo } from "../Context/currentVideoContext";
import { searchedVideosContext } from "../Context/searchVideosContext";
import { ActiveContext } from "../Context/ActiveContext";
import { useAuth } from "../Context/AuthContext";
import { useTabVideosContext } from "../Context/TabVideosContext";
import { useSidebar } from "../Context/SidebarContext";
import { ChevronDown, ChevronUp, WifiOff } from "lucide-react";

// ── Skeleton card ────────────────────────────────────────────────────────────
function RelatedVideoSkeleton() {
  return (
    <div className="flex gap-3 p-2">
      <div className="skeleton w-36 h-20 rounded-lg flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1 pt-1">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Videoplay() {
  const [loading, setLoading] = useState(true);
  const [relatedError, setRelatedError] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const { search } = useContext(SearchContext);
  const { currentVideo, setCurrentVideo } = useCurrentVideo();
  const { id } = useParams();
  const { searchedVideos } = useContext(searchedVideosContext);
  const navigate = useNavigate();
  const { active } = useContext(ActiveContext);
  const { tabVideos } = useTabVideosContext();
  const { tab } = useAuth();
  const { sidebarExpanded } = useSidebar();

  const sidebarWidth = sidebarExpanded ? 200 : 64;

  const title       = currentVideo?.snippet?.title;
  const channelTitle = currentVideo?.snippet?.channelTitle;
  const description  = currentVideo?.snippet?.description || "";

  useEffect(() => {
    const updateWatchHistory = async () => {
      setLoading(true);
      setRelatedError(false);
      try {
        if (title) {
          await axios.get(`/api/v1/videos/${id}?title=${encodeURIComponent(title)}`);
        }
        // Refresh AI keywords in background — non-blocking
        axios.post("/api/v1/ai/videoSuggestion").catch(() => {});
      } catch (err) {
        console.warn("Watch history update failed:", err);
        setRelatedError(true);
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
      <div className="w-full overflow-x-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Sidebar />

        <main
          className="mt-16 mb-16 sm:mb-0 min-h-screen w-full overflow-x-hidden"
          style={{
            marginLeft: `${sidebarWidth}px`,
            transition: "margin-left 250ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 max-w-[1600px] mx-auto">

            {/* ── Left: Player + info ── */}
            <div className="flex-1 min-w-0">

              {/* Player */}
              <div
                className="w-full rounded-xl overflow-hidden"
                style={{ aspectRatio: "16/9", backgroundColor: "#000" }}
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
              <div
                className="mt-4 p-4 rounded-xl"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                <h1
                  className="text-base sm:text-lg font-semibold leading-snug mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title || "Loading..."}
                </h1>
                <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                  {channelTitle}
                </p>

                {/* Collapsible description */}
                {description && (
                  <div>
                    <div
                      className="text-sm leading-relaxed"
                      style={{
                        color: "var(--text-muted)",
                        display: "-webkit-box",
                        WebkitLineClamp: descExpanded ? "unset" : 3,
                        WebkitBoxOrient: "vertical",
                        overflow: descExpanded ? "visible" : "hidden",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {description}
                    </div>
                    <button
                      onClick={() => setDescExpanded((p) => !p)}
                      className="flex items-center gap-1 text-xs font-medium mt-2 transition-colors"
                      style={{ color: "var(--violet-light)" }}
                    >
                      {descExpanded ? (
                        <><ChevronUp size={14} /> Show less</>
                      ) : (
                        <><ChevronDown size={14} /> Show more</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Related videos ── */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <p
                className="text-sm font-semibold mb-3 px-1"
                style={{ color: "var(--text-primary)" }}
              >
                Related videos
              </p>

              {relatedError ? (
                <div
                  className="flex flex-col items-center justify-center py-10 rounded-xl gap-3"
                  style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                >
                  <WifiOff size={24} className="text-red-400" />
                  <p className="text-xs text-center px-4" style={{ color: "var(--text-muted)" }}>
                    Could not load related videos. Try refreshing the page.
                  </p>
                </div>
              ) : loading ? (
                <div className="flex flex-col gap-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <RelatedVideoSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
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
                        className="flex gap-3 cursor-pointer group rounded-xl p-2 transition-all"
                        style={{ backgroundColor: "transparent" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        {/* Thumbnail */}
                        <div
                          className="relative flex-shrink-0 w-36 h-20 rounded-lg overflow-hidden"
                          style={{ backgroundColor: "var(--bg-tertiary)" }}
                        >
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
                        <div className="flex-1 min-w-0 py-0.5">
                          <p
                            className="text-xs font-medium leading-snug line-clamp-2 mb-1 transition-colors"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {video.snippet.title}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {video.snippet.channelTitle}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
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
