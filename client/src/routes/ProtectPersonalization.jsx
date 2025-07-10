/* eslint-disable react/prop-types */
import { useAuth } from "../Context/authContext";
import { Loader } from "../Components/Loader";
import { Navigate } from "react-router-dom";
export const ProtectPersonalization = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;

  if (user.isPersonalized && user) {
    return <Navigate to={"/"} />;
  }
  return children;
};
