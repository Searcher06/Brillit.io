/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import axios from '../utils/axiosConfig'
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const checkAuth = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/v1/users/me', { withCredentials: true });
            setUser(res.data.user);
        } catch {
            setUser(null);
        } finally {
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