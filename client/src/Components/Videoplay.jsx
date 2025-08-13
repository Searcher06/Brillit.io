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

export default function Videoplay() {
  const [videos, setVideos] = useState();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/videos/${id}`, {
          params: {
            channelId: channelId,
            title: title,
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
      <section className="mt-18">
        <section id="videoplay_section" className="flex flex-col w-full">
          <div>
            <div id="video_player" className="">
              <video
                src="/src/assets/video.mp4"
                controls
                className="h-full w-full"
              ></video>
              <p className="text-sm font-semibold pl-1.5 pt-1.5">{title}</p>
              <p className="text-[12px] text-gray-700 pl-1.5">{channelTitle}</p>
            </div>
            <div className="mt-5">
              <div className="flex flex-col gap-6">
                {searchedVideos.map((current, index) => {
                  const date = new Date(current.snippet.publishedAt);
                  const isoDuration = current.contentDetails.duration;
                  return (
                    <div
                      key={index}
                      className="font-[calibri]"
                      onClick={() => {
                        navigate(`/videos/${current.id}`);
                        setCurrentVideo(current);
                      }}
                    >
                      <div
                        className={`bg-center bg-cover h-45 w-full flex items-end justify-end`}
                        style={{
                          backgroundImage: `url(${current.snippet.thumbnails.medium.url})`,
                        }}
                      >
                        <span className="text-sm  text-white font-[calibri] bg-black/80 rounded-xs px-1 py-0 mb-1 mr-2">
                          {<FormatYouTubeDuration isoDuration={isoDuration} />}
                        </span>
                      </div>

                      <div className="mt-2">
                        <p className="font-medium text-[14px] pl-2 pr-2">
                          {current.snippet.title.slice(0, 38)}
                        </p>
                        <div className="flex justify-between text-[13px] text-gray-700 pl-2 pr-2">
                          <p>{current.snippet.channelTitle}</p>
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
