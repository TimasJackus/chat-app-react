import React, { useCallback, useMemo, useState, useContext } from "react";
import { Emoji, EmojiData, Picker } from "emoji-mart";
import { Icon, IconButton, Modal, Button } from "rsuite";
import { useStyles } from "./Reactions.styles";
import { useMutation } from "@apollo/client";
import { TOGGLE_REACTION } from "../../../graphql/mutations";
import { UserContext } from "../../../contexts/UserContext";

interface IProps {
    message: any;
}

const Reactions: React.FC<IProps> = ({ message }) => {
    const classes = useStyles();
    const [showPicker, setShowPicker] = useState(false);
    const { user } = useContext(UserContext);
    const [toggleReaction] = useMutation(TOGGLE_REACTION);

    const toggleShowPicker = useCallback(() => {
        setShowPicker(!showPicker);
    }, [setShowPicker, showPicker]);

    const handleEmojiSelect = useCallback(
        async (emojiData: EmojiData) => {
            await toggleReaction({
                variables: { messageId: message.id, react: emojiData.id },
            });
            toggleShowPicker();
        },
        [message.id, toggleReaction, toggleShowPicker]
    );

    const handleEmojiClick = useCallback(
        (name: string) => async () => {
            await toggleReaction({
                variables: { messageId: message.id, react: name },
            });
        },
        [message.id, toggleReaction]
    );

    const emojis = useMemo(() => {
        if (!message.reactions) {
            return [];
        }
        return message.reactions.reduce((acc: any, val: any) => {
            const exists = acc.find((item: any) => item.name === val.react);
            if (exists) {
                exists.count += 1;
                exists.users = exists.users.concat([val.user]);
                exists.currentUserSelected = !!exists.users.find(
                    (u: any) => user?.id === u.id
                );
                return acc;
            }
            const react = {
                name: val.react,
                count: 1,
                users: [val.user],
                currentUserSelected: val.user.id === user?.id,
            };
            return acc.concat([react]);
        }, []);
    }, [user, message.reactions]);

    return (
        <div className={classes.pickerWrapper}>
            <Button appearance="ghost" onClick={toggleShowPicker}>
                React
            </Button>
            {emojis.map((reaction: any) => {
                return (
                    <Button
                        appearance={
                            reaction.currentUserSelected ? "primary" : "default"
                        }
                        onClick={handleEmojiClick(reaction.name)}
                        className={classes.emoji}
                        key={reaction.name}
                    >
                        <Emoji
                            key={reaction.name}
                            emoji={reaction.name}
                            set={"twitter"}
                            size={20}
                        />
                        <strong className={classes.count}>
                            {reaction.count}
                        </strong>
                    </Button>
                );
            })}
            {showPicker && (
                <Modal show={showPicker} onHide={toggleShowPicker} size={"xs"}>
                    <Modal.Header>
                        <Modal.Title>Select an Emoji</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Picker set="twitter" onSelect={handleEmojiSelect} />
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default Reactions;
