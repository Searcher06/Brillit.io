/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../utils/axiosConfig";

const WatchLaterContext = createContext(null);

export function WatchLaterProvider({ children }) {
  const [watchLater, setWatchLater] = useState([]);   // array of saved entries
  const [savedIds, setSavedIds] = useState(new Set()); // fast lookup set

  const fetchWatchLater = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/users/watch-later", { withCredentials: true });
      setWatchLater(res.data);
      setSavedIds(new Set(res.data.map((v) => v.videoId)));
    } catch {
      // silently fail — user may not be logged in yet
    }
  }, []);

  useEffect(() => { fetchWatchLater(); }, [fetchWatchLater]);

  const toggleWatchLater = useCallback(async (video) => {
    const videoId = video.id || video.videoId;
    const isSaved = savedIds.has(videoId);

    // Optimistic update
    if (isSaved) {
      setSavedIds((prev) => { const s = new Set(prev); s.delete(videoId); return s; });
      setWatchLater((prev) => prev.filter((v) => v.videoId !== videoId));
    } else {
      setSavedIds((prev) => new Set(prev).add(videoId));
    }

    try {
      if (isSaved) {
        await axios.delete(`/api/v1/users/watch-later/${videoId}`, { withCredentials: true });
      } else {
        const thumb =
          video.snippet?.thumbnails?.maxres?.url ||
          video.snippet?.thumbnails?.standard?.url ||
          video.snippet?.thumbnails?.high?.url ||
          video.thumbnail || "";

        await axios.post(`/api/v1/users/watch-later/${videoId}`, {
          title:        video.snippet?.title || video.title || "",
          thumbnail:    thumb,
          channelTitle: video.snippet?.channelTitle || video.channelTitle || "",
          duration:     video.contentDetails?.duration || video.duration || "",
        }, { withCredentials: true });

        // Refresh to get the full saved entry with _id and savedAt
        fetchWatchLater();
      }
    } catch {
      // Revert optimistic update on failure
      fetchWatchLater();
    }
  }, [savedIds, fetchWatchLater]);

  const isSaved = useCallback((videoId) => savedIds.has(videoId), [savedIds]);

  return (
    <WatchLaterContext.Provider value={{ watchLater, setWatchLater, toggleWatchLater, isSaved, fetchWatchLater }}>
      {children}
    </WatchLaterContext.Provider>
  );
}

export const useWatchLater = () => {
  const ctx = useContext(WatchLaterContext);
  if (!ctx) throw new Error("useWatchLater must be used inside <WatchLaterProvider>");
  return ctx;
};
