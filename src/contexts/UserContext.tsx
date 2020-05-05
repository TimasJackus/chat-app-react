import React, { createContext, useEffect, useState } from "react";
import { IUser } from "../types/interfaces";
import { disconnectSocket } from "../utils/subscriptionClient";

interface IUserContext {
    user: IUser | null;
    onLogout: () => void;
    onLogin: (newUser: IUser) => void;
    loading: boolean;
}

export const UserContext = createContext<IUserContext>({
    user: null,
    onLogout: () => {},
    onLogin: () => {},
    loading: true,
});

export const UserProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = localStorage.getItem("current-user");
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }
        setLoading(false);
    }, []);

    const onLogout = () => {
        disconnectSocket();
        localStorage.removeItem("current-user");
        setUser(null);
        setLoading(false);
    };

    const onLogin = (newUser: IUser) => {
        localStorage.setItem("current-user", JSON.stringify(newUser));
        setUser(newUser);
        setLoading(false);
    };

    const value = { user, onLogout, onLogin, loading };
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};
