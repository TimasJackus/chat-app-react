import React, { useCallback, useContext } from "react";
import { IMessage } from "../../types/interfaces";
import { useStyles } from "./Message.styles";
import { Avatar, Dropdown, Icon } from "rsuite";
// @ts-ignore
import uniqolor from "uniqolor";
import clsx from "clsx";
import { ColorEnum } from "../../types/enums/ColorEnum";
import { SidebarUpdateContext } from "../../contexts/Sidebar";

interface IProps {
    message: IMessage;
}

const Message: React.FC<IProps> = ({ message }) => {
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
            <div className={classes.message}>
                <div
                    className={clsx(
                        classes.bold,
                        classes.flex,
                        classes.alignCenter
                    )}
                >
                    <span>{sender.displayName}</span>
                    <span className={classes.date}>{date}</span>
                    <span style={{ marginLeft: 20 }}>
                        Replies: {message.replyCount}{" "}
                    </span>
                    <Dropdown
                        style={{ marginLeft: "auto" }}
                        placement="bottomEnd"
                        renderTitle={() => {
                            return (
                                <Icon
                                    className={classes.moreIconBtn}
                                    icon="more"
                                    size={"2x"}
                                />
                            );
                        }}
                    >
                        <Dropdown.Item onSelect={handleReplySelect}>
                            Reply
                        </Dropdown.Item>
                    </Dropdown>
                </div>
                <p className={classes.content}>{content}</p>
            </div>
        </div>
    );
};

export default React.memo(Message);
