import { gql } from "@apollo/client";

export const GET_PRIVATE_MESSAGES = gql`
    query getUsers($userId: String!) {
        messages: getPrivateMessages(userId: $userId) {
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
            recipient {
                id
                email
                displayName
                phoneNumber
                description
                imageUrl
            }
        }
    }
`;
