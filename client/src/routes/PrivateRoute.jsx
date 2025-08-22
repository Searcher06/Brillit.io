/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { Loader } from "../Components/Loader";
import { useAuth } from "../Context/AuthContext";

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isPersonalized) {
    return <Navigate to="/personalization" />;
  }

  return children;
};
