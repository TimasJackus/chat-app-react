import { GET_PRIVATE_MESSAGES } from "../graphql/queries";
import { GET_CONVERSATION_MESSAGES } from "../graphql/queries/GET_CONVERSATION_MESSAGES";
import { GET_REPLIES } from "../graphql/queries/GET_REPLIES";

export const getQueryByType = (type: string | null) => {
    if (type === "user" || type === "Private") {
        return {
            query: GET_PRIVATE_MESSAGES,
        };
    }
    if (type === "Reply") {
        return {
            query: GET_REPLIES,
        };
    }
    return {
        query: GET_CONVERSATION_MESSAGES,
    };
};
