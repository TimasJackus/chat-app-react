import { gql } from "@apollo/client";

export const GET_CONVERSATION_MESSAGES = gql`
    query conversationMessages($id: String!) {
        messages: conversationMessages(conversationId: $id) {
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
        }
    }
`;
