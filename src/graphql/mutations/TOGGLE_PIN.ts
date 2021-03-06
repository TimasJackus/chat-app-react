import { gql } from "@apollo/client";

export const TOGGLE_PIN = gql`
    mutation togglePinned($id: String!) {
        togglePinned(id: $id) {
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
