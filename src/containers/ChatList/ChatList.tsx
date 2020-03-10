import React from "react";
import { Sidenav, Sidebar, Dropdown, Button } from "rsuite";
import { User } from "../../interfaces";
import { useUserContext } from "../../contexts";
import { useHistory } from "react-router-dom";

const panelStyles = {
    padding: "15px 20px",
    color: "#aaa"
};

const headerStyles = {
    padding: 20,
    fontSize: 16,
    height: 80,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #3C3F43"
};

interface IChatList {
    users: User[];
}

export default function ChatList({ users }: IChatList) {
    const { onLogout } = useUserContext();
    const history = useHistory();

    function handleChatClick(object: any) {
        return function() {
            history.push(`/user/${object.id}`);
        };
    }

    return (
        <Sidebar style={{ borderRight: "1px solid #3C3F43", height: "100%" }}>
            <Sidenav appearance="subtle">
                <Sidenav.Header>
                    <div style={headerStyles}>
                        Timas Jackus
                        <Button onClick={onLogout}>Logout</Button>
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
                                onSelect={handleChatClick(user)}
                            >
                                {user.email}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Item divider />
                    </Dropdown.Menu>
                    <Dropdown.Menu style={{ background: "none" }}>
                        <Dropdown.Item panel style={panelStyles}>
                            Channels
                        </Dropdown.Item>
                        {users.map((user: User, index: number) => (
                            <Dropdown.Item key={user.id} eventKey={index}>
                                {user.email}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Item divider />
                    </Dropdown.Menu>
                </Sidenav.Body>
            </Sidenav>
        </Sidebar>
    );
}
