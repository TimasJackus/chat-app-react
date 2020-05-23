import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
    concat,
    split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import "rsuite/lib/styles/themes/dark/index.less";
import { Routes } from "./routes";
import { IUser } from "./types/interfaces";
import { WebSocketLink } from "@apollo/link-ws";
import "./index.css";
import "rsuite/dist/styles/rsuite-default.css";
import { subscriptionClient } from "./utils/subscriptionClient";
import { SidebarProvider } from "./contexts/Sidebar";
import { UserProvider } from "./contexts/UserContext";
import { createUploadLink } from "apollo-upload-client";

const wsLink = new WebSocketLink(subscriptionClient);
const uploadLink = createUploadLink({
    uri: "http://dc-itc.el.vgtu.lt:22080/stud-18-backend/graphql",
}) as any;

const splitLink = split(
    ({ query }: any) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    uploadLink
);

const authMiddleware = new ApolloLink((operation, forward) => {
    let user: string | IUser | null = localStorage.getItem("current-user");
    if (user) {
        user = JSON.parse(user) as IUser;
        operation.setContext({
            headers: {
                authorization: user.token,
            },
        });
    }

    return forward(operation);
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authMiddleware, splitLink),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <UserProvider>
                <SidebarProvider>
                    <Routes />
                </SidebarProvider>
            </UserProvider>
        </ApolloProvider>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
