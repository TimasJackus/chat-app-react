import React, { useState, useEffect } from "react";
import { Container, Loader } from "rsuite";
import ChatList from "../ChatList/ChatList";
import ActiveChat from "../ActiveChat/ActiveChat";
import { GET_USERS } from "../../graphql/queries";
import { useQuery, ApolloConsumer } from "@apollo/client";
import { useRouteMatch } from "react-router-dom";

export default function Main() {
    const [activeChat, setActiveChat] = useState(null);
    const { loading, data, error } = useQuery(GET_USERS);
    const match = useRouteMatch<any>();

    useEffect(() => {
        setActiveChat(match.params.id);
    }, [match.params.id]);

    if (loading) return <Loader vertical center content="Loading..." />;

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
                    <ChatList users={data.users} />
                    <ActiveChat
                        users={data.users}
                        activeChat={activeChat}
                        client={client}
                    />
                </Container>
            )}
        </ApolloConsumer>
    );
}
