import { gql } from "@apollo/client";

export const DELETE_MSG = gql`
    mutation deleteMessage($id: String!) {
        deleteMessage(messageId: $id)
    }
`;
