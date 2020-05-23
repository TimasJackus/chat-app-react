import React, { useCallback, useMemo, useState } from "react";
import { Button, Dropdown, Input, Loader, Modal } from "rsuite";
import { useQuery } from "@apollo/client";
import { SEARCH } from "../../graphql/queries";
import { IUser } from "../../types/interfaces";
import { useStyles } from "./SearchModal.styles";
import { constructGroupName } from "../../utils/constructGroupName";
import { useHistory } from "react-router-dom";

interface IProps {
    open: boolean;
    handleClose: () => void;
}

const SearchModal: React.FC<IProps> = ({ open, handleClose }) => {
    const classes = useStyles();
    const [searchValue, setSearchValue] = useState<string | null>(null);
    const { loading, data } = useQuery(SEARCH, {
        skip: searchValue === null,
        variables: { by: searchValue },
    });
    const history = useHistory();

    const handleChatClick = useCallback(
        (type: string, object: any) => {
            return function () {
                history.push(`/${type}/${object.id}`);
                handleClose();
            };
        },
        [history, handleClose]
    );

    const renderList = useMemo(() => {
        if (loading) {
            return <Loader />;
        }
        if (!data || !data.search) {
            return <div>No results.</div>;
        }
        return (
            <Dropdown.Menu style={{ background: "none" }}>
                <Dropdown.Item panel className={classes.panelStyles}>
                    Users
                </Dropdown.Item>
                {data.search.users.length > 0 ? (
                    data.search.users.map((user: IUser, index: number) => (
                        <Dropdown.Item
                            key={user.id}
                            eventKey={index}
                            onSelect={handleChatClick("user", user)}
                        >
                            {user.displayName}
                        </Dropdown.Item>
                    ))
                ) : (
                    <div className={classes.noResults}>No results...</div>
                )}
                <Dropdown.Item divider />
                <Dropdown.Item panel className={classes.panelStyles}>
                    Conversations
                </Dropdown.Item>
                {data.search.conversations.length > 0 ? (
                    data.search.conversations.map(
                        (conversation: any, index: number) => (
                            <Dropdown.Item
                                key={conversation.id}
                                eventKey={index}
                                onSelect={handleChatClick(
                                    "conversation",
                                    conversation
                                )}
                            >
                                {constructGroupName(conversation.members, true)}
                            </Dropdown.Item>
                        )
                    )
                ) : (
                    <div className={classes.noResults}>No results...</div>
                )}
                <Dropdown.Item divider />
                <Dropdown.Item panel className={classes.panelStyles}>
                    Channels
                </Dropdown.Item>
                {data.search.channels.length > 0 ? (
                    data.search.channels.map((channel: any, index: number) => (
                        <Dropdown.Item
                            key={channel.id}
                            eventKey={index}
                            onSelect={handleChatClick("conversation", channel)}
                        >
                            #{channel.name}
                        </Dropdown.Item>
                    ))
                ) : (
                    <div className={classes.noResults}>No results...</div>
                )}
            </Dropdown.Menu>
        );
    }, [handleChatClick, classes, data, loading]);

    return (
        <Modal show={open} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input
                    onChange={setSearchValue}
                    placeholder="Enter text you want to search by.."
                    className={classes.input}
                />
                {renderList}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} appearance="subtle">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SearchModal;
