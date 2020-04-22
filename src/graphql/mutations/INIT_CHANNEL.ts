import { gql } from "@apollo/client";

export const INIT_CHANNEL = gql`
    mutation initChannel($members: [String!]!, $name: String!) {
        initChannel(members: $members, name: $name, isPrivate: false) {
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
