import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Container,
    Header,
    Footer,
    Input,
    InputGroup,
    Icon,
    Loader,
    Button,
} from "rsuite";
import { useStyles } from "./ActiveChat.styles";
import { User } from "../../interfaces";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations";
import Message from "../../components/Message/Message";
import { constructGroupName } from "../../utils/constructGroupName";
import { metadata } from "../../utils/metadata";
import { LEAVE_CONVERSATION } from "../../graphql/mutations/LEAVE_CONVERSATION";
import { useHistory } from "react-router-dom";
import AddMembersModal from "../AddMembersModal/AddMembersModal";

interface IProps {
    activeChat: string | null;
    activeChatType: string | null;
    users: User[];
    conversations: any[];
    client: any;
    channels: any[];
    refetch: () => void;
}

export default function ActiveChat({
    activeChat,
    users,
    conversations,
    activeChatType,
    channels,
    refetch,
}: IProps) {
    const [showAddMembers, setShowAddMembers] = useState(false);
    const classes = useStyles();
    const contentRef = useRef<HTMLDivElement>(null);
    const activeUser = users.find((user) => user.id === activeChat);
    const history = useHistory();
    const activeConversation =
        conversations.find(
            (conversation: any) => conversation.id === activeChat
        ) || channels.find((channel: any) => channel.id === activeChat);
    const [message, setMessage] = useState("");
    const { loading, data, error } = useQuery(metadata(activeChatType).query, {
        variables: { userId: activeChat, conversationId: activeChat },
        skip: !activeChat,
    });

    const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
        update: function (cache, { data: { sendMessage } }) {
            const query = cache.readQuery<any>({
                query: metadata(activeChatType).query,
                variables: { userId: activeChat, conversationId: activeChat },
            });
            cache.writeQuery({
                query: metadata(activeChatType).query,
                variables: { userId: activeChat, conversationId: activeChat },
                data: { messages: query.messages.concat(sendMessage) },
            });
        },
    });

    const [leaveConversation] = useMutation(LEAVE_CONVERSATION, {
        onCompleted() {
            refetch();
        },
    });

    const scrollToBottom = useCallback(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo(0, contentRef.current.scrollHeight);
        }
    }, []);

    const toggleAddMembersModal = useCallback(() => {
        setShowAddMembers(!showAddMembers);
    }, [setShowAddMembers, showAddMembers]);

    const handleMessageEnter = useCallback(async () => {
        setMessage("");
        if (activeChatType === "user") {
            await sendMessageMutation({
                variables: {
                    data: {
                        content: message,
                        type: "Private",
                        targetId: activeChat,
                    },
                },
            });
        }
        if (activeChatType === "conversation") {
            await sendMessageMutation({
                variables: {
                    data: {
                        content: message,
                        type: "Conversation",
                        targetId: activeChat,
                    },
                },
            });
        }
    }, [sendMessageMutation, activeChat, message, activeChatType]);

    const handleLeaveConversation = useCallback(async () => {
        history.push("/");
        await leaveConversation({ variables: { id: activeConversation.id } });
    }, [history, activeConversation, leaveConversation]);

    const renderLeaveButton = useCallback(() => {
        if (activeChatType === "conversation" && activeConversation) {
            return <Button onClick={handleLeaveConversation}>Leave</Button>;
        }
    }, [handleLeaveConversation, activeConversation, activeChatType]);

    const renderAddMembers = useCallback(() => {
        if (activeChatType === "conversation" && activeConversation) {
            return <Button onClick={toggleAddMembersModal}>Add members</Button>;
        }
    }, [toggleAddMembersModal, activeConversation, activeChatType]);

    const renderName = useCallback(() => {
        if (activeChatType === "user") {
            return activeUser ? `${activeUser.displayName}` : "None selected";
        }
        if (activeChatType === "conversation") {
            if (activeConversation?.name) {
                return "#" + activeConversation?.name;
            }
            return activeConversation
                ? `${constructGroupName(activeConversation.members)}`
                : "None selected";
        }
        return "None selected";
    }, [activeChatType, activeUser, activeConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom]);

    if (loading) {
        return <Loader vertical center content="Loading..." />;
    }
    if (error) {
        return <div>Something went wrong...</div>;
    }

    return (
        <Container className={classes.container}>
            <Header className={classes.header}>
                <h5>
                    {renderName()} {renderLeaveButton()} {renderAddMembers()}
                </h5>
            </Header>
            <div className={classes.content} ref={contentRef}>
                {data?.messages &&
                    data?.messages.map((message: any, index: number) => (
                        <Message key={index} {...message} />
                    ))}
            </div>
            <Footer className={classes.footer}>
                <InputGroup inside>
                    <Input
                        className={classes.input}
                        value={message}
                        onChange={setMessage}
                        onPressEnter={handleMessageEnter}
                        placeholder="Write your message here..."
                    />
                    <InputGroup.Addon>
                        <Icon
                            icon="arrow-right"
                            size="lg"
                            className={classes.blueIcon}
                            onClick={handleMessageEnter}
                        />
                    </InputGroup.Addon>
                </InputGroup>
            </Footer>
            <AddMembersModal
                id={activeConversation?.id}
                open={showAddMembers}
                handleClose={toggleAddMembersModal}
                refetch={refetch}
                users={users}
            />
        </Container>
    );
}
