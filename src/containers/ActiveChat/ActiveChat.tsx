import React, { useEffect, useState } from "react";
import {
    Container,
    Header,
    Content,
    Footer,
    Input,
    InputGroup,
    Icon,
    Loader,
} from "rsuite";
import { useStyles } from "./ActiveChat.styles";
import { User } from "../../interfaces";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations";
import { GET_PRIVATE_MESSAGES } from "../../graphql/queries";
import Message from "../../components/Message/Message";
import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions/MESSAGES_SUBSCRIPTION";
import { useUserContext } from "../../contexts";

interface IActiveChat {
    activeChat: string | null;
    users: User[];
    client: any;
}

export default function ActiveChat({ activeChat, users }: IActiveChat) {
    const styles = useStyles();
    const activeUser = users.find((user) => user.id === activeChat);
    const [message, setMessage] = useState("");
    const { loading, data, error, subscribeToMore } = useQuery(
        GET_PRIVATE_MESSAGES,
        {
            variables: { userId: activeChat },
            skip: !activeChat,
        }
    );

    const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
        update: function (cache, { data: { sendMessage } }) {
            // @ts-ignore
            const { messages } = cache.readQuery({
                query: GET_PRIVATE_MESSAGES,
                variables: { userId: activeChat },
            });
            console.log({ messages, sendMessage });
            cache.writeQuery({
                query: GET_PRIVATE_MESSAGES,
                variables: { userId: activeChat },
                data: { messages: messages.concat(sendMessage) },
            });
        },
    });

    useEffect(() => {
        subscribeToMore({
            document: MESSAGES_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                console.log({ prev, subscriptionData });
                if (!subscriptionData.data) {
                    return prev;
                }
                const newFeedItem = subscriptionData.data.subscribe;

                return Object.assign({}, prev, {
                    messages: [...prev.messages, newFeedItem],
                });
            },
        });
    }, [subscribeToMore]);

    if (loading) {
        return <Loader vertical center content="Loading..." />;
    }
    if (error) {
        return <div>Something went wrong...</div>;
    }

    return (
        <Container>
            <Header className={styles.header}>
                <h4>
                    {activeUser
                        ? `${activeUser.displayName} (${activeUser.email})`
                        : "None selected"}
                </h4>
            </Header>
            <Content>
                {data?.messages &&
                    data?.messages.map((message: any, index: number) => (
                        <Message key={index} {...message} />
                    ))}
            </Content>
            <Footer className={styles.footer}>
                <InputGroup inside>
                    <Input
                        className={styles.messageInput}
                        value={message}
                        onChange={setMessage}
                        placeholder="Write your message here..."
                    />
                    <InputGroup.Addon>
                        <Icon
                            icon="arrow-right"
                            size="lg"
                            className={styles.blueIcon}
                            onClick={async () => {
                                setMessage("");
                                await sendMessageMutation({
                                    variables: {
                                        data: {
                                            content: message,
                                            type: "Private",
                                            targetId: activeChat,
                                        },
                                    },
                                });
                            }}
                        />
                    </InputGroup.Addon>
                </InputGroup>
            </Footer>
        </Container>
    );
}
