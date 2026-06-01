/* eslint-disable react/prop-types */
import { Bookmark } from "lucide-react";
import { useWatchLater } from "../Context/WatchLaterContext";
import { toast } from "sonner";

/**
 * variant="icon"   — just the bookmark icon (for video cards, hover overlay)
 * variant="pill"   — icon + label (for the watch page)
 */
export function SaveButton({ video, variant = "icon", className = "" }) {
  const { toggleWatchLater, isSaved } = useWatchLater();
  const videoId = video?.id || video?.videoId;
  const saved = isSaved(videoId);

  const handleClick = async (e) => {
    e.stopPropagation(); // don't trigger card click
    await toggleWatchLater(video);
    toast.success(saved ? "Removed from Watch Later" : "Saved to Watch Later");
  };

  if (variant === "pill") {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${className}`}
        style={
          saved
            ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff" }
            : { backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border-color)" }
        }
        aria-label={saved ? "Remove from Watch Later" : "Save to Watch Later"}
      >
        <Bookmark size={15} fill={saved ? "#fff" : "none"} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  // icon variant — shown on card hover
  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${className}`}
      style={
        saved
          ? { background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "#fff" }
          : { backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", backdropFilter: "blur(4px)" }
      }
      aria-label={saved ? "Remove from Watch Later" : "Save to Watch Later"}
    >
      <Bookmark size={14} fill={saved ? "#fff" : "none"} />
    </button>
  );
}
