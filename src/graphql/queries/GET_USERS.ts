import { gql } from "@apollo/client";

export const GET_USERS = gql`
    query getUsers {
        users: getUsers {
            id
            email
            displayName
            phoneNumber
            description
            imageUrl
        }
    }
`;
