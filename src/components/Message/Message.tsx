import React, { useCallback, useContext, useState } from "react";
import { IMessage, IUser } from "../../types/interfaces";
import { useStyles } from "./Message.styles";
import { Avatar, Dropdown, Icon, Loader } from "rsuite";
// @ts-ignore
import uniqolor from "uniqolor";
import clsx from "clsx";
import { ColorEnum } from "../../types/enums/ColorEnum";
import { SidebarUpdateContext } from "../../contexts/Sidebar";
import MessageInput from "../MessageInput/MessageInput";
import { UserContext } from "../../contexts/UserContext";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../graphql/mutations";
import { getQueryByType } from "../../utils/getQueryByType";
import { DELETE_MSG } from "../../graphql/mutations/DELETE_MESSAGE";
import { useRouteMatch } from "react-router-dom";
import { TOGGLE_PIN } from "../../graphql/mutations/TOGGLE_PIN";

interface IProps {
    message: IMessage;
    isThreadMessage: boolean;
    users: IUser[];
    conversations: any[];
    channels: any[];
}

const Message: React.FC<IProps> = ({
    message,
    isThreadMessage,
    users,
    conversations,
    channels,
}) => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const match = useRouteMatch<any>();
    const { user } = useContext(UserContext);
    const { selectThread } = useContext(SidebarUpdateContext);
    const { id, sender, content, updatedAt } = message;
    const classes = useStyles();
    const avatarBackground = uniqolor(
        sender.id + sender.email + sender.displayName
    );
    const avatarColor = avatarBackground.isLight
        ? ColorEnum.Black
        : ColorEnum.White;
    const date = new Date(updatedAt).toLocaleString();
    const [deleteMessageMutation] = useMutation(DELETE_MSG, {
        update: function (cache, { data: { deleteMessage } }) {
            const query = cache.readQuery<any>({
                query: getQueryByType(message.type).query,
                variables: { id: match.params.id },
            });
            const messages = query.messages.filter(
                (m: IMessage) => m.id !== id
            );
            cache.writeQuery({
                query: getQueryByType(message.type).query,
                variables: { id: match.params.id },
                data: { messages },
            });
        },
    });

    const [togglePinMutation] = useMutation(TOGGLE_PIN, {
        update: function (cache, { data: { togglePinned } }) {
            const query = cache.readQuery<any>({
                query: getQueryByType(message.type).query,
                variables: { id: match.params.id },
            });
            const messages = query.messages.map((m: IMessage) => {
                if (m.id === togglePinned.id) {
                    return {
                        ...m,
                        pinned: togglePinned.pinned,
                    };
                    return m;
                }
            });
            cache.writeQuery({
                query: getQueryByType(message.type).query,
                variables: { id: match.params.id },
                data: { messages },
            });
        },
    });

    const handlePinClick = useCallback(async () => {
        await togglePinMutation({ variables: { id: message.id } });
    }, [message, togglePinMutation]);

    const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
        update: function (cache, { data: { sendMessage } }) {
            const query = cache.readQuery<any>({
                query: getQueryByType(message.type).query,
                variables: { id: match.params.id },
            });
            cache.writeQuery({
                query: getQueryByType(message.type).query,
                variables: { id: match.params.id },
                data: {
                    messages: query.messages.map((m: IMessage) => {
                        if (m.id === message.id) {
                            return sendMessage;
                        }
                        return m;
                    }),
                },
            });
            setLoading(false);
            setIsEditing(false);
        },
    });

    const handleSubmit = useCallback(
        async (content: string | null, image: File | null) => {
            setLoading(true);
            await sendMessageMutation({
                variables: {
                    data: {
                        id: message.id,
                        content,
                        type: message.type,
                        targetId: match.params.id,
                    },
                },
            });
        },
        [match.params.id, message, sendMessageMutation]
    );

    const handleToggle = useCallback(
        (open) => {
            setIsDropdownOpen(open);
        },
        [setIsDropdownOpen]
    );

    const handleReplySelect = useCallback(() => {
        selectThread(message);
    }, [message, selectThread]);

    const handleDelete = useCallback(async () => {
        setIsDropdownOpen(false);
        await deleteMessageMutation({ variables: { id } });
    }, [id, deleteMessageMutation, setIsDropdownOpen]);

    const handleEdit = useCallback(() => {
        setIsDropdownOpen(false);
        setIsEditing(true);
    }, [setIsDropdownOpen, setIsEditing]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
    }, [setIsEditing]);

    const renderTitle = useCallback(
        () => <Icon className={classes.moreIconBtn} icon="more" size={"2x"} />,
        [classes]
    );

    const showReplyCount = message.replyCount > 0 && !isThreadMessage;
    const isSender = message.sender.id === user?.id;

    return (
        <div className={classes.container}>
            <Avatar
                className={classes.avatar}
                style={{
                    background: avatarBackground.color,
                    color: avatarColor,
                }}
            >
                {sender.displayName[0]}
            </Avatar>
            <div className={classes.messageWrapper}>
                <div
                    className={clsx({
                        [classes.message]: true,
                        [classes.noBorderBottomRadius]: showReplyCount,
                        [classes.withBorderBottomRadius]: !showReplyCount,
                    })}
                >
                    <div
                        className={clsx(
                            classes.bold,
                            classes.flex,
                            classes.alignCenter
                        )}
                    >
                        <span>{sender.displayName}</span>
                        <span className={classes.date}>{date}</span>
                        <Icon
                            icon="thumb-tack"
                            onClick={handlePinClick}
                            className={clsx({
                                [classes.thumbTack]: true,
                                [classes.pinned]: message.pinned,
                                [classes.notPinned]: !message.pinned,
                            })}
                        />
                        <Dropdown
                            placement="bottomEnd"
                            renderTitle={renderTitle}
                            open={isDropdownOpen}
                            onToggle={handleToggle}
                        >
                            <Dropdown.Item onSelect={handleReplySelect}>
                                Reply
                            </Dropdown.Item>
                            {isSender && (
                                <>
                                    <Dropdown.Item onSelect={handleDelete}>
                                        Delete
                                    </Dropdown.Item>
                                    <Dropdown.Item onSelect={handleEdit}>
                                        Edit
                                    </Dropdown.Item>
                                </>
                            )}
                        </Dropdown>
                    </div>
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className={classes.content}>
                            {content ? (
                                <MessageInput
                                    users={users}
                                    conversations={conversations}
                                    channels={channels}
                                    html={content}
                                    readOnly={true}
                                    isEditing={isEditing}
                                    handleCancelEdit={handleCancel}
                                    handleSubmit={handleSubmit}
                                />
                            ) : (
                                <img
                                    src={message.imageUrl}
                                    className={classes.image}
                                />
                            )}
                        </div>
                    )}
                </div>
                {showReplyCount && (
                    <div
                        className={clsx(
                            classes.replyWrapper,
                            classes.withBorderBottomRadius
                        )}
                    >
                        <span
                            onClick={handleReplySelect}
                            className={classes.repliesCount}
                        >
                            {message.replyCount} replies
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message;
