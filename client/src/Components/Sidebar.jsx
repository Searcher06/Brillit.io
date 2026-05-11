import { Home, Snowflake, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Snowflake, label: "SynthAI", path: "/synthai" },
  { icon: User, label: "You", path: "/update-profile" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Desktop left rail */}
      <aside
        className="hidden sm:flex flex-col items-center gap-1 fixed left-0 top-16 h-[calc(100vh-64px)] w-16 py-6 z-40"
        style={{
          backgroundColor: "rgba(10, 10, 15, 0.9)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-1 w-full py-3 px-2 rounded-lg transition-all group"
              style={{
                color: isActive ? "#a78bfa" : "#6b7280",
                backgroundColor: isActive ? "rgba(139, 92, 246, 0.1)" : "transparent",
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full"
                  style={{ backgroundColor: "#7c3aed" }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={isActive ? 2 : 1.5}
                className="transition-colors group-hover:text-violet-400"
              />
              <span className="text-[10px] font-medium transition-colors group-hover:text-violet-400">
                {label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 w-full h-16 flex items-center justify-around px-4 z-50"
        style={{
          backgroundColor: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
              style={{ color: isActive ? "#a78bfa" : "#6b7280" }}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
