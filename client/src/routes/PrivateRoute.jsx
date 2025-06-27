import { useAuth } from "../Context/authContext"
import { Navigate } from "react-router-dom"
export const PrivateRoute = ({ children }) => {
    const { user } = useAuth()
    if (user == null) {
        return <Navigate to={'/login'} />
    }
    return children
}