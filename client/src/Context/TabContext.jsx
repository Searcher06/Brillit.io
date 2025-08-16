/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
// import { useAuth } from "./authContext";

const TabContext = createContext();
export const TabContextProvider = ({ children }) => {
  const [tab, setTab] = useState();
  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => useContext(TabContext);
