import { gql } from "@apollo/client";

export const GET_PRIVATE_MESSAGES = gql`
    query messages($id: String!) {
        messages(userId: $id) {
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
