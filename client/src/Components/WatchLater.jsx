import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import FormatYouTubeDuration from "./FormatTime";
import { useCurrentVideo } from "../Context/currentVideoContext";
import { useWatchLater } from "../Context/WatchLaterContext";
import { useSidebar } from "../Context/SidebarContext";
import { SaveButton } from "./SaveButton";
import { Clock3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DateTime } from "luxon";
import axios from "../utils/axiosConfig";

export default function WatchLater() {
  const { watchLater, setWatchLater, fetchWatchLater } = useWatchLater();
  const { setCurrentVideo } = useCurrentVideo();
  const { sidebarExpanded, isMobile } = useSidebar();
  const navigate = useNavigate();

  const sidebarWidth = isMobile ? 0 : (sidebarExpanded ? 200 : 64);

  const handleVideoClick = (entry) => {
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

  const handleClearAll = async () => {
    if (!window.confirm("Clear all Watch Later videos?")) return;
    try {
      await axios.delete("/api/v1/users/watch-later", { withCredentials: true });
      setWatchLater([]);
      toast.success("Watch Later cleared");
    } catch {
      toast.error("Failed to clear Watch Later");
    }
  };

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
                <Clock3 size={20} style={{ color: "var(--violet-light)" }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Watch Later</h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {watchLater.length} video{watchLater.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>

            {watchLater.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                style={{ color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <Trash2 size={14} />
                Clear all
              </button>
            )}
          </div>

          {/* Empty state */}
          {watchLater.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <Clock3 size={28} className="text-violet-400" />
              </div>
              <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Nothing saved yet</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
                Hit the bookmark icon on any video to save it here.
              </p>
              <button onClick={() => navigate("/")} className="btn-gradient h-10 px-6 rounded-xl text-sm font-medium mt-2">
                Browse videos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {watchLater.map((entry, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl p-2 transition-all group"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {/* Thumbnail — clickable */}
                  <div
                    className="relative flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    style={{ width: 140, height: 80, backgroundColor: "var(--bg-tertiary)" }}
                    onClick={() => handleVideoClick(entry)}
                  >
                    {entry.thumbnail ? (
                      <img src={entry.thumbnail} alt={entry.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Clock3 size={20} style={{ color: "var(--text-faint)" }} />
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

                  {/* Info — clickable */}
                  <div
                    className="flex-1 min-w-0 py-0.5 cursor-pointer"
                    onClick={() => handleVideoClick(entry)}
                  >
                    <p className="text-sm font-medium leading-snug line-clamp-2 mb-1" style={{ color: "var(--text-primary)" }}>
                      {entry.title}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {entry.channelTitle}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                      Saved {DateTime.fromJSDate(new Date(entry.savedAt)).toRelative()}
                    </p>
                  </div>

                  {/* Remove button */}
                  <div className="flex items-center flex-shrink-0 pr-1">
                    <SaveButton
                      video={{ id: entry.videoId, ...entry }}
                      variant="icon"
                    />
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
