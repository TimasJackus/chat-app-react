import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
    concat
} from "@apollo/client";
import "rsuite/lib/styles/themes/dark/index.less";
import { UserProvider } from "./contexts";
import { Routes } from "./routes";
import { User } from "./interfaces";

const httpLink = new HttpLink({ uri: "http://localhost:4000/" });

const authMiddleware = new ApolloLink((operation, forward) => {
    let user: string | User | null = localStorage.getItem("current-user");
    if (user) {
        user = JSON.parse(user) as User;
        operation.setContext({
            headers: {
                authorization: user.token
            }
        });
    }

    return forward(operation);
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authMiddleware, httpLink)
});

function App() {
    return (
        <ApolloProvider client={client}>
            <UserProvider>
                <Routes />
            </UserProvider>
        </ApolloProvider>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
