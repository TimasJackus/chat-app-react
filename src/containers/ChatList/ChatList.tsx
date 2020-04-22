import React, { useCallback, useState } from "react";
import { Sidenav, Sidebar, Dropdown, Button, Icon } from "rsuite";
import { User } from "../../interfaces";
import { useUserContext } from "../../contexts";
import { useHistory } from "react-router-dom";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";
import { constructGroupName } from "../../utils/constructGroupName";
import CreateChannelModal from "../CreateChannelModal/CreateChannelModal";

const panelStyles = {
    padding: "4px 20px",
    color: "#aaa",
};

const headerStyles = {
    padding: "20px 20px 10px",
    fontSize: 16,
    height: 60,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const iconStyle = {
    fontSize: 16,
    cursor: "pointer",
    color: "#2196f3",
    marginLeft: 15,
};

interface IChatList {
    users: User[];
    conversations: any[];
    channels: any[];
    refetch: () => void;
}

export default function ChatList({
    users,
    conversations,
    refetch,
    channels,
}: IChatList) {
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showChannelModal, setShowChannelModal] = useState(false);
    const { onLogout, user } = useUserContext();
    const history = useHistory();

    const toggleGroupModal = useCallback(() => {
        setShowGroupModal(!showGroupModal);
    }, [showGroupModal]);

    const toggleChannelModal = useCallback(() => {
        setShowChannelModal(!showChannelModal);
    }, [showChannelModal]);

    function handleChatClick(type: string, object: any) {
        return function () {
            history.push(`/${type}/${object.id}`);
        };
    }

    return (
        <>
            <Sidebar style={{ height: "100%" }}>
                <Sidenav appearance="subtle">
                    <Sidenav.Header>
                        <div style={headerStyles}>
                            {user?.displayName}
                            <Button color="blue" onClick={onLogout}>
                                Logout
                            </Button>
                        </div>
                    </Sidenav.Header>
                    <Sidenav.Body>
                        <Dropdown.Menu style={{ background: "none" }}>
                            <Dropdown.Item panel style={panelStyles}>
                                Direct Messages
                            </Dropdown.Item>
                            {users.map((user: User, index: number) => (
                                <Dropdown.Item
                                    key={user.id}
                                    eventKey={index}
                                    onSelect={handleChatClick("user", user)}
                                >
                                    {user.displayName}
                                </Dropdown.Item>
                            ))}
                            <Dropdown.Item divider />
                        </Dropdown.Menu>
                        <Dropdown.Menu style={{ background: "none" }}>
                            <Dropdown.Item panel style={panelStyles}>
                                Group conversations
                                <Icon
                                    icon="plus-circle"
                                    style={iconStyle}
                                    onClick={toggleGroupModal}
                                />
                            </Dropdown.Item>
                            {conversations.map(
                                (conversation: any, index: number) => (
                                    <Dropdown.Item
                                        key={conversation.id}
                                        eventKey={index}
                                        onSelect={handleChatClick(
                                            "conversation",
                                            conversation
                                        )}
                                    >
                                        {constructGroupName(
                                            conversation.members,
                                            true
                                        )}
                                    </Dropdown.Item>
                                )
                            )}
                            <Dropdown.Item divider />
                        </Dropdown.Menu>
                        <Dropdown.Menu style={{ background: "none" }}>
                            <Dropdown.Item panel style={panelStyles}>
                                Channels
                                <Icon
                                    icon="plus-circle"
                                    style={iconStyle}
                                    onClick={toggleChannelModal}
                                />
                            </Dropdown.Item>
                            {channels.map((channel: any, index: number) => (
                                <Dropdown.Item
                                    key={channel.id}
                                    eventKey={index}
                                    onSelect={handleChatClick(
                                        "conversation",
                                        channel
                                    )}
                                >
                                    #{channel.name}
                                </Dropdown.Item>
                            ))}
                            <Dropdown.Item divider />
                        </Dropdown.Menu>
                    </Sidenav.Body>
                </Sidenav>
            </Sidebar>
            <CreateGroupModal
                open={showGroupModal}
                handleClose={toggleGroupModal}
                refetch={refetch}
                users={users}
            />
            <CreateChannelModal
                open={showChannelModal}
                handleClose={toggleChannelModal}
                refetch={refetch}
                users={users}
            />
        </>
    );
}
