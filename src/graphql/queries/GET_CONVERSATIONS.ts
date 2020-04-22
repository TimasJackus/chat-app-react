import { gql } from "@apollo/client";

export const GET_CONVERSATIONS = gql`
    query getConversations {
        conversations: getConversations {
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
