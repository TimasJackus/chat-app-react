import { gql } from "@apollo/client";

export const INIT_CONVERSATION = gql`
    mutation initConversation($members: [String!]!) {
        initConversation(members: $members) {
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
        }
    }
`;
