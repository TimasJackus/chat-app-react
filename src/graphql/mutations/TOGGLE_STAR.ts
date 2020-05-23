import { gql } from "@apollo/client";

export const TOGGLE_STAR = gql`
    mutation toggleStar($id: String!) {
        toggleStar(id: $id) {
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
