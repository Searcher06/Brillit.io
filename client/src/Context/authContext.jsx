import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("Brillit.user"));
        if (storedUser) {
            setUser(storedUser)
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("Brillit.user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("Brillit.user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
