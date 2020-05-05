import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
    mutation sendMessage($data: MessageInput!) {
        sendMessage(data: $data) {
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
        }
    }
`;
