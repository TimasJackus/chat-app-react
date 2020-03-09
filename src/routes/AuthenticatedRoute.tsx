import React from "react";
import { useUserContext } from "../contexts";
import { Redirect, RouteProps, Route } from "react-router-dom";
import { Loader } from "rsuite";

export const AuthenticatedRoute = (props: RouteProps) => {
    const { user, loading } = useUserContext();

    if (loading) {
        return <Loader vertical center content="loading" />;
    }

    return user ? <Route {...props} /> : <Redirect to="/login" />;
};
