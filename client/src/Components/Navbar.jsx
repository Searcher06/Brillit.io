import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchContext } from "../Context/SearchContext";
import { faSearch, faSliders } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { CallContext } from "../Context/CallContext";
import { useMatch, useNavigate } from "react-router-dom";
import { ActiveContext } from "../Context/ActiveContext";
import { Filter } from "./Filter";
import { FilterContext } from "../Context/FilterContext";

export function Navbar() {
  const { search, SearchHandler } = useContext(SearchContext)
  const { setIscalled } = useContext(CallContext)
  const { setActive } = useContext(ActiveContext)
  const { displayfilter, setDisplayfilter } = useContext(FilterContext)

  // const isVideoPage = useMatch(`/videos/:id`)
  const navigate = useNavigate()
  function navigator(param) {
    if (param) {
      navigate("/")
    }
  }
  return (<nav className="bg-white z-10 w-full flex h-16 items-center justify-between fixed top-0 left-0">
    <div className="logo  text-3xl text-blue-600 font-semibold pl-8">
      Brillit.io
    </div>
    <div className="search">
      <input type="text" onChange={(event) => {
        SearchHandler(event.target.value)
      }} value={search}
        placeholder="Search" className="h-11 bg-gray-100 pl-5 outline-0 w-120 rounded-l-full" />
      <button onClick={() => {
        setIscalled((prevState) => !prevState)
        setActive("search")
        navigator(navigate)
        console.log("executed")
      }} className="w-14 bg-blue-600 h-11 rounded-r-full">
        <FontAwesomeIcon icon={faSearch} className="text-white" />
      </button>
      <button onClick={() => {
        setDisplayfilter(true)
      }} className="ml-4 text-[17px] text-gray-900 hover:text-gray-700">
        <FontAwesomeIcon icon={faSliders} />
      </button>
    </div>
    <div className="icons pr-7">
      <button className="w-17 bg-blue-600 h-9 text-white  font-[calibri] rounded-sm">
        Login
      </button>
    </div>
    {
      displayfilter && <Filter />
    }
  </nav>);
}

