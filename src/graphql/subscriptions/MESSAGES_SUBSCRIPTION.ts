import { gql } from "@apollo/client";

export const MESSAGES_SUBSCRIPTION = gql`
    subscription subscribe {
        subscribe {
            event
            payload {
                chatId
                message {
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
        }
    }
`;
