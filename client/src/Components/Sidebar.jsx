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
  X,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../Context/SidebarContext";
import { useAuth } from "../Context/AuthContext";
import { toast } from "sonner";
import axios from "../utils/axiosConfig";

const navItems = [
  { icon: Home,      label: "Home",         path: "/" },
  { icon: Flame,     label: "Trending",     comingSoon: true },
  { icon: History,   label: "History",      comingSoon: true },
  { icon: Clock3,    label: "Watch Later",  comingSoon: true },
  { icon: ThumbsUp,  label: "Liked Videos", comingSoon: true },
  { icon: BookOpen,  label: "Playlists",    comingSoon: true },
  { icon: Snowflake, label: "SynthAI",      path: "/synthai" },
  { icon: User,      label: "Profile",      path: "/update-profile" },
];

function NavItem({ item, expanded, onClick }) {
  const location = useLocation();
  const { icon: Icon, label, path, comingSoon } = item;
  const isActive = !!path && location.pathname === path;

  return (
    <button
      onClick={() => onClick(item)}
      title={!expanded ? label : undefined}
      className="relative flex items-center rounded-xl transition-all w-full overflow-hidden"
      style={{
        height: 44,
        padding: expanded ? "0 12px" : "0",
        justifyContent: expanded ? "flex-start" : "center",
        color: isActive ? "var(--violet-light)" : comingSoon ? "var(--text-faint)" : "var(--text-muted)",
        backgroundColor: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
        opacity: comingSoon ? 0.9 : 1,
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
          style={{ width: 3, height: 24, backgroundColor: "var(--violet-accent)" }}
        />
      )}
      <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className="flex-shrink-0" style={{ marginLeft: expanded ? 4 : 0 }} />
      {expanded && (
        <span
          className="ml-3 text-sm font-medium whitespace-nowrap"
          style={{ color: isActive ? "var(--violet-light)" : comingSoon ? "var(--text-faint)" : "var(--text-muted)" }}
        >
          {label}
        </span>
      )}
    </button>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const { sidebarExpanded, toggleSidebar, mobileDrawerOpen, closeMobileDrawer } = useSidebar();
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const handleNavClick = (item) => {
    if (item.comingSoon) {
      toast.info(`${item.label} is coming soon.`);
      closeMobileDrawer();
      return;
    }
    if (item.path) {
      navigate(item.path);
      closeMobileDrawer();
    }
  };

  const handleLogOut = async () => {
    closeMobileDrawer();
    try {
      await axios.post("/api/v1/users/sign-out", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign out failed");
    }
  };

  return (
    <>
      {/* ── Desktop left rail (sm+) ── */}
      <aside
        className="sidebar-rail hidden sm:flex flex-col fixed left-0 top-16 z-40"
        style={{
          width: sidebarExpanded ? 200 : 64,
          height: "calc(100vh - 64px)",
          backgroundColor: "var(--glass-bg-heavy)",
          borderRight: "1px solid var(--border-subtle)",
        }}
      >
        <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
          {navItems.map((item) => (
            <NavItem key={item.path || item.label} item={item} expanded={sidebarExpanded} onClick={handleNavClick} />
          ))}
        </nav>
        <div className="p-2 pb-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full h-9 rounded-xl transition-all"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-faint)"; }}
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      <div
        className="sm:hidden fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          opacity: mobileDrawerOpen ? 1 : 0,
          pointerEvents: mobileDrawerOpen ? "auto" : "none",
        }}
        onClick={closeMobileDrawer}
      />

      {/* ── Mobile drawer panel ── */}
      <aside
        className="sm:hidden fixed top-0 left-0 z-50 flex flex-col h-full"
        style={{
          width: 260,
          backgroundColor: "var(--glass-bg-heavy)",
          borderRight: "1px solid var(--border-subtle)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transform: mobileDrawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 280ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 h-16 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <span className="text-base font-bold gradient-text">Brillit.io</span>
          <button
            onClick={closeMobileDrawer}
            className="p-2 rounded-xl transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto mt-1">
          {navItems.map((item) => (
            <NavItem key={item.path || item.label} item={item} expanded={true} onClick={handleNavClick} />
          ))}
        </nav>

        {/* User info + logout at bottom */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          {/* Avatar + name */}
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-500/40 flex-shrink-0" />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-violet-500/40 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: "#f87171" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
