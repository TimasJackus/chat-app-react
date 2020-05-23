import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Container,
    Header,
    Footer,
    Loader,
    Button,
    Icon,
    Dropdown,
} from "rsuite";
import { useStyles } from "./ActiveChat.styles";
import { IMessageData, IMessageVars, IUser } from "../../types/interfaces";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_MESSAGE, TOGGLE_STAR } from "../../graphql/mutations";
import { constructGroupName } from "../../utils/constructGroupName";
import { getQueryByType } from "../../utils/getQueryByType";
import { LEAVE_CONVERSATION } from "../../graphql/mutations/LEAVE_CONVERSATION";
import { useHistory } from "react-router-dom";
import AddMembersModal from "../AddMembersModal/AddMembersModal";
import MessagesList from "../MessagesList/MessagesList";
import MessageInput from "../../components/MessageInput/MessageInput";
import { FileType } from "rsuite/es/Uploader";
import clsx from "clsx";
import { GET_USERS } from "../../graphql/queries";
import LeaveConfirmModal from "../LeaveConfirmModal/LeaveConfirmModal";

interface IProps {
    activeChat: string | null;
    activeChatType: string | null;
    users: IUser[];
    conversations: any[];
    channels: any[];
    client: any;
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
    const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
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

    const [toggleStar] = useMutation(TOGGLE_STAR, {
        update: function (cache, { data: { toggleStar } }) {
            const query = cache.readQuery<any>({
                query: GET_USERS,
            });
            cache.writeQuery({
                query: GET_USERS,
                data: {
                    conversations: query.conversations.map((c: any) => {
                        return {
                            ...c,
                            starred:
                                c.id === toggleStar.id
                                    ? toggleStar.starred
                                    : c.starred,
                        };
                    }),
                    channels: query.channels.map((c: any) => {
                        return {
                            ...c,
                            starred:
                                c.id === toggleStar.id
                                    ? toggleStar.starred
                                    : c.starred,
                        };
                    }),
                },
            });
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
        async (message: string | null, image: File | null) => {
            console.log(image);
            if (activeChatType === "user") {
                await sendMessageMutation({
                    variables: {
                        data: {
                            content: message,
                            type: "Private",
                            targetId: activeChat,
                        },
                        image,
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
                        image,
                    },
                });
            }
        },
        [sendMessageMutation, activeChat, activeChatType]
    );

    const handleLeaveClose = useCallback(() => {
        setShowLeaveConfirmModal(false);
    }, [setShowLeaveConfirmModal]);

    const handleLeaveClick = useCallback(() => {
        setShowLeaveConfirmModal(true);
    }, [setShowLeaveConfirmModal]);

    const handleLeaveConversation = useCallback(async () => {
        history.push("/");
        await leaveConversation({ variables: { id: activeConversation.id } });
    }, [history, activeConversation, leaveConversation]);

    const handleLeaveConfirm = useCallback(async () => {
        setShowLeaveConfirmModal(false);
        await handleLeaveConversation();
    }, [handleLeaveConversation, setShowLeaveConfirmModal]);

    const renderLeaveButton = useCallback(() => {
        if (activeChatType === "conversation" && activeConversation) {
            return <Button onClick={handleLeaveClick}>Leave</Button>;
        }
    }, [
        handleLeaveConversation,
        activeConversation,
        activeChatType,
        handleLeaveClick,
    ]);

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

    const handleStarClick = useCallback(async () => {
        await toggleStar({ variables: { id: activeConversation.id } });
    }, [toggleStar, activeConversation]);

    const renderStar = useCallback(() => {
        if (activeChatType === "conversation" && activeConversation) {
            return (
                <Icon
                    icon={activeConversation.starred ? "star" : "star-o"}
                    onClick={handleStarClick}
                    style={{ marginLeft: 10 }}
                    className={clsx({
                        [classes.pointer]: true,
                        [classes.yellow]: activeConversation.starred,
                    })}
                />
            );
        }
    }, [handleStarClick, classes, activeChatType, activeConversation]);

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
                    {renderStar()}
                </h5>
            </Header>
            <div className={classes.content} ref={contentRef}>
                {data && data.messages && (
                    <MessagesList
                        users={users}
                        conversations={conversations}
                        channels={channels}
                        messages={data.messages}
                        isThread={false}
                    />
                )}
            </div>
            <Footer className={classes.footer}>
                <MessageInput
                    users={users}
                    conversations={conversations}
                    channels={channels}
                    handleSubmit={handleSubmit}
                />
            </Footer>
            <AddMembersModal
                id={activeConversation?.id}
                open={showAddMembers}
                handleClose={toggleAddMembersModal}
                refetch={refetch}
                users={users}
            />
            <LeaveConfirmModal
                open={showLeaveConfirmModal}
                handleConfirm={handleLeaveConfirm}
                handleClose={handleLeaveClose}
            />
        </Container>
    );
};

export default React.memo(ActiveChat);
