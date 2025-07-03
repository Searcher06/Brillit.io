/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import axios from '../utils/axiosConfig'
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const checkAuth = async () => {
        try {
            const res = await axios.get('/api/v1/users/me', { withCredentials: true });
            setUser(res.data); // The bug was here before
            console.log("User is set : ", user)
            console.log(res.data)
            setLoading(false)
        } catch {
            setUser(null);
            setLoading(false)
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
        {children}
    </AuthContext.Provider>

}

export const useAuth = () => useContext(AuthContext)