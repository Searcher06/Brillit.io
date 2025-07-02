import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

export const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="w-full h-screen flex justify-center items-center text-lg">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}
