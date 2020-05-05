import React from "react";
import { IMessage } from "../../types/interfaces/Message";
import Message from "../../components/Message/Message";

interface IProps {
    messages: IMessage[];
}

const MessagesList: React.FC<IProps> = ({ messages }) => {
    return (
        <>
            {messages.map((message, index: number) => (
                <Message key={index} message={message} />
            ))}
        </>
    );
};

export default React.memo(MessagesList);
