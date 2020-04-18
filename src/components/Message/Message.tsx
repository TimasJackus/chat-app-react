import React from "react";
import { User } from "../../interfaces";

interface IMessage {
    sender: User;
    recipient: User;
    content: string;
}

export default function Message({ content, sender }: IMessage) {
    return (
        <div>
            {sender.email}: {content}
        </div>
    );
}
