import React, {
    createContext,
    useEffect,
    useState,
    useContext,
    ReactNode,
} from "react";
import { User } from "../interfaces";
import { disconnectSocket } from "../utils/subscriptionClient";

interface IUserContext {
    user: User | null;
    onLogout: () => void;
    onLogin: (newUser: User) => void;
    loading: boolean;
}

export const UserContext = createContext<IUserContext>({
    user: null,
    onLogout: () => {},
    onLogin: () => {},
    loading: true,
});

export const UserProvider = (props: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
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

    const onLogin = (newUser: User) => {
        localStorage.setItem("current-user", JSON.stringify(newUser));
        setUser(newUser);
        setLoading(false);
    };

    const value = { user, onLogout, onLogin, loading };
    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
