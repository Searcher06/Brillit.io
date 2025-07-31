import { searchedVideosContext } from "../Context/searchVideosContext";
import { useCurrentVideo } from "../Context/currentVideoContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
// eslint-disable-next-line react/prop-types
export const ProtectWatchVideoPage = ({ children }) => {
  const { searchedVideo } = useContext(searchedVideosContext);
  const { currentVideo } = useCurrentVideo();

  if (!currentVideo && !searchedVideo) {
    return <Navigate to={"/"} />;
  }
  return children;
};
