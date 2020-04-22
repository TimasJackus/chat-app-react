import { gql } from "@apollo/client";

export const LEAVE_CONVERSATION = gql`
    mutation leaveConversation($id: String!) {
        leaveConversation(id: $id) {
            id
            type
            starred
            createdAt
        }
    }
`;
