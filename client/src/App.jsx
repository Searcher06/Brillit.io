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
import { searchedVideosContext } from "./Context/searchVideosContext";
import FormatYouTubeDuration from "./Components/FormatTime";
import { GetNew } from "./Components/FormatDate";
// import { ErrorOffline } from "./Components/ErrorOffline";
import { useAuth } from "./Context/authContext";
import { useCurrentVideo } from "./Context/currentVideoContext";
import axios from "./utils/axiosConfig";
import Recommendation from "./Components/Recommendation";
export default function App() {
  const { search } = useContext(SearchContext);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { called } = useContext(CallContext);
  const { searchedVideos, setSearchedVideos } = useContext(
    searchedVideosContext
  );
  const { setCurrentVideo } = useCurrentVideo();
  const { user } = useAuth();
  const suggestedKeywords = user?.suggestedKeywords;

  const searchVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/videos/search?q=${search}`, {
        withCredentials: true,
      });
      setSearchedVideos(response.data);
      setError(null);
    } catch (error) {
      setSearchedVideos(null);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (search.length > 0) {
      setLoading(true);
      searchVideos();
      console.log(searchedVideos);
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
  const [tab, setTab] = useState(user?.suggestedKeywords[0]);
  const [tabVideos, setTabVideos] = useState({});

  const searchTabVideos = async () => {
    try {
      const response = await axios.get(`/api/v1/videos/search?q=${tab}`, {
        withCredentials: true,
      });
      setTabVideos((prevState) => ({
        ...prevState,
        [tab]: {
          ...response.data,
          tabName: [tab],
        },
      }));
      console.log("The response:", response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("The current value of tab : ", tab);
    // if (tab) {
    //   fetch("/duration.json")
    //     .then((response) => {
    //       setLoading(true);
    //       return response.json();
    //     })
    //     .then((data) => {
    //       setTabVideos((prevs) => ({
    //         ...prevs,
    //         [tab]: {
    //           ...data,
    //           items: data.items.filter((current) => {
    //             return (
    //               current.snippet.categoryId === "26" ||
    //               current.snippet.categoryId === "27"
    //             );
    //           }),
    //           [tab]: tab,
    //         },
    //       }));
    //       setLoading(false);
    //     })
    //     .catch((err) => {
    //       setError(err);
    //       setLoading(false);
    //       console.log(err);
    //     });
    // }

    searchTabVideos();
    console.log(tabVideos[tab]);
    console.log(tabVideos);
  }, [tab]);

  const navigate = useNavigate();
  const { active, setActive } = useContext(ActiveContext);
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
            {Loading ? (
              // If the current state is loading then return this <Loader /> component
              <Loader />
            ) : // If there is an error the return the <NetworkError /> component
            error ? (
              <NetworkError error={error} />
            ) : active == "tab" ? (
              tabVideos[tab]?.map((current, index) => {
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
                        backgroundImage: `url(${current.snippet.thumbnails.standard.url})`,
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
            ) : active == "search" ? (
              searchedVideos.map((current, index) => {
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
                        backgroundImage: `url(${current.snippet.thumbnails.standard.url})`,
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
