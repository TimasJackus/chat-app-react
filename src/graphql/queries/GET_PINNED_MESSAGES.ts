import { gql } from "@apollo/client";

export const GET_PINNED_MESSAGES = gql`
    query pinnedMessages {
        messages: pinnedMessages {
            id
            sender {
                id
                email
                displayName
                phoneNumber
                description
                imageUrl
            }
            content
            createdAt
            updatedAt
            replyCount
            imageUrl
            type
            pinned
            viewed
            reactions {
                id
                react
                user {
                    id
                    email
                    displayName
                    phoneNumber
                    description
                    imageUrl
                    unreadCount
                }
            }
        }
    }
`;
