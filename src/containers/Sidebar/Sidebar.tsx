import React, { useCallback, useContext, useMemo, useState } from "react";
import { useStyles } from "./Sidebar.styles";
import {
    Container,
    Divider,
    Footer,
    Header,
    Icon,
    IconButton,
    Loader,
} from "rsuite";
import clsx from "clsx";
import Message from "../../components/Message/Message";
import { SidebarContext, SidebarUpdateContext } from "../../contexts/Sidebar";
import MessageInput from "../../components/MessageInput/MessageInput";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_REPLY } from "../../graphql/mutations/SEND_REPLY";
import MessagesList from "../MessagesList/MessagesList";
import { GET_REPLIES } from "../../graphql/queries/GET_REPLIES";
import { IReplyData, IReplyVars } from "../../types/interfaces/Reply";
import { IMessageData, IUser } from "../../types/interfaces";
import { GET_PINNED_MESSAGES } from "../../graphql/queries/GET_PINNED_MESSAGES";
import { GraphQLError } from "graphql";
import LeaveConfirmModal from "../LeaveConfirmModal/LeaveConfirmModal";
import ErrorModal from "../ErrorModal/ErrorModal";

interface IProps {
    users: IUser[];
    conversations: any[];
    channels: any[];
}

const Sidebar: React.FC<IProps> = ({ users, conversations, channels }) => {
    const [errors, setErrors] = useState<readonly GraphQLError[]>([]);
    const { isOpen, selectedThread, showPinnedMessages } = useContext(
        SidebarContext
    );
    const { close } = useContext(SidebarUpdateContext);
    const classes = useStyles();
    const { loading, data, error } = useQuery<IReplyData, IReplyVars>(
        GET_REPLIES,
        {
            variables: { id: selectedThread?.id },
            skip: !selectedThread,
        }
    );
    const pinnedMsgQuery = useQuery<IMessageData>(GET_PINNED_MESSAGES);
    const [sendReplyMutation] = useMutation(SEND_REPLY, {
        update: function (cache, { data: { sendReply } }) {
            const query = cache.readQuery<any>({
                query: GET_REPLIES,
                variables: { id: selectedThread?.id },
            });
            cache.writeQuery({
                query: GET_REPLIES,
                variables: { id: selectedThread?.id },
                data: { messages: query.messages.concat(sendReply) },
            });
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
    });

    const handleCloseErrorModal = useCallback(() => {
        setErrors([]);
    }, [setErrors]);

    const handleSubmit = useCallback(
        async (message: string | null, image: File | null) => {
            if (selectedThread) {
                await sendReplyMutation({
                    variables: {
                        data: {
                            content: message,
                            parentId: selectedThread.id,
                        },
                        image,
                    },
                });
            }
        },
        [sendReplyMutation, selectedThread]
    );

    const title = useMemo(() => {
        if (showPinnedMessages) {
            return "Pinned Messages";
        }
        return "Thread";
    }, [showPinnedMessages]);

    if (loading || pinnedMsgQuery.loading) {
        return <Loader vertical center content="Loading..." />;
    }
    if (error && selectedThread) {
        return <div>Something went wrong...</div>;
    }

    if (pinnedMsgQuery.error && showPinnedMessages) {
        return <div>Something went wrong...</div>;
    }

    const stateClass = isOpen ? classes.open : classes.closed;
    return (
        <div className={clsx(classes.container, stateClass)}>
            <Header className={classes.header}>
                <h5>{title}</h5>
                <IconButton onClick={close} icon={<Icon icon="close" />} />
            </Header>
            {selectedThread && data && (
                <div>
                    <Message
                        users={users}
                        conversations={conversations}
                        channels={channels}
                        message={selectedThread}
                        isThreadMessage={true}
                    />
                    <Divider />
                    <MessagesList
                        users={users}
                        conversations={conversations}
                        channels={channels}
                        messages={data.messages}
                        noDataText={
                            "There are no replies for this message yet."
                        }
                        isThread={true}
                    />
                </div>
            )}
            {showPinnedMessages && pinnedMsgQuery.data && (
                <div>
                    <MessagesList
                        users={users}
                        conversations={conversations}
                        channels={channels}
                        messages={pinnedMsgQuery.data.messages}
                        noDataText={"There are no pinned messages."}
                        isThread={true}
                    />
                </div>
            )}
            {selectedThread && (
                <Footer className={classes.footer}>
                    <MessageInput
                        users={users}
                        conversations={conversations}
                        channels={channels}
                        handleSubmit={handleSubmit}
                    />
                </Footer>
            )}
            <ErrorModal
                show={errors.length > 0}
                close={handleCloseErrorModal}
                errors={errors}
            />
        </div>
    );
};

export default Sidebar;
