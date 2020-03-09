import React from "react";
import {
    Container,
    Sidebar,
    Sidenav,
    Header,
    Content,
    Dropdown,
    Nav,
    Icon,
    Loader
} from "rsuite";
import { useQuery, gql } from "@apollo/client";
import { User } from "../../interfaces";

const panelStyles = {
    padding: "15px 20px",
    color: "#aaa"
};

const headerStyles = {
    padding: 20,
    fontSize: 16,
    background: "#25B3F5",
    color: "#FFF"
};

const GET_USERS = gql`
    query {
        users: getUsers {
            id
            email
            displayName
            phoneNumber
            description
            imageUrl
        }
    }
`;

export default function Home() {
    const { loading, error, data } = useQuery(GET_USERS);
    if (loading) return <Loader center vertical content="Loading..." />;
    console.log(data);

    return (
        <div style={{ width: 250 }}>
            <Sidenav appearance="subtle">
                <Sidenav.Header>
                    <div style={headerStyles}>Timas Jackus</div>
                </Sidenav.Header>
                <Sidenav.Body>
                    <Dropdown.Menu style={{ background: "none" }}>
                        <Dropdown.Item panel style={panelStyles}>
                            Direct Messages
                        </Dropdown.Item>
                        {data.users.map((user: User, index: number) => (
                            <Dropdown.Item key={user.id} eventKey={index}>
                                {user.email}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Item divider />
                    </Dropdown.Menu>
                    <Dropdown.Menu style={{ background: "none" }}>
                        <Dropdown.Item panel style={panelStyles}>
                            Channels
                        </Dropdown.Item>
                        {data.users.map((user: User, index: number) => (
                            <Dropdown.Item key={user.id} eventKey={index}>
                                {user.email}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Item divider />
                    </Dropdown.Menu>
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
}
