import { createContext, useContext, useState } from "react";
import { fakeUsers } from "./fakeUsers";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = (email, password) => {
        const foundUser = fakeUsers.find(
            u => u.email === email && u.password === password
        );

        if (!foundUser) return false;

        localStorage.setItem("user", JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

