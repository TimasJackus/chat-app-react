import { gql } from "@apollo/client";

export const MESSAGES_SUBSCRIPTION = gql`
    subscription subscribe {
        subscribe {
            content
            sender
            recipient
        }
    }
`;
