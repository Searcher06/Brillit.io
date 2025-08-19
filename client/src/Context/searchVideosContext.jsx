/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

export const searchedVideosContext = createContext();

// searchVideosContext.jsx
export function SearchVideoProvider({ children }) {
  const [searchedVideos, setSearchedVideos] = useState({}); // now an object, not array
  return (
    <searchedVideosContext.Provider
      value={{ searchedVideos, setSearchedVideos }}
    >
      {children}
    </searchedVideosContext.Provider>
  );
}

export const useSearchedVideos = () => useContext(searchedVideosContext);
