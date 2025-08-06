import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchContext } from "../Context/SearchContext";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { CallContext } from "../Context/CallContext";
import { useNavigate } from "react-router-dom";
import { ActiveContext } from "../Context/ActiveContext";
import { Filter } from "./Filter";
import { FilterContext } from "../Context/FilterContext";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { LogOutIcon, Search } from "lucide-react";

export function Navbar() {
  const { search, SearchHandler } = useContext(SearchContext);
  const { setIscalled } = useContext(CallContext);
  const { setActive } = useContext(ActiveContext);
  const { displayfilter, setDisplayfilter } = useContext(FilterContext);
  const navigate = useNavigate();
  function navigator(param) {
    if (param) {
      navigate("/");
    }
  }

  const LogOut = async () => {
    try {
      await axios.post("/api/v1/users/sign-out", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // server responded with a non-2xx status
        toast.error(error.response.data.message || "Sign out failed");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        // something else happended
        toast.error("An error occured.");
      }
      console.error(error);
    }
  };

  return (
    <nav className="bg-white z-10 w-full flex h-16 items-center justify-between fixed top-0 left-0">
      <div className="logo text-4xl text-blue-600 font-semibold pl-3">
        Brillit.io
      </div>
      <div className="search flex mr-2">
        <input
          type="text"
          onChange={(event) => {
            SearchHandler(event.target.value);
          }}
          value={search}
          placeholder="Search"
          className="h-9 bg-gray-50 pl-2 outline-0 w-39 rounded-l-sm text-sm md:h-14 md:w-49"
        />
        <button
          onClick={() => {
            setIscalled((prevState) => !prevState);
            setActive("search");
            navigator(navigate);
            console.log("executed");
          }}
          className="w-8 bg-blue-600 h-9 rounded-r-sm mr-1 flex justify-center items-center md:h-14"
        >
          <Search className="text-white align-middle" size={23} />
        </button>
        <button
          onClick={() => {
            setDisplayfilter(true);
          }}
          className="hidden ml-4 text-[17px] text-gray-900 hover:text-gray-700 md:block"
        >
          <FontAwesomeIcon icon={faSliders} />
        </button>

        <button
          className="text-blue-700 text-sm"
          onClick={() => {
            LogOut();
          }}
        >
          <LogOutIcon size={23} strokeWidth={1.7} />
        </button>
      </div>
      {displayfilter && <Filter />}
    </nav>
  );
}
