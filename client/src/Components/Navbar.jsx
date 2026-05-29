/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from "react";
import { SearchContext } from "../Context/SearchContext";
import { CallContext } from "../Context/CallContext";
import { useNavigate } from "react-router-dom";
import { ActiveContext } from "../Context/ActiveContext";
import { FilterContext } from "../Context/FilterContext";
import { Filter } from "./Filter";
import axios from "../utils/axiosConfig";
import { toast } from "sonner";
import {
  Search, Sun, Moon, X,
  LogOut, ChevronDown, User,
} from "lucide-react";
import { useLoading } from "../Context/LoadingContext";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { useSidebar } from "../Context/SidebarContext";

export function Navbar() {
  const { search, SearchHandler } = useContext(SearchContext);
  const { setIscalled } = useContext(CallContext);
  const { setActive } = useContext(ActiveContext);
  const { displayfilter } = useContext(FilterContext);
  const navigate = useNavigate();
  const { setLLoading } = useLoading();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toggleMobileDrawer } = useSidebar();

  const [searchOpen, setSearchOpen] = useState(false);   // mobile overlay
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus mobile input when overlay opens
  useEffect(() => {
    if (searchOpen) mobileInputRef.current?.focus();
  }, [searchOpen]);

  const triggerSearch = () => {
    if (search.trim() === "") return;
    setIscalled((p) => !p);
    setLLoading(true);
    setActive("search");
    setSearchOpen(false);
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") triggerSearch();
    if (e.key === "Escape") setSearchOpen(false);
  };

  const handleLogOut = async () => {
    setDropdownOpen(false);
    try {
      await axios.post("/api/v1/users/sign-out", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign out failed");
    }
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <>
      <nav
        className="w-full h-16 fixed top-0 left-0 z-50 flex items-center justify-between px-3 sm:px-5 lg:px-8"
        style={{
          backgroundColor: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 1px 0 var(--violet-glow)",
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 flex-shrink-0 min-w-0"
        >
          <span className="text-base sm:text-lg font-bold gradient-text whitespace-nowrap">
            Brillit.io
          </span>
        </button>

        {/* ── Center search (sm+) ── */}
        <div className="hidden sm:flex items-center flex-1 max-w-xl mx-4 lg:mx-8 min-w-0">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => SearchHandler(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search educational videos..."
              className="input-dark w-full h-10 rounded-xl pl-9 pr-4 text-sm"
            />
          </div>
          <button
            onClick={triggerSearch}
            disabled={search.trim() === ""}
            className="btn-gradient ml-2 h-10 px-3 lg:px-4 rounded-xl text-sm font-medium flex-shrink-0 flex items-center gap-1.5"
          >
            <Search size={14} />
            <span className="hidden lg:inline">Search</span>
          </button>
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Mobile search icon */}
          <button
            className="sm:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search size={20} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg transition-all hover:bg-white/10"
            style={{ color: "var(--text-muted)" }}
          >
            {theme === "dark"
              ? <Sun size={18} style={{ transition: "opacity 150ms, transform 150ms" }} />
              : <Moon size={18} style={{ transition: "opacity 150ms, transform 150ms" }} />
            }
          </button>

          {/* User avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-1.5 p-1.5 rounded-xl transition-all hover:bg-white/10"
              aria-label="User menu"
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-500/40"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-violet-500/40"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff" }}
                >
                  {initials}
                </div>
              )}
              <ChevronDown
                size={14}
                className="hidden sm:block transition-transform"
                style={{
                  color: "var(--text-muted)",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl shadow-2xl z-50 overflow-hidden fade-in"
                style={{
                  backgroundColor: "var(--glass-bg-heavy)",
                  border: "1px solid var(--border-color)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* User info */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                    {user?.email}
                  </p>
                </div>

                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/update-profile"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all hover:bg-white/10"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <User size={15} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all hover:bg-red-500/10 text-red-400"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile search overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start pt-3 px-3"
          style={{ backgroundColor: "var(--glass-bg-heavy)", backdropFilter: "blur(16px)" }}
        >
          <div className="relative w-full">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              ref={mobileInputRef}
              type="text"
              value={search}
              onChange={(e) => SearchHandler(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search educational videos..."
              className="input-dark w-full h-12 rounded-xl pl-10 pr-12 text-sm"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {displayfilter && <Filter />}
    </>
  );
}
