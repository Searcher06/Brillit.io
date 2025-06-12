import { useAuth } from "../Context/authContext";
import { Navigate } from "react-router-dom";
import { Loader } from "./Loader";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <Loader />
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    return children
};

export default PrivateRoute;
