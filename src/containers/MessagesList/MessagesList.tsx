import React from "react";
import { IMessage } from "../../types/interfaces/Message";
import Message from "../../components/Message/Message";
import { IUser } from "../../types/interfaces";
import { useStyles } from "./MessagesList.styles";

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
    const classes = useStyles();
    return (
        <>
            {messages.length > 0 ? (
                messages.map((message, index: number) => (
                    <Message
                        users={users}
                        conversations={conversations}
                        channels={channels}
                        key={message.id + message.updatedAt}
                        message={message}
                        isThreadMessage={isThread}
                    />
                ))
            ) : (
                <div className={classes.info}>
                    There are no messages in this conversation. Write a message
                    to begin conversation.
                </div>
            )}
        </>
    );
};

export default React.memo(MessagesList);
