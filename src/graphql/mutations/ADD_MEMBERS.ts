import { gql } from "@apollo/client";

export const ADD_MEMBERS = gql`
    mutation addMembers($members: [String!]!, $id: String!) {
        addMembers(members: $members, id: $id) {
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
