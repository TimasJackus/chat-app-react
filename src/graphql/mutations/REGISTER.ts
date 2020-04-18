import { gql } from "@apollo/client";

export const REGISTER = gql`
    mutation register($data: RegisterInput!) {
        register(data: $data) {
            user {
                id
                email
                displayName
                phoneNumber
                description
                imageUrl
            }
            token
        }
    }
`;
