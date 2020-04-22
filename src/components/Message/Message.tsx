import React from "react";
import { User } from "../../interfaces";
import { useStyles } from "./Message.styles";
import { Avatar } from "rsuite";
// @ts-ignore
import uniqolor from "uniqolor";

interface IMessage {
    sender: User;
    recipient: User;
    updatedAt: Date;
    content: string;
}

export default function Message({ content, sender, updatedAt }: IMessage) {
    const classes = useStyles();
    const avatarBackground = uniqolor(
        sender.id + sender.email + sender.displayName
    );
    const avatarColor = avatarBackground.isLight ? "#000" : "#FFF";
    const date = new Date(updatedAt).toLocaleString();

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
                <div className={classes.bold}>
                    {sender.displayName}
                    <span className={classes.date}>{date}</span>
                </div>
                <p className={classes.content}>{content}</p>
            </div>
        </div>
    );
}
