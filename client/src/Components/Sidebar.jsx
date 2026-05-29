import {
  Home,
  Snowflake,
  User,
  ChevronRight,
  ChevronLeft,
  Flame,
  History,
  Clock3,
  ThumbsUp,
  BookOpen,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";
import { toast } from "sonner";

const navItems = [
  { icon: Home,      label: "Home",         path: "/" },
  { icon: Flame,     label: "Trending",     comingSoon: true },
  { icon: History,   label: "History",      comingSoon: true },
  { icon: Clock3,    label: "Watch Later",  comingSoon: true },
  { icon: ThumbsUp,  label: "Liked Videos", comingSoon: true },
  { icon: BookOpen,  label: "Playlists",    comingSoon: true },
  { icon: Snowflake, label: "SynthAI",      comingSoon: true },
  { icon: User,      label: "You",          path: "/update-profile" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarExpanded, toggleSidebar } = useSidebar();

  const sidebarWidth = sidebarExpanded ? 200 : 64;

  const handleNavClick = (item) => {
    if (item.comingSoon) {
      toast.info(`${item.label} is coming soon.`);
      return;
    }
    if (item.path) navigate(item.path);
  };

  return (
    <>
      {/* ── Desktop left rail ── */}
      <aside
        className="sidebar-rail hidden sm:flex flex-col fixed left-0 top-16 z-40"
        style={{
          width: sidebarWidth,
          height: "calc(100vh - 64px)",
          backgroundColor: "var(--glass-bg-heavy)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
          {navItems.map((item) => {
            const { icon: Icon, label, path, comingSoon } = item;
            const isActive = !!path && location.pathname === path;
            return (
              <button
                key={path || label}
                onClick={() => handleNavClick(item)}
                title={!sidebarExpanded ? label : undefined}
                className="relative flex items-center rounded-xl transition-all group overflow-hidden"
                style={{
                  height: 44,
                  padding: sidebarExpanded ? "0 12px" : "0",
                  justifyContent: sidebarExpanded ? "flex-start" : "center",
                  color: isActive ? "var(--violet-light)" : comingSoon ? "var(--text-faint)" : "var(--text-muted)",
                  backgroundColor: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
                  opacity: comingSoon ? 0.9 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Active left border */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                    style={{ width: 3, height: 24, backgroundColor: "var(--violet-accent)" }}
                  />
                )}

                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className="flex-shrink-0 transition-colors"
                  style={{ marginLeft: sidebarExpanded ? 4 : 0 }}
                />

                {/* Label — only when expanded */}
                {sidebarExpanded && (
                  <span
                    className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                    style={{
                      opacity: sidebarExpanded ? 1 : 0,
                      transition: "opacity 150ms ease",
                      color: isActive ? "var(--violet-light)" : comingSoon ? "var(--text-faint)" : "var(--text-muted)",
                    }}
                  >
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle button */}
        <div className="p-2 pb-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full h-9 rounded-xl transition-all"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-faint)"; }}
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded
              ? <ChevronLeft size={16} />
              : <ChevronRight size={16} />
            }
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom bar ── */}
      {/* Show only the 5 most useful items on mobile to avoid overflow */}
      <nav
        className="mobile-bottom-nav sm:hidden fixed bottom-0 left-0 w-full flex items-center justify-around z-50"
        style={{
          height: "60px",
          backgroundColor: "var(--glass-bg-heavy)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {navItems.slice(0, 5).map((item) => {
          const { icon: Icon, label, path, comingSoon } = item;
          const isActive = !!path && location.pathname === path;
          return (
            <button
              key={path || label}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all"
              style={{
                color: isActive ? "var(--violet-light)" : comingSoon ? "var(--text-faint)" : "var(--text-muted)",
                opacity: comingSoon ? 0.9 : 1,
                minWidth: 0,
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium leading-tight truncate w-full text-center px-1">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
