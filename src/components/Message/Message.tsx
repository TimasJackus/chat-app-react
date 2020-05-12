import React, { useCallback, useContext } from "react";
import { IMessage, IUser } from "../../types/interfaces";
import { useStyles } from "./Message.styles";
import { Avatar, Dropdown, Icon } from "rsuite";
// @ts-ignore
import uniqolor from "uniqolor";
import clsx from "clsx";
import { ColorEnum } from "../../types/enums/ColorEnum";
import { SidebarUpdateContext } from "../../contexts/Sidebar";
import MessageInput from "../MessageInput/MessageInput";

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
    const { selectThread } = useContext(SidebarUpdateContext);
    const { sender, content, updatedAt } = message;
    const classes = useStyles();
    const avatarBackground = uniqolor(
        sender.id + sender.email + sender.displayName
    );
    const avatarColor = avatarBackground.isLight
        ? ColorEnum.Black
        : ColorEnum.White;
    const date = new Date(updatedAt).toLocaleString();

    const handleReplySelect = useCallback(() => {
        selectThread(message);
    }, [message, selectThread]);

    const renderTitle = useCallback(
        () => <Icon className={classes.moreIconBtn} icon="more" size={"2x"} />,
        [classes]
    );

    const showReplyCount = message.replyCount > 0 && !isThreadMessage;

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
                        <Dropdown
                            style={{ marginLeft: "auto" }}
                            placement="bottomEnd"
                            renderTitle={renderTitle}
                        >
                            <Dropdown.Item onSelect={handleReplySelect}>
                                Reply
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                    <div className={classes.content}>
                        <MessageInput
                            users={users}
                            conversations={conversations}
                            channels={channels}
                            html={content}
                            readOnly={true}
                        />
                    </div>
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

export default React.memo(Message);
