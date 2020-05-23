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
            type
            content
            imageUrl
            createdAt
            updatedAt
            pinned
            replyCount
            parent
        }
    }
`;
