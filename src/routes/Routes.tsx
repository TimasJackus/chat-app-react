import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from "../containers/Register/Register";
import Login from "../containers/Login/Login";
import Home from "../containers/Home/Home";
import { AuthenticatedRoute } from "./AuthenticatedRoute";

export const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/register">
                    <Register />
                </Route>
                <Route exact={true} path="/login">
                    <Login />
                </Route>
                <AuthenticatedRoute path="/">
                    <Home />
                </AuthenticatedRoute>
            </Switch>
        </BrowserRouter>
    );
};
