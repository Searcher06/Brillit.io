/* eslint-disable react/prop-types */
import { WifiOff, RefreshCw, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NetworkError({ error, message, onRetry, showLoginLink }) {
  const navigate = useNavigate();

  const displayMessage =
    message ||
    (error?.response?.data?.message?.includes("getaddrinfo")
      ? "Network error. Please check your connection."
      : error?.response?.data?.message || error?.message || "An unexpected error occurred.");

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 fade-in">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
      >
        <WifiOff size={28} className="text-red-400" />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Something went wrong
      </h2>
      <p className="text-sm text-center max-w-xs mb-6" style={{ color: "var(--text-muted)" }}>
        {displayMessage}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-gradient h-10 px-6 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        )}
        {showLoginLink && (
          <button
            onClick={() => navigate("/login")}
            className="h-10 px-6 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <LogIn size={14} />
            Log in
          </button>
        )}
      </div>
    </div>
  );
}
