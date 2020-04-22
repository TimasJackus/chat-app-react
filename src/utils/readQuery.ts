import { ApolloClient } from "@apollo/client";
import { DataProxy } from "@apollo/client/cache/core/types/DataProxy";

export const readQuery = (
    client: ApolloClient<object>,
    options: DataProxy.Query<object>
) => {
    try {
        return client.readQuery(options);
    } catch {
        return null;
    }
};
