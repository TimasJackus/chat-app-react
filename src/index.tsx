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
import { UserProvider } from "./contexts";
import { Routes } from "./routes";
import { User } from "./interfaces";
import { WebSocketLink } from "@apollo/link-ws";
import "./index.css";
import "rsuite/dist/styles/rsuite-dark.css";
import { SubscriptionClient } from "subscriptions-transport-ws";

const httpLink = new HttpLink({ uri: "http://localhost:4000/" });
const subscriptionClient = new SubscriptionClient(
    "ws://localhost:4000/graphql",
    {
        reconnect: true,
        lazy: true,
        connectionParams: () => {
            let user: string | User | null = localStorage.getItem(
                "current-user"
            );
            console.log("get connectionParams()", user);
            if (user) {
                user = JSON.parse(user) as User;
                return {
                    authorization: user.token,
                };
            }
            return null;
        },
    }
);
const wsLink = new WebSocketLink(subscriptionClient);

console.log(wsLink);

subscriptionClient.onConnected(() => {
    setTimeout(() => {
        console.log("remove connection");
        subscriptionClient.unsubscribeAll();
        subscriptionClient.close(true);
    }, 5000);
});

// subscriptionClient.use([()]);

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const authMiddleware = new ApolloLink((operation, forward) => {
    let user: string | User | null = localStorage.getItem("current-user");
    if (user) {
        user = JSON.parse(user) as User;
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
