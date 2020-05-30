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
import { getQueryByType } from "../../utils/getQueryByType";
import Sidebar from "../Sidebar/Sidebar";
import { useStyles } from "./Main.styles";
import EditProfile from "../EditProfile/EditProfile";

const Main = () => {
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatType, setActiveChatType] = useState(null);
    const { loading, data, error, refetch } = useQuery(GET_USERS);
    const subscription = useSubscription(MESSAGES_SUBSCRIPTION);
    const client = useApolloClient();
    const match = useRouteMatch<any>();
    const classes = useStyles();

    useEffect(() => {
        if (subscription.data?.subscribe) {
            const { payload, event } = subscription.data?.subscribe;
            if (payload.chatId && payload.message) {
                const cache = readQuery(client, {
                    query: getQueryByType(event).query,
                    variables: {
                        id: payload.chatId,
                    },
                });

                if (cache?.messages) {
                    client.writeQuery({
                        query: getQueryByType(event).query,
                        variables: {
                            id: payload.chatId,
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
                <Container className={classes.container}>
                    <ChatList
                        users={data.users}
                        conversations={data.conversations}
                        channels={data.channels}
                        refetch={refetch}
                    />
                    {match.params.type === "edit" ? (
                        <EditProfile />
                    ) : (
                        <>
                            <ActiveChat
                                users={data.users}
                                conversations={data.conversations}
                                channels={data.channels}
                                activeChat={activeChat}
                                activeChatType={activeChatType}
                                client={client}
                                refetch={refetch}
                            />
                            <Sidebar
                                users={data.users}
                                conversations={data.conversations}
                                channels={data.channels}
                            />
                        </>
                    )}
                </Container>
            )}
        </ApolloConsumer>
    );
};

export default Main;
