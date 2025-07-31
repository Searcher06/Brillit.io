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

export default function Videoplay() {
  const [videos, setVideos] = useState();
  const [loading, setLoading] = useState(true);
  const { search } = useContext(SearchContext);
  const { currentVideo, setCurrentVideo } = useCurrentVideo();
  const title = currentVideo?.snippet.title;
  const channelId = currentVideo?.snippet.channelId;
  const { id } = useParams();
  const [error, setError] = useState();
  const { searchedVideos } = useContext(searchedVideosContext);
  console.log(currentVideo.snippet.title);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/videos/${id}`, {
          params: {
            // q: search,
            // title: title,
            // id: id,
            channelId: channelId,
          },
        });
        try {
          const aiSuggestion = await axios.post("/api/v1/ai/videoSuggestion");
          console.log("Optional axios request succeeded : ", aiSuggestion.data);
        } catch (error) {
          console.warn("Optional axios request failed continuing!", error);
        }

        setVideos(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  return (
    <>
      <Navbar />
      <Sidebar />
      <section
        id="main_content"
        className=" ml-18 mt-18 flex justify-center flex-col"
      >
        <section
          id="video-container"
          className="w-[98%] h-[400px] flex items-center"
        >
          {loading ? (
            <Loader />
          ) : error ? (
            <VideoplayError error={error} />
          ) : (
            <>
              <div className="w-[950px] h-[400px]">
                {/* <video src="/src/assets/video.mp4" className="w-full h-full" controls={true}></video> */}

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
              </div>
              <div className="flex flex-wrap overflow-x-hidden overflow-y-auto h-[400px] w-2xl justify-center">
                {loading ? (
                  <Loader />
                ) : (
                  videos.channelVideos.items.map((current, index) => {
                    const date = new Date(current.snippet.publishedAt);
                    const isoDuration = current.contentDetails.duration;
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          navigate(`/videos/${current.id.videoId}`);
                          setCurrentVideo(current);
                        }}
                        className="font-[calibri] m-3"
                      >
                        <div
                          style={{
                            backgroundImage: `url(${current.snippet.thumbnails.medium.url})`,
                          }}
                          className={`bg-center rounded-sm bg-cover h-39 w-60 flex items-end justify-end`}
                        >
                          <span className="text-sm  text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-1">
                            {
                              <FormatYouTubeDuration
                                isoDuration={isoDuration}
                              />
                            }
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[15px]">
                            {current.snippet.title.slice(0, 30) + "..."}
                          </p>
                          <div className="flex justify-between text-[13px] text-gray-700">
                            <p>{current.snippet.channelTitle}</p>
                            <p>{<GetNew date={date} />}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </section>
        <section
          className={`w-full mt-5 ${error || loading ? "hidden" : "block"} ${
            videos?.error ? "hidden" : "block"
          }`}
        >
          <h1 className="font-[calibri] text-2xl font-medium">
            Recommended videos
          </h1>
          <div className="w-full flex flex-wrap justify-start">
            {loading ? (
              <Loader />
            ) : error ? (
              <VideoplayError error={error} />
            ) : videos.error ? null : (
              searchedVideos.map((current, index) => {
                const date = new Date(current.snippet.publishedAt);
                const isoDuration = current.contentDetails.duration;
                return (
                  <div
                    key={index}
                    className="font-[calibri] m-3"
                    onClick={() => {
                      navigate(`/videos/${current.id}`);
                      setCurrentVideo(current);
                    }}
                  >
                    <div
                      className={`bg-center rounded-sm bg-cover h-40 w-68 flex items-end justify-end`}
                      style={{
                        backgroundImage: `url(${current.snippet.thumbnails.medium.url})`,
                      }}
                    >
                      <span className="text-sm  text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-1">
                        {<FormatYouTubeDuration isoDuration={isoDuration} />}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[15.5px]">
                        {current.snippet.title.slice(0, 30) + "..."}
                      </p>
                      <div className="flex justify-between text-[13px] text-gray-700">
                        <p>{current.snippet.channelTitle}</p>
                        <p>{<GetNew date={date} />}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </section>
    </>
  );
}
