/* eslint-disable no-unused-vars */
import { Navbar } from "./Navbar";
import FormatYouTubeDuration from "./FormatTime";
import { Sidebar } from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { GetNew } from "./GetNew";
import { useContext, useEffect, useState } from "react";
import { Loader } from "./Loader";
import { VideoplayError } from "./VideoplayError";
import { SearchContext } from "../Context/SearchContext";
import axios from "../utils/axiosConfig";
import { useCurrentVideo } from "../Context/currentVideoContext";
import { searchedVideosContext } from "../Context/searchVideosContext";
import { ActiveContext } from "../Context/ActiveContext";
import { useTabContext } from "../Context/TabContext";
import { useAuth } from "../Context/authContext";
import { useTabVideosContext } from "../Context/TabVideosContext";

export default function Videoplay() {
  const [videos, setVideos] = useState();
  const [Loading, setLLoading] = useState(true);
  const { search } = useContext(SearchContext);
  const { currentVideo, setCurrentVideo } = useCurrentVideo();
  const title = currentVideo?.snippet.title;
  const channelTitle = currentVideo?.snippet.channelTitle;
  const channelId = currentVideo?.snippet.channelId;
  const { id } = useParams();
  const [error, setError] = useState();
  const { searchedVideos } = useContext(searchedVideosContext);
  console.log(currentVideo.snippet.title);
  const navigate = useNavigate();
  const { active, setActive } = useContext(ActiveContext);
  const { tabVideos, setTabVideos } = useTabVideosContext();
  const { user, tab, setTab } = useAuth();
  useEffect(() => {
    const fetchVideos = async () => {
      setLLoading(true);
      try {
        try {
          const aiSuggestion = await axios.post("/api/v1/ai/videoSuggestion");
          console.log("Optional axios request succeeded : ", aiSuggestion.data);
        } catch (error) {
          console.warn("Optional axios request failed continuing!", error);
        }
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        setLLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  console.log(tabVideos);
  return (
    <>
      <Navbar />
      <Sidebar />
      <section className="mt-18">
        <section id="videoplay_section" className="flex flex-col w-full">
          <div>
            <div
              id="video_player"
              className="h-54 sm:h-74 md:h-84 lg:h-104 xl:h-124 sm:ml-18 md:mr-10 lg:mr-16"
            >
              {/* <video
                src="/src/assets/video.mp4"
                controls
                className="w-full"
              ></video> */}
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${id}`}
                width={"100%"}
                height={"100%"}
                controls={true}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                      controls: 1,
                    },
                  },
                }}
                style={{
                  all: "unset",
                }}
              />
              <p className="text-sm font-semibold pl-1.5 pt-1.5 md:text-lg lg:text-xl">
                {title}
              </p>
              <p className="text-[12px] text-gray-700 pl-1.5 md:text-base lg:text-[17px]">
                {channelTitle}
              </p>
            </div>
            <div className="mt-16 md:mt-18 lg:mt-20 sm:ml-18">
              <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center lg:flex-row lg:flex-wrap lg:justify-center">
                {active == "search"
                  ? searchedVideos[search]?.map((current, index) => {
                      const date = new Date(current.snippet.publishedAt);
                      const isoDuration = current.contentDetails.duration;
                      return (
                        <div
                          key={index}
                          className="font-[calibri] md:w-80 lg:w-100"
                          onClick={() => {
                            navigate(`/videos/${current.id}`);
                            setCurrentVideo(current);
                          }}
                        >
                          <div
                            className={`bg-center bg-cover h-50 w-full flex items-end justify-end sm:h-60 md:h-50 md:w-83 lg:w-100 lg:h-60`}
                            style={{
                              backgroundImage: `url(${
                                current.snippet.thumbnails.maxres?.url ||
                                current.snippet.thumbnails.standard?.url ||
                                null
                              })`,
                            }}
                          >
                            <span className="text-sm  text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-2">
                              {
                                <FormatYouTubeDuration
                                  isoDuration={isoDuration}
                                />
                              }
                            </span>
                          </div>

                          <div className="mt-2">
                            <p className="font-medium text-[14px] pl-2 pr-2 md:text-base lg:text-base lg:pl-0">
                              {current.snippet.title.slice(0, 38)}
                            </p>
                            <div className="flex justify-between text-[13px] text-gray-700 pl-2 pr-2 md:text-[14px] lg:text-[13px] lg:pr-0 lg:pl-0">
                              <p>{current.snippet.channelTitle}</p>
                              <p>{<GetNew date={date} />}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : tabVideos[tab]?.items.map((current, index) => {
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
                              {
                                <FormatYouTubeDuration
                                  isoDuration={isoDuration}
                                />
                              }
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
                    })}
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
