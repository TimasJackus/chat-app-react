import React, { useCallback, useMemo, useState } from "react";
import { useStyles } from "./MessageInput.styles";
import "draft-js/dist/Draft.css";
import "draft-js-hashtag-plugin/lib/plugin.css";
import "draft-js-emoji-plugin/lib/plugin.css";
import "draft-js-mention-plugin/lib/plugin.css";
import Editor from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
// @ts-ignore
import createHashtagPlugin from "draft-js-hashtag-plugin";
// @ts-ignore
import createMentionPlugin from "draft-js-mention-plugin";
// @ts-ignore
import { defaultSuggestionsFilter } from "draft-js-mention-plugin";
// @ts-ignore
import { clearEditorContent } from "draftjs-utils";
import { Icon } from "rsuite";
import { IUser } from "../../types/interfaces";
import { useHistory } from "react-router-dom";
import clsx from "clsx";

const positionSuggestions = (settings: any) => {
    const popoverWidth = 250;
    const popoverLeft = settings.decoratorRect.left;
    const windowWidth = window.innerWidth;
    const left =
        windowWidth - popoverLeft > popoverWidth
            ? popoverLeft
            : windowWidth - popoverWidth;
    return {
        left: left + "px",
        top: settings.decoratorRect.top - 40 + "px",
        display: "block",
        transform: "scale(1) translateY(-100%)",
        transformOrigin: "1em 0% 0px",
        transition: "all 0.25s cubic-bezier(0.3, 1.2, 0.2, 1)",
    };
};

interface IProps {
    html?: string;
    readOnly?: boolean;
    handleSubmit?: (message: string) => void;
    users: IUser[];
    conversations: any[];
    channels: any[];
}

const MessageInput: React.FC<IProps> = ({
    handleSubmit,
    readOnly,
    html,
    users,
    conversations,
    channels,
}) => {
    const history = useHistory();
    const classes = useStyles();
    const mentions = useMemo(
        () => users.map((user) => ({ id: user.id, name: user.displayName })),
        [users]
    );
    const [suggestions, setSuggestions] = useState(mentions);
    const [editorState, setEditorState] = useState(
        html
            ? EditorState.createWithContent(
                  convertFromRaw(JSON.parse(html) as any) as any
              )
            : EditorState.createEmpty()
    );

    const handleStateChange = useCallback(
        (state: EditorState) => {
            setEditorState(state);
        },
        [setEditorState]
    );

    const handleMessageEnter = useCallback(() => {
        if (handleSubmit && editorState.getCurrentContent().hasText()) {
            const raw: any = JSON.stringify(
                convertToRaw(editorState.getCurrentContent())
            );
            handleSubmit(raw);

            const state = clearEditorContent(editorState);
            handleStateChange(state);
        }
    }, [handleStateChange, editorState, handleSubmit]);

    const Emoji = useMemo(() => {
        const emojiPlugin = createEmojiPlugin({
            positionSuggestions,
        });
        const { EmojiSuggestions } = emojiPlugin;
        return { emojiPlugin, EmojiSuggestions };
    }, []);

    const handleMentionClick = useCallback(
        (id: string) => () => {
            if (readOnly) {
                if (users.find((user) => user.id === id)) {
                    history.push("/user/" + id);
                }
            }
        },
        [history, users, readOnly]
    );

    const mentionComponent = useCallback(
        (mentionProps: any) => {
            const style = {};
            if (!readOnly) {
                Object.assign(style, { cursor: "default" });
            }
            return (
                <span
                    style={style}
                    className={mentionProps.className}
                    onClick={handleMentionClick(mentionProps.mention.id)}
                >
                    {mentionProps.children}
                </span>
            );
        },
        [readOnly, handleMentionClick]
    );

    const Mentions = useMemo(() => {
        const mentionPlugin = createMentionPlugin({
            positionSuggestions,
            mentionComponent,
        });
        const { MentionSuggestions } = mentionPlugin;
        return { mentionPlugin, MentionSuggestions };
    }, [mentionComponent]);

    const onClick = useCallback(
        (hashtag: string) => () => {
            const channel = channels.find(
                (channel) => `#${channel.name}` === hashtag
            );
            if (channel) {
                history.push("/conversation/" + channel.id);
            }
        },
        [channels, history]
    );

    const hashtagDecoratorComponentEx = useCallback(
        (hashtagDecoratorComponent: any) => (props: any) => {
            const style = { cursor: "pointer" };
            const newProps = { ...props };
            if (readOnly) {
                Object.assign(newProps, {
                    onClick: onClick(props.decoratedText),
                    style,
                });
            }
            return hashtagDecoratorComponent(newProps);
        },
        [onClick, readOnly]
    );

    const HashTag = useMemo(() => {
        const hashTagPlugin = createHashtagPlugin();
        const component = hashTagPlugin.decorators[0].component;
        hashTagPlugin.decorators[0].component = hashtagDecoratorComponentEx(
            component
        );
        return { hashTagPlugin };
    }, [hashtagDecoratorComponentEx]);

    const onSearchChange = useCallback(
        ({ value }) => {
            setSuggestions(defaultSuggestionsFilter(value, mentions));
        },
        [mentions, setSuggestions]
    );

    return (
        <div className={classes.inputWrapper}>
            <div className={clsx({ [classes.input]: !readOnly })}>
                <Editor
                    editorState={editorState}
                    onChange={handleStateChange}
                    placeholder="Enter your text here..."
                    readOnly={readOnly}
                    plugins={[
                        Emoji.emojiPlugin,
                        Mentions.mentionPlugin,
                        HashTag.hashTagPlugin,
                    ]}
                />
            </div>
            <Emoji.EmojiSuggestions />
            <Mentions.MentionSuggestions
                onSearchChange={onSearchChange}
                onAddMention={() => {}}
                suggestions={suggestions}
            />
            {!readOnly && (
                <Icon
                    icon="arrow-right"
                    size="lg"
                    className={classes.blueIcon}
                    onClick={handleMessageEnter}
                />
            )}
        </div>
    );
};

export default MessageInput;

// <InputGroup inside>
//     {/*<Input*/}
//     {/*    className={classes.input}*/}
//     {/*    value={message}*/}
//     {/*    onChange={setMessage}*/}
//     {/*    onPressEnter={handleMessageEnter}*/}
//     {/*    placeholder="Write your message here..."*/}
//     {/*/>*/}
//     {/*<InputGroup.Addon>*/}
//     {/*    <Icon*/}
//     {/*        icon="arrow-right"*/}
//     {/*        size="lg"*/}
//     {/*        className={classes.blueIcon}*/}
//     {/*        onClick={handleMessageEnter}*/}
//     {/*    />*/}
//     {/*</InputGroup.Addon>*/}
// </InputGroup>
