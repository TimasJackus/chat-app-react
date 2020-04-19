import { gql } from "@apollo/client";

export const GET_PRIVATE_MESSAGES = gql`
    query messages($userId: String!) {
        messages(userId: $userId) {
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
        }
    }
`;
