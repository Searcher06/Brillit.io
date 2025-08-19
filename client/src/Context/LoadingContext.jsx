/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const loadingContext = createContext();

export const LoadingContextProvider = ({ children }) => {
  const [LLoading, setLLoading] = useState(false);
  return (
    <loadingContext.Provider value={{ LLoading, setLLoading }}>
      {children}
    </loadingContext.Provider>
  );
};

export const useLoading = () => useContext(loadingContext);
