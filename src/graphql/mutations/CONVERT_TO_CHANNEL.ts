import { gql } from "@apollo/client";

export const CONVERT_TO_CHANNEL = gql`
    mutation convertToChannel($conversationId: String!, $name: String!) {
        convertToChannel(conversationId: $conversationId, name: $name) {
            id
            type
            starred
            createdAt
            members {
                id
                email
                displayName
                phoneNumber
                description
                imageUrl
            }
            name
            isPrivate
        }
    }
`;
