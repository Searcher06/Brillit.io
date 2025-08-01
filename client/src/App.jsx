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
  const [tabVideos, setTabVideos] = useState({});
  const [tab, setTab] = useState(user?.suggestedKeywords[0]);

  useEffect(() => {
    if (!tabVideos[tab]) {
      fetch("/duration.json")
        .then((response) => {
          setLoading(true);
          return response.json();
        })
        .then((data) => {
          setTabVideos((prevs) => ({
            ...prevs,
            [tab]: {
              ...data,
              items: data.items.filter((current) => {
                return (
                  current.snippet.categoryId === "26" ||
                  current.snippet.categoryId === "27"
                );
              }),
              [tab]: tab,
            },
          }));
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          console.log(err);
        });
    }
  }, [tab]);

  const navigate = useNavigate();
  const { active, setActive } = useContext(ActiveContext);
  return (
    <>
      <Navbar />

      <Sidebar
        faHome={faHome}
        faSnowflake={faSnowflake}
        faCircleUser={faCircleUser}
      />

      <section id="main_content" className=" ml-18 mt-18">
        <section
          id="recommendation"
          className="font-[calibri] flex justify-between"
        >
          <div className="flex flex-wrap">
            {user?.suggestedKeywords.length > 0
              ? user.suggestedKeywords.map((current, index) => {
                  return current === tab ? (
                    <span
                      key={index}
                      className="bg-black text-white px-4 py-1 rounded-sm m-1"
                    >
                      {current}{" "}
                    </span>
                  ) : (
                    <span
                      key={index}
                      onClick={() => {
                        setTab(current);
                        setActive("tab");
                        setError(null);
                      }}
                      className="bg-gray-200 px-4 py-1 rounded-sm m-1"
                    >
                      {current}{" "}
                    </span>
                  );
                })
              : recommended.map((current, index) => {
                  return current === tab ? (
                    <span
                      key={index}
                      className="bg-black text-white px-4 py-1 rounded-sm m-1"
                    >
                      {current}{" "}
                    </span>
                  ) : (
                    <span
                      key={index}
                      onClick={() => {
                        setTab(current);
                        setActive("tab");
                        setError(null);
                      }}
                      className="bg-gray-200 px-4 py-1 rounded-sm m-1"
                    >
                      {current}{" "}
                    </span>
                  );
                })}
          </div>
        </section>

        {/* Main layout */}
        <section className={`flex flex-wrap`}>
          {Loading ? (
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
                  className="font-[calibri] m-3 hover:scale-[1.05] transition duration-300"
                >
                  <div
                    className=" bg-center rounded-sm bg-cover h-40 w-70 flex items-end justify-end"
                    style={{
                      backgroundImage: `url(${current.snippet.thumbnails.medium.url})`,
                    }}
                  >
                    <span className="text-sm text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-1">
                      {<FormatYouTubeDuration isoDuration={isoDuration} />}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-[15.5px]">
                      {current.snippet.title.slice(0, 30) + "..."}
                    </p>
                    <div className="flex justify-between text-[13px] text-gray-700">
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
                  key={index}
                  className="font-[calibri] m-3 hover:scale-[1.05] transition duration-300"
                >
                  <div
                    onClick={() => {
                      navigate(`/videos/${current.id}`);
                      setCurrentVideo(current);
                    }}
                    className=" bg-center rounded-sm bg-cover h-40 w-70 flex items-end justify-end"
                    style={{
                      backgroundImage: `url(${current.snippet.thumbnails.medium.url})`,
                    }}
                  >
                    <span className="text-sm text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-1">
                      {<FormatYouTubeDuration isoDuration={isoDuration} />}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-[15.5px]">
                      {current.snippet.title.slice(0, 30)}
                    </p>
                    <div className="flex justify-between text-[13px] text-gray-700">
                      <p>{current.snippet.channelTitle}</p>
                      <p>{<GetNew date={date} />}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : null}
        </section>
      </section>
    </>
  );
}
