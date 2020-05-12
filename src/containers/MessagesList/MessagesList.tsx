import React from "react";
import { IMessage } from "../../types/interfaces/Message";
import Message from "../../components/Message/Message";
import { IUser } from "../../types/interfaces";

interface IProps {
    messages: IMessage[];
    isThread: boolean;
    users: IUser[];
    conversations: any[];
    channels: any[];
}

const MessagesList: React.FC<IProps> = ({
    messages,
    isThread,
    users,
    conversations,
    channels,
}) => {
    return (
        <>
            {messages.map((message, index: number) => (
                <Message
                    users={users}
                    conversations={conversations}
                    channels={channels}
                    key={index}
                    message={message}
                    isThreadMessage={isThread}
                />
            ))}
        </>
    );
};

export default React.memo(MessagesList);
