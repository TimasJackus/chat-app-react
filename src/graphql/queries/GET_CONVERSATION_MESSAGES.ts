import { gql } from "@apollo/client";

export const GET_CONVERSATION_MESSAGES = gql`
    query conversationMessages($conversationId: String!) {
        messages: conversationMessages(conversationId: $conversationId) {
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
