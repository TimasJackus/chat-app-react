import { gql } from "@apollo/client";

export const SEND_REPLY = gql`
    mutation sendMessage($data: ReplyInput!) {
        sendReply(data: $data) {
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
