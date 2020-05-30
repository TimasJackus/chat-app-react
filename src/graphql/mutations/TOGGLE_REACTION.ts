import { gql } from "@apollo/client";

export const TOGGLE_REACTION = gql`
    mutation toggleReaction($messageId: String!, $react: String!) {
        toggleReaction(messageId: $messageId, react: $react) {
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
