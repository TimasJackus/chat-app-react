import React, { useContext } from "react";
import { Redirect, RouteProps, Route } from "react-router-dom";
import { Loader } from "rsuite";
import { UserContext } from "../contexts/UserContext";

export const AuthenticatedRoute = (props: RouteProps) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <Loader vertical center content="loading" />;
    }

    return user ? <Route {...props} /> : <Redirect to="/login" />;
};
