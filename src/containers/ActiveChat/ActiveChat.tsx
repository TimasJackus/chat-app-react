import React, { useState, useEffect } from "react";
import { Loader, Notification, Container, Header, Content } from "rsuite";
import { useStyles } from "./ActiveChat.styles";
import { User } from "../../interfaces";
import { MESSAGES_SUBSCRIPTION } from "../../graphql/subscriptions/MESSAGES_SUBSCRIPTION";
import { useSubscription } from "@apollo/client";

interface IActiveChat {
    activeChat: string | null;
    users: User[];
}

export default function ActiveChat({ activeChat, users }: IActiveChat) {
    const styles = useStyles();
    const activeUser = users.find(user => user.id === activeChat);
    const { data }: any = useSubscription(MESSAGES_SUBSCRIPTION);

    useEffect(() => {
        if (data?.subscribe?.content) {
            Notification.open({
                title: "Message",
                duration: 5000,
                description: (
                    <div style={{ width: 350 }}>
                        <p>{data?.subscribe?.content}</p>
                    </div>
                )
            });
        }
    }, [data]);

    return (
        <Container>
            <Header className={styles.header}>
                <h4>
                    {activeUser
                        ? `${activeUser.displayName} (${activeUser.email})`
                        : "None selected"}
                </h4>
            </Header>
            <Content>Content</Content>
        </Container>
    );
}
