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
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations";
import { GET_PRIVATE_MESSAGES } from "../../graphql/queries";
import Message from "../../components/Message/Message";
import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions/MESSAGES_SUBSCRIPTION";

interface IActiveChat {
    activeChat: string | null;
    users: User[];
    client: any;
}

export default function ActiveChat({ activeChat, users }: IActiveChat) {
    const styles = useStyles();
    const activeUser = users.find((user) => user.id === activeChat);
    console.log(activeChat, activeUser);
    const [message, setMessage] = useState("");
    const { loading, data, error, refetch } = useQuery(GET_PRIVATE_MESSAGES, {
        variables: { userId: activeChat },
        skip: !activeChat,
    });
    const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
        onCompleted: () => {
            refetch();
        },
    });
    const subscription = useSubscription(MESSAGES_SUBSCRIPTION);

    useEffect(() => {
        console.log(subscription);
        if (subscription.data?.subscribe?.content) {
            if (subscription.data.subscribe.sender === activeChat) {
                refetch();
                // Notification.open({
                //     title: "Message",
                //     duration: 5000,
                //     description: (
                //         <div style={{ width: 350 }}>
                //             <p>{subscription.data?.subscribe?.content}</p>
                //         </div>
                //     ),
                // });
            }
        }
    }, [subscription, refetch, activeChat]);

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
                            onClick={() => {
                                sendMessageMutation({
                                    variables: {
                                        data: {
                                            content: message,
                                            type: "Private",
                                            targetId: activeChat,
                                        },
                                    },
                                });
                                setMessage("");
                            }}
                        />
                    </InputGroup.Addon>
                </InputGroup>
            </Footer>
        </Container>
    );
}
