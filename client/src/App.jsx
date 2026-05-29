/* eslint-disable react/prop-types */
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
import { useLoading } from "./Context/LoadingContext";
import { useSidebar } from "./Context/SidebarContext";
import { SearchX, Link } from "lucide-react";

const recommended = [
  "All",
  "Calculus",
  "Differential equation",
  "Kirchoffs law",
  "Big bang theory",
  "Java programming",
  "Indices",
  "Mail merge",
  "Discrete structures",
  "Trigonometry",
];

// ── Pure helpers (testable) ──────────────────────────────────────────────────

export function getSearchLoadingMessage(query) {
  return `Searching for "${query}"...`;
}

export function getSearchErrorMessage(error) {
  if (!error?.response) return "Network error — check your connection and try again.";
  const status = error.response.status;
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 404) return "No results found for that query.";
  if (status >= 500) return "Server error — please try again in a moment.";
  return error.response.data?.message || "An unexpected error occurred.";
}

export function getEmptyStateSuggestions(recommendedList) {
  return recommendedList.slice(0, 3);
}

// ── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({ video, onClick }) {
  const date = new Date(video.snippet.publishedAt);
  const isoDuration = video.contentDetails.duration;
  const thumb =
    video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high?.url || null;

  return (
    <div onClick={onClick} className="video-card fade-in">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {thumb ? (
          <img src={thumb} alt={video.snippet.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              No thumbnail
            </span>
          </div>
        )}
        <span
          className="absolute bottom-2 right-2 text-xs font-medium px-1.5 py-0.5 rounded text-white"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <FormatYouTubeDuration isoDuration={isoDuration} />
        </span>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium leading-snug line-clamp-2 mb-1.5" style={{ color: "var(--text-primary)" }}>
          {video.snippet.title}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
            {video.snippet.channelTitle}
          </p>
          <p className="text-xs flex-shrink-0" style={{ color: "var(--text-faint)" }}>
            <GetNew date={date} />
          </p>
        </div>
      </div>
    </div>
  );
}

// ── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ query, suggestions, onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)" }}
      >
        <SearchX size={28} className="text-violet-400" />
      </div>
      <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
        No videos found
      </h3>
      <p className="text-sm text-center max-w-xs mb-6" style={{ color: "var(--text-muted)" }}>
        No results for &ldquo;{query}&rdquo;. Try one of these:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((s) => (
          <button key={s} onClick={() => onSuggestionClick(s)} className="chip">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── LoadingState ─────────────────────────────────────────────────────────────

function LoadingState({ message }) {
  return (
    <div className="flex flex-col items-center py-20 gap-3">
      <Loader />
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
    </div>
  );
}

// ── ErrorState ───────────────────────────────────────────────────────────────

function ErrorState({ error, onRetry, is401 }) {
  const message = getSearchErrorMessage(error);
  return <NetworkError error={error} message={message} onRetry={onRetry} showLoginLink={is401} />;
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { search, SearchHandler } = useContext(SearchContext);
  const { LLoading, setLLoading } = useLoading();
  const [error, setError] = useState(null);
  const { called, setIscalled } = useContext(CallContext);
  const { searchedVideos, setSearchedVideos } = useSearchedVideos();
  const { setCurrentVideo } = useCurrentVideo();
  const { user, tab, setTab } = useAuth();
  const { tabVideos, setTabVideos } = useTabVideosContext();
  const { active, setActive } = useContext(ActiveContext);
  const { sidebarExpanded, isMobile } = useSidebar();
  const navigate = useNavigate();

  const sidebarWidth = isMobile ? 0 : (sidebarExpanded ? 200 : 64);

  const searchVideos = async () => {
    try {
      if (searchedVideos[search]) {
        setLLoading(false);
        return;
      }
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

  const handleSuggestionClick = (term) => {
    SearchHandler(term);
    setIscalled((p) => !p);
    setLLoading(true);
    setActive("search");
  };

  const currentVideos = active === "search" ? searchedVideos[search] : tabVideos[tab]?.items;

  const loadingMessage = active === "search" ? getSearchLoadingMessage(search) : "Loading your feed...";

  const is401 = error?.response?.status === 401;

  return (
    <>
      <Navbar />
      <div className="flex w-full overflow-x-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Sidebar />

        <main
          className="flex-1 mt-16 mb-0 min-h-screen w-full overflow-x-hidden main-content"
          style={{
            marginLeft: `${sidebarWidth}px`,
            transition: "margin-left 250ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Sticky chips bar */}
          <div
            className="sticky top-0 z-30"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <Recommendation user={user} recommended={recommended} tab={tab} setError={setError} setTab={setTab} setActive={setActive} />
          </div>

          {/* Content */}
          <div className="px-3 sm:px-4 pt-4 pb-6">
            {LLoading ? (
              <LoadingState message={loadingMessage} />
            ) : error ? (
              <ErrorState
                error={error}
                is401={is401}
                onRetry={() => {
                  setError(null);
                  setLLoading(true);
                  active === "search" ? searchVideos() : searchTabVideos();
                }}
              />
            ) : currentVideos?.length === 0 ? (
              <EmptyState
                query={active === "search" ? search : tab}
                suggestions={getEmptyStateSuggestions(recommended)}
                onSuggestionClick={handleSuggestionClick}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {currentVideos?.map((video, index) => (
                  <VideoCard key={video.id || index} video={video} onClick={() => handleVideoClick(video)} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
