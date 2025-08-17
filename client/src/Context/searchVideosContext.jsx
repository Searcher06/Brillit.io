/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

export const searchedVideosContext = createContext();

export function SearchVideoProvider({ children }) {
  const [searchedVideos, setSearchedVideos] = useState();
  return (
    <searchedVideosContext.Provider
      value={{ searchedVideos, setSearchedVideos }}
    >
      {children}
    </searchedVideosContext.Provider>
  );
}

export const useSearchedVideos = () => useContext(searchedVideosContext);
