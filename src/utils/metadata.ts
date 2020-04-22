import { GET_PRIVATE_MESSAGES } from "../graphql/queries";
import { GET_CONVERSATION_MESSAGES } from "../graphql/queries/GET_CONVERSATION_MESSAGES";

export const metadata = (type: string | null) => {
    if (type === "user") {
        return {
            query: GET_PRIVATE_MESSAGES,
        };
    }
    return {
        query: GET_CONVERSATION_MESSAGES,
    };
};
