import React, { useCallback, useState } from "react";
import { Icon, Input, InputGroup } from "rsuite";
import { useStyles } from "./MessageInput.styles";

interface IProps {
    handleSubmit: (message: string) => void;
}

const MessageInput: React.FC<IProps> = ({ handleSubmit }) => {
    const [message, setMessage] = useState("");
    const classes = useStyles();

    const handleMessageEnter = useCallback(() => {
        handleSubmit(message);
        setMessage("");
    }, [message, setMessage, handleSubmit]);

    console.log("MESSAGE_INPUT RENDER");

    return (
        <InputGroup inside>
            <Input
                className={classes.input}
                value={message}
                onChange={setMessage}
                onPressEnter={handleMessageEnter}
                placeholder="Write your message here..."
            />
            <InputGroup.Addon>
                <Icon
                    icon="arrow-right"
                    size="lg"
                    className={classes.blueIcon}
                    onClick={handleMessageEnter}
                />
            </InputGroup.Addon>
        </InputGroup>
    );
};

export default MessageInput;
