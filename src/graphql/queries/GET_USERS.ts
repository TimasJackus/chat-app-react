import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query getUsers {
        users: getUsers {
            id
            email
            displayName
            phoneNumber
            description
            imageUrl
            unreadCount
        }
        conversations: getConversations {
            id
            type
            starred
            createdAt
            members {
                id
                email
                displayName
                phoneNumber
                description
                imageUrl
            }
            unreadCount
        }
        channels: getChannels {
            id
            type
            starred
            createdAt
            members {
                id
                email
                displayName
                phoneNumber
                description
                imageUrl
            }
            name
            isPrivate
            unreadCount
        }
    }
`;
