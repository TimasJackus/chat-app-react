import { gql } from "@apollo/client";

export const SEND_REPLY = gql`
    mutation sendMessage($data: ReplyInput!, $image: Upload) {
        sendReply(data: $data, image: $image) {
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
