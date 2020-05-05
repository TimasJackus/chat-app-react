import { gql } from "@apollo/client";

export const GET_REPLIES = gql`
    query replies($id: String!) {
        messages: replies(parentId: $id) {
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
        }
    }
`;
