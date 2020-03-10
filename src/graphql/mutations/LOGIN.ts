import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation login($data: LoginInput!) {
        login(data: $data) {
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
