import { SubscriptionClient } from "subscriptions-transport-ws";
import { IUser } from "../types/interfaces";

export const subscriptionClient = new SubscriptionClient(
    "ws://localhost:4000/graphql",
    {
        reconnect: true,
        lazy: true,
        connectionParams: () => {
            let user: string | IUser | null = localStorage.getItem(
                "current-user"
            );
            if (user) {
                user = JSON.parse(user) as IUser;
                console.log("connected");
                return {
                    authorization: user.token,
                };
            }
            return null;
        },
    }
);

export const disconnectSocket = () => {
    console.log("remove connection");
    subscriptionClient.unsubscribeAll();
    subscriptionClient.close(true);
};
