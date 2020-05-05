import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Header, Footer, Loader, Button } from "rsuite";
import { useStyles } from "./ActiveChat.styles";
import { IMessageData, IMessageVars, IUser } from "../../types/interfaces";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations";
import { constructGroupName } from "../../utils/constructGroupName";
import { getQueryByType } from "../../utils/getQueryByType";
import { LEAVE_CONVERSATION } from "../../graphql/mutations/LEAVE_CONVERSATION";
import { useHistory } from "react-router-dom";
import AddMembersModal from "../AddMembersModal/AddMembersModal";
import MessagesList from "../MessagesList/MessagesList";
import MessageInput from "../../components/MessageInput/MessageInput";

interface IProps {
    activeChat: string | null;
    activeChatType: string | null;
    users: IUser[];
    conversations: any[];
    client: any;
    channels: any[];
    refetch: () => void;
}

const ActiveChat: React.FC<IProps> = ({
    activeChat,
    users,
    conversations,
    activeChatType,
    channels,
    refetch,
}) => {
    const [showAddMembers, setShowAddMembers] = useState(false);
    const classes = useStyles();
    const contentRef = useRef<HTMLDivElement>(null);
    const activeUser = users.find((user) => user.id === activeChat);
    const history = useHistory();
    const activeConversation =
        conversations.find(
            (conversation: any) => conversation.id === activeChat
        ) || channels.find((channel: any) => channel.id === activeChat);
    const { loading, data, error } = useQuery<IMessageData, IMessageVars>(
        getQueryByType(activeChatType).query,
        {
            variables: { id: activeChat },
            skip: !activeChat,
        }
    );

    const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
        update: function (cache, { data: { sendMessage } }) {
            const query = cache.readQuery<any>({
                query: getQueryByType(activeChatType).query,
                variables: { id: activeChat },
            });
            cache.writeQuery({
                query: getQueryByType(activeChatType).query,
                variables: { id: activeChat },
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

    const handleSubmit = useCallback(
        async (message: string) => {
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
        },
        [sendMessageMutation, activeChat, activeChatType]
    );

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
    if (error && activeChat) {
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
                {data && data.messages && (
                    <MessagesList messages={data.messages} />
                )}
            </div>
            <Footer className={classes.footer}>
                <MessageInput handleSubmit={handleSubmit} />
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
};

export default React.memo(ActiveChat);
