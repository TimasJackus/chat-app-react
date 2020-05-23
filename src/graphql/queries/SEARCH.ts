import { gql } from "@apollo/client";

export const SEARCH = gql`
    query search($by: String!) {
        search(by: $by) {
            users {
                id
                email
                displayName
                phoneNumber
                description
                imageUrl
            }
            channels {
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
            conversations {
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
    }
`;
