/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import axios from "../utils/axiosConfig";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);
  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/v1/users/me", {
        withCredentials: true,
      });
      setUser(res.data); // The bug was here before
      console.log("User is set : ", user);
      // console.table(res.data);
      setloading(false);
    } catch {
      setUser(null);
      setloading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, checkAuth, setloading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
