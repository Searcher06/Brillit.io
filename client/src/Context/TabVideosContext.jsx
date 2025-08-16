/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const TabVideosContext = createContext();

export const TabVideosContextProvider = ({ children }) => {
  const [tabVideos, setTabVideos] = useState({});

  return (
    <TabVideosContext.Provider value={{ setTabVideos, tabVideos }}>
      {children}
    </TabVideosContext.Provider>
  );
};

export const useTabVideosContext = () => useContext(TabVideosContext);
