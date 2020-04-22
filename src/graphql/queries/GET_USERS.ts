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
        }
    }
`;
