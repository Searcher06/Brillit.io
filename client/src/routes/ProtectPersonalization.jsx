/* eslint-disable react/prop-types */
import { useAuth } from "../Context/authContext";
import { Loader } from "../Components/Loader";
import { Navigate } from "react-router-dom";
export const ProtectPersonalization = ({ children }) => {
  const { user, loading } = useAuth();
  console.log(!user.isVerified);
  if (loading) <Loader />;

  if (user.isVerified && user) {
    return <Navigate to={"/"} />;
  }
  return children;
};
