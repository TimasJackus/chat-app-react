import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
    mutation sendMessage($data: MessageInput!, $image: Upload) {
        sendMessage(data: $data, image: $image) {
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
