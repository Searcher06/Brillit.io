import { Home, Snowflake, User, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";

const navItems = [
  { icon: Home,      label: "Home",    path: "/" },
  { icon: Snowflake, label: "SynthAI", path: "/synthai" },
  { icon: User,      label: "You",     path: "/update-profile" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarExpanded, toggleSidebar } = useSidebar();

  const sidebarWidth = sidebarExpanded ? 200 : 64;

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
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                title={!sidebarExpanded ? label : undefined}
                className="relative flex items-center rounded-xl transition-all group overflow-hidden"
                style={{
                  height: 44,
                  padding: sidebarExpanded ? "0 12px" : "0",
                  justifyContent: sidebarExpanded ? "flex-start" : "center",
                  color: isActive ? "var(--violet-light)" : "var(--text-muted)",
                  backgroundColor: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
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
                      color: isActive ? "var(--violet-light)" : "var(--text-muted)",
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
      <nav
        className="sm:hidden fixed bottom-0 left-0 w-full h-16 flex items-center justify-around z-50"
        style={{
          backgroundColor: "var(--glass-bg-heavy)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all"
              style={{ color: isActive ? "var(--violet-light)" : "var(--text-muted)" }}
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
