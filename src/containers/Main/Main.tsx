import React, { useState, useEffect } from "react";
import { Container, Loader } from "rsuite";
import ChatList from "../ChatList/ChatList";
import ActiveChat from "../ActiveChat/ActiveChat";
import { GET_USERS } from "../../graphql/queries";
import {
    useQuery,
    ApolloConsumer,
    useSubscription,
    useApolloClient,
} from "@apollo/client";
import { useRouteMatch } from "react-router-dom";
import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions/MESSAGES_SUBSCRIPTION";
import { readQuery } from "../../utils/readQuery";
import { metadata } from "../../utils/metadata";

export default function Main() {
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatType, setActiveChatType] = useState(null);
    const { loading, data, error, refetch } = useQuery(GET_USERS);
    const subscription = useSubscription(MESSAGES_SUBSCRIPTION);
    const client = useApolloClient();
    const match = useRouteMatch<any>();

    useEffect(() => {
        if (subscription.data?.subscribe) {
            const { payload } = subscription.data?.subscribe;
            console.log(subscription.data, activeChatType, payload);
            if (payload.chatId && payload.message) {
                const cache = readQuery(client, {
                    query: metadata(activeChatType).query,
                    variables: {
                        userId: payload.chatId,
                        conversationId: payload.chatId,
                    },
                });

                if (cache?.messages) {
                    client.writeQuery({
                        query: metadata(activeChatType).query,
                        variables: {
                            userId: payload.chatId,
                            conversationId: payload.chatId,
                        },
                        data: {
                            messages: cache.messages.concat(payload.message),
                        },
                    });
                }
            }
        }
    }, [subscription.data, client, activeChatType]);

    useEffect(() => {
        setActiveChat(match.params.id);
        setActiveChatType(match.params.type);
    }, [match.params.id, match.params.type]);

    if (loading) {
        return <Loader vertical center content="Loading..." />;
    }

    if (error) {
        return (
            <Container style={{ height: "100%" }}>
                Something went wrong!
            </Container>
        );
    }

    return (
        <ApolloConsumer>
            {(client) => (
                <Container style={{ height: "100%" }}>
                    <ChatList
                        users={data.users}
                        conversations={data.conversations}
                        channels={data.channels}
                        refetch={refetch}
                    />
                    <ActiveChat
                        users={data.users}
                        conversations={data.conversations}
                        channels={data.channels}
                        activeChat={activeChat}
                        activeChatType={activeChatType}
                        client={client}
                        refetch={refetch}
                    />
                </Container>
            )}
        </ApolloConsumer>
    );
}
