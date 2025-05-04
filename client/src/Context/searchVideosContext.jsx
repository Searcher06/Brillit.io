import { createContext, useState } from "react";

export const searchedVideosContext = createContext()

export function SearchVideoProvider({ children }) {
    const [searchedVideos, setSearchedVideos] = useState([])
    return <searchedVideosContext.Provider value={{ searchedVideos, setSearchedVideos }}>
        {children}
    </searchedVideosContext.Provider>
}