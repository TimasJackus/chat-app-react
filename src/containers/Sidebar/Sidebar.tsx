import React, { useCallback, useContext } from "react";
import { useStyles } from "./Sidebar.styles";
import { Divider, Footer, Header, Icon, IconButton, Loader } from "rsuite";
import clsx from "clsx";
import Message from "../../components/Message/Message";
import { SidebarContext, SidebarUpdateContext } from "../../contexts/Sidebar";
import MessageInput from "../../components/MessageInput/MessageInput";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_REPLY } from "../../graphql/mutations/SEND_REPLY";
import MessagesList from "../MessagesList/MessagesList";
import { GET_REPLIES } from "../../graphql/queries/GET_REPLIES";
import { IReplyData, IReplyVars } from "../../types/interfaces/Reply";

interface IProps {}

const Sidebar: React.FC<IProps> = () => {
    const { isOpen, selectedThread } = useContext(SidebarContext);
    const { close } = useContext(SidebarUpdateContext);
    const classes = useStyles();
    const { loading, data, error } = useQuery<IReplyData, IReplyVars>(
        GET_REPLIES,
        {
            variables: { id: selectedThread?.id },
            skip: !selectedThread,
        }
    );
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
    });

    const handleSubmit = useCallback(
        async (message: string) => {
            if (selectedThread) {
                await sendReplyMutation({
                    variables: {
                        data: {
                            content: message,
                            parentId: selectedThread.id,
                        },
                    },
                });
            }
        },
        [sendReplyMutation, selectedThread]
    );

    if (loading) {
        return <Loader vertical center content="Loading..." />;
    }
    if (error && selectedThread) {
        return <div>Something went wrong...</div>;
    }

    const stateClass = isOpen ? classes.open : classes.closed;
    return (
        <div className={clsx(classes.container, stateClass)}>
            <Header className={classes.header}>
                <h5>Thread</h5>
                <IconButton onClick={close} icon={<Icon icon="close" />} />
            </Header>
            {selectedThread && data && (
                <div>
                    <Message message={selectedThread} />
                    <Divider />
                    <MessagesList messages={data.messages} />
                </div>
            )}
            <Footer className={classes.footer}>
                <MessageInput handleSubmit={handleSubmit} />
            </Footer>
        </div>
    );
};

export default React.memo(Sidebar);
