/* eslint-disable react/prop-types */
import { useContext } from "react";
import { SearchContext } from "../Context/SearchContext";
import { CallContext } from "../Context/CallContext";
import { useNavigate } from "react-router-dom";
import { ActiveContext } from "../Context/ActiveContext";
import { FilterContext } from "../Context/FilterContext";
import { Filter } from "./Filter";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { LogOut, Search, Sparkles } from "lucide-react";
import { useLoading } from "../Context/LoadingContext";

export function Navbar() {
  const { search, SearchHandler } = useContext(SearchContext);
  const { setIscalled } = useContext(CallContext);
  const { setActive } = useContext(ActiveContext);
  const { displayfilter, setDisplayfilter } = useContext(FilterContext);
  const navigate = useNavigate();
  const { setLLoading } = useLoading();

  const triggerSearch = () => {
    if (search.trim() === "") return;
    setIscalled((p) => !p);
    setLLoading(true);
    setActive("search");
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") triggerSearch();
  };

  const handleLogOut = async () => {
    try {
      await axios.post("/api/v1/users/sign-out", {}, { withCredentials: true });
      toast.success("Logged out");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign out failed");
      console.error(error);
    }
  };

  return (
    <>
      <nav
        className="w-full h-16 fixed top-0 left-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "rgba(10, 10, 15, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <Sparkles size={18} className="text-violet-400" />
          <span className="text-lg font-bold gradient-text hidden sm:block">Brillit.io</span>
          <span className="text-lg font-bold gradient-text sm:hidden">B.</span>
        </button>

        {/* Search bar */}
        <div className="flex items-center flex-1 max-w-xl mx-4 sm:mx-8">
          <div className="relative w-full">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
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
            className="btn-gradient ml-2 h-10 px-4 rounded-xl text-white text-sm font-medium flex-shrink-0 disabled:opacity-40 flex items-center gap-1.5"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleLogOut}
            className="flex items-center gap-1.5 text-gray-400 hover:text-violet-400 transition-colors text-sm px-2 py-2 rounded-lg hover:bg-white/5"
            aria-label="Log out"
          >
            <LogOut size={18} strokeWidth={1.7} />
            <span className="hidden md:inline text-sm">Logout</span>
          </button>
        </div>
      </nav>

      {displayfilter && <Filter />}
    </>
  );
}
