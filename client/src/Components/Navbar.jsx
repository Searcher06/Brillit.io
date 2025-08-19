/* eslint-disable react/prop-types */
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
import { useLoading } from "../Context/LoadingContext";

export function Navbar() {
  const { search, SearchHandler } = useContext(SearchContext);
  const { setIscalled } = useContext(CallContext);
  const { setActive } = useContext(ActiveContext);
  const { displayfilter, setDisplayfilter } = useContext(FilterContext);
  const navigate = useNavigate();
  const { setLLoading } = useLoading();
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
      <div className="logo text-2xl text-blue-600 font-semibold pl-2 sm:text-4xl sm:pl-5 lg:pl-9  xl:pl-10">
        Brillit.io
      </div>
      <div className="search flex">
        <input
          type="text"
          onChange={(event) => {
            SearchHandler(event.target.value);
          }}
          value={search}
          placeholder="Search"
          className="h-8  bg-gray-100 pl-2 outline-0 w-39 rounded-l-sm text-sm font-mono sm:h-10 sm:w-69 md:w-74 md:pl-4 md:rounded-l-full lg:w-85 lg:h-11 xl:w-110 xl:pl-4 xl:text-base xl:rounded-l-full"
        />
        <button
          onClick={() => {
            setIscalled(true);
            setLLoading(true);
            setActive("search");
            navigator(navigate);
            console.log("executed");
          }}
          disabled={search.trim() == "" ? true : false}
          className="w-8 bg-blue-600 h-8 rounded-r-sm mr-1 flex justify-center items-center sm:h-10 sm:mr-2 sm:w-12 md:w-14 md:rounded-r-full lg:h-11 xl:rounded-r-full xl:w-12"
        >
          <Search className="text-white align-middle text-sm" size={21} />
        </button>
        <button
          onClick={() => {
            setDisplayfilter(true);
          }}
          className="hidden ml-4 text-[17px] text-gray-900 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faSliders} />
        </button>
      </div>
      <button
        className="hidden text-blue-700 mr-2 text-sm sm:block sm:mr-5 md:mr-4 lg:mr-9 xl:mr-10"
        onClick={() => {
          LogOut();
        }}
      >
        <LogOutIcon size={23} strokeWidth={1.7} />
      </button>
      {displayfilter && <Filter />}
    </nav>
  );
}
