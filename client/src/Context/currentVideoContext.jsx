import { createContext, useContext, useState } from "react";

const currentVideoContext = createContext();

// eslint-disable-next-line react/prop-types
export const CurrentVideoProvider = ({ children }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  return (
    <currentVideoContext.Provider value={{ currentVideo, setCurrentVideo }}>
      {children}
    </currentVideoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCurrentVideo = () => useContext(currentVideoContext);
