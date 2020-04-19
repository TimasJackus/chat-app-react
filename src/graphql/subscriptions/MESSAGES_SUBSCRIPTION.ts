import { gql } from "@apollo/client";

export const MESSAGES_SUBSCRIPTION = gql`
    subscription subscribe {
        subscribe {
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
