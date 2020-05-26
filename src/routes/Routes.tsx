import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Register from "../containers/Register/Register";
import Login from "../containers/Login/Login";
import { AuthenticatedRoute } from "./AuthenticatedRoute";
import Main from "../containers/Main/Main";

export const Routes = () => {
    return (
        <BrowserRouter basename="/stud-18">
            <Switch>
                <Route path="/register">
                    <Register />
                </Route>
                <Route exact={true} path="/login">
                    <Login />
                </Route>
                <AuthenticatedRoute path="/:type?/:id?">
                    <Main />
                </AuthenticatedRoute>
            </Switch>
        </BrowserRouter>
    );
};
