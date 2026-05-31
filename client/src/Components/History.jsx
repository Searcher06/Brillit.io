import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Loader } from "./Loader";
import FormatYouTubeDuration from "./FormatTime";
import axios from "../utils/axiosConfig";
import { useCurrentVideo } from "../Context/currentVideoContext";
import { useSidebar } from "../Context/SidebarContext";
import { History as HistoryIcon, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { DateTime } from "luxon";

function groupByDate(entries) {
  const groups = {};
  entries.forEach((entry) => {
    const dt = DateTime.fromJSDate(new Date(entry.watchedAt));
    const day = dt.isValid ? dt.toFormat("MMMM d, yyyy") : "Unknown date";
    if (!groups[day]) groups[day] = [];
    groups[day].push(entry);
  });
  return groups;
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const { setCurrentVideo } = useCurrentVideo();
  const { sidebarExpanded, isMobile } = useSidebar();
  const navigate = useNavigate();

  const sidebarWidth = isMobile ? 0 : (sidebarExpanded ? 200 : 64);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/users/history", { withCredentials: true });
      setHistory(res.data);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleClear = async () => {
    if (!window.confirm("Clear all watch history?")) return;
    try {
      setClearing(true);
      await axios.delete("/api/v1/users/history", { withCredentials: true });
      setHistory([]);
      toast.success("History cleared");
    } catch {
      toast.error("Failed to clear history");
    } finally {
      setClearing(false);
    }
  };

  const handleVideoClick = (entry) => {
    // Reconstruct a minimal video object so Videoplay can render
    setCurrentVideo({
      id: entry.videoId,
      snippet: {
        title: entry.title,
        channelTitle: entry.channelTitle,
        thumbnails: { high: { url: entry.thumbnail } },
        description: "",
      },
      contentDetails: { duration: entry.duration },
    });
    navigate(`/videos/${entry.videoId}`);
  };

  const grouped = groupByDate(history);

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      <Sidebar />

      <main
        className="mt-16 mb-0 min-h-screen main-content"
        style={{ marginLeft: `${sidebarWidth}px`, transition: "margin-left 250ms cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(139,92,246,0.12)" }}
              >
                <HistoryIcon size={20} style={{ color: "var(--violet-light)" }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Watch History</h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {history.length} video{history.length !== 1 ? "s" : ""} watched
                </p>
              </div>
            </div>

            {history.length > 0 && (
              <button
                onClick={handleClear}
                disabled={clearing}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                style={{ color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <Trash2 size={14} />
                {clearing ? "Clearing..." : "Clear all"}
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <Clock size={28} className="text-violet-400" />
              </div>
              <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>No watch history yet</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
                Videos you watch will appear here.
              </p>
              <button onClick={() => navigate("/")} className="btn-gradient h-10 px-6 rounded-xl text-sm font-medium mt-2">
                Browse videos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {Object.entries(grouped).map(([day, entries]) => (
                <div key={day}>
                  {/* Day label */}
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: "var(--text-faint)" }}>
                    {day}
                  </p>

                  <div className="flex flex-col gap-1">
                    {entries.map((entry, i) => (
                      <div
                        key={i}
                        onClick={() => handleVideoClick(entry)}
                        className="flex gap-3 cursor-pointer rounded-xl p-2 transition-all"
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                      >
                        {/* Thumbnail */}
                        <div
                          className="relative flex-shrink-0 rounded-lg overflow-hidden"
                          style={{ width: 140, height: 80, backgroundColor: "var(--bg-tertiary)" }}
                        >
                          {entry.thumbnail ? (
                            <img src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HistoryIcon size={20} style={{ color: "var(--text-faint)" }} />
                            </div>
                          )}
                          {entry.duration && (
                            <span
                              className="absolute bottom-1 right-1 text-[10px] text-white px-1 rounded"
                              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
                            >
                              <FormatYouTubeDuration isoDuration={entry.duration} />
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 py-0.5">
                          <p className="text-sm font-medium leading-snug line-clamp-2 mb-1" style={{ color: "var(--text-primary)" }}>
                            {entry.title}
                          </p>
                          <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {entry.channelTitle}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                            {(() => {
                              const dt = DateTime.fromJSDate(new Date(entry.watchedAt));
                              return dt.isValid ? dt.toRelative() : "";
                            })()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
