/* eslint-disable no-unused-vars */
import { Sidebar } from "./Components/Sidebar";
import { faCircleUser, faSnowflake } from "@fortawesome/free-regular-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "./Components/Navbar";
import "../src/assets/bg.png";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "./Context/SearchContext";
import { Loader } from "./Components/Loader";
import { useNavigate } from "react-router-dom";
import { CallContext } from "./Context/CallContext";
import { ActiveContext } from "./Context/ActiveContext";
import { NetworkError } from "./Components/NetworkError";
import { useSearchedVideos } from "./Context/searchVideosContext";
import FormatYouTubeDuration from "./Components/FormatTime";
import { GetNew } from "./Components/FormatDate";
import { useAuth } from "./Context/authContext";
import { useCurrentVideo } from "./Context/currentVideoContext";
import axios from "./utils/axiosConfig";
import Recommendation from "./Components/Recommendation";
import { useTabVideosContext } from "./Context/TabVideosContext";
import { useTabContext } from "./Context/TabContext";
import { useLoading } from "./Context/LoadingContext";
export default function App() {
  const { search } = useContext(SearchContext);
  const { LLoading, setLLoading } = useLoading();
  const [error, setError] = useState(null);
  const { called, setIscalled } = useContext(CallContext);
  const { searchedVideos, setSearchedVideos } = useSearchedVideos();
  const { setCurrentVideo } = useCurrentVideo();
  const { user, tab, setTab } = useAuth();

  const searchVideos = async () => {
    try {
      // avoid API call if already cached
      if (searchedVideos[search]) {
        console.log("Cache hit, no API call");
        return;
      }

      const response = await axios.get(`/api/v1/videos/search?q=${search}`, {
        withCredentials: true,
      });

      setSearchedVideos((prev) => ({
        ...prev,
        [search]: response.data, // store by query term
      }));

      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLLoading(false);
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      setLLoading(true);
      searchVideos();
      console.log(searchedVideos);
      console.log("Search Videos only executed");
    }
  }, [called]);

  const recommended = [
    "All",
    "Calculus",
    "Differential equation",
    "Kirchoffs law",
    "Big bang theory",
    "Java programming",
    "Indices",
    "Mail merge",
    "Descrete structures",
    "Trigonometry",
  ];

  const { tabVideos, setTabVideos } = useTabVideosContext();

  const searchTabVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/videos/search?q=${tab}`, {
        withCredentials: true,
      });
      setTabVideos((prevState) => ({
        ...prevState,
        [tab]: {
          items: [...response.data],
          tabName: [tab],
        },
      }));
      console.log("The response:", response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLLoading(false);
    }
  };
  useEffect(() => {
    if (!tabVideos[tab]) {
      setLLoading(true);
      searchTabVideos();
      console.log(tabVideos[tab]);
      console.log(tabVideos);
      console.log(tab);
      console.log("Search Tab Videos executed");
    }
  }, [tab]);

  const navigate = useNavigate();
  const { active, setActive } = useContext(ActiveContext);
  console.log(tabVideos[tab]);
  return (
    <>
      <Navbar />
      <section id="main_content" className="mt-18">
        <div>
          <Recommendation
            user={user}
            recommended={recommended}
            tab={tab}
            setError={setError}
            setTab={setTab}
            setActive={setActive}
          />
          {/* Main layout */}
          <section
            className={`mb-18 flex flex-col items-center flex-wrap gap-4 sm:ml-16 sm:flex-row sm:flex-wrap sm:justify-self-stretch sm:gap-3 md:justify-center`}
          >
            {LLoading ? (
              // If the current state is loading then return this <Loader /> component
              <Loader />
            ) : // If there is an error the return the <NetworkError /> component
            error ? (
              <NetworkError error={error} />
            ) : active == "tab" ? (
              tabVideos[tab]?.items.map((current, index) => {
                const date = new Date(current.snippet.publishedAt);
                const isoDuration = current.contentDetails.duration;
                return (
                  <div
                    onClick={() => {
                      navigate(`/videos/${current.id}`);
                      setCurrentVideo(current);
                    }}
                    key={index}
                    className="font-[calibri] p-3 hover:scale-[1.05] transition duration-300 w-full sm:w-full  md:w-72 lg:w-90 xl:w-88"
                  >
                    <div
                      className=" bg-center rounded-sm bg-cover w-full h-40 sm:w-full sm:h-60 md:w-72 lg:w-90 lg:h-46 xl:w-88 flex items-end justify-end"
                      style={{
                        backgroundImage: `url(${
                          current.snippet.thumbnails.maxres?.url ||
                          current.snippet.thumbnails.standard?.url ||
                          null
                        })`,
                      }}
                    >
                      <span className=" text-[13px] text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-3 sm:text-[14px]">
                        {<FormatYouTubeDuration isoDuration={isoDuration} />}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-sm sm:text-base md:text-base">
                        {current.snippet.title.slice(0, 34)}
                      </p>
                      <div className="flex justify-between text-[13px] text-gray-700 mr-4">
                        <p>{current.snippet.channelTitle.slice(0, 30)}</p>
                        <p>{<GetNew date={date} />}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : active == "search" ? ( // delay updating seach
              searchedVideos[search]?.map((current, index) => {
                const date = new Date(current.snippet.publishedAt);
                const isoDuration = current.contentDetails.duration;
                return (
                  <div
                    onClick={() => {
                      navigate(`/videos/${current.id}`);
                      setCurrentVideo(current);
                    }}
                    key={index}
                    className="font-[calibri] p-3 hover:scale-[1.05] transition duration-300 w-full sm:w-full  md:w-72 lg:w-90 xl:w-88"
                  >
                    <div
                      className=" bg-center rounded-sm bg-cover w-full h-40 sm:w-full sm:h-60 md:w-72 lg:w-90 lg:h-46 xl:w-88 flex items-end justify-end"
                      style={{
                        backgroundImage: `url(${
                          current.snippet.thumbnails.maxres?.url ||
                          current.snippet.thumbnails.standard?.url ||
                          null
                        })`,
                      }}
                    >
                      <span className=" text-[13px] text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-3 sm:text-[14px]">
                        {<FormatYouTubeDuration isoDuration={isoDuration} />}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-sm sm:text-base md:text-base">
                        {current.snippet.title.slice(0, 34)}
                      </p>
                      <div className="flex justify-between text-[13px] text-gray-700 mr-4">
                        <p>{current.snippet.channelTitle.slice(0, 30)}</p>
                        <p>{<GetNew date={date} />}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : null}
          </section>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </section>
    </>
  );
}
