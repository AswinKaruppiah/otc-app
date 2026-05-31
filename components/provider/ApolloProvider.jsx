import { useMemo, useEffect } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { SetContextLink } from "@apollo/client/link/context";
import * as SecureStore from "../../utils/secureStore";

/**
 * Helper to clear local token and reset Apollo cache.
 */
const clearAuthToken = async (client) => {
  try {
    const existingToken = await SecureStore.getItemAsync("accessToken");
    if (existingToken) {
      console.log("Clearing token and resetting Apollo store.");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("accessTokenExpiration");
      if (client) {
        await client.resetStore();
      }
    }
  } catch (e) {
    console.error("Error clearing auth token:", e);
  }
};

/**
 * Encapsulates Apollo Client initialization inside a component scope.
 */
function ApolloProviderWrapper({ children }) {
  const client = useMemo(() => {
    let clientInstance = null;

    const httpLink = new HttpLink({
      uri: process.env.EXPO_PUBLIC_GRAPHQL_API_URL,
    });

    const authLink = new SetContextLink(async (prevContext) => {
      let token = null;
      try {
        token = await SecureStore.getItemAsync("accessToken");
      } catch (e) {
        console.error("Failed to read accessToken from SecureStore:", e);
      }

      return {
        ...prevContext,
        headers: {
          ...prevContext?.headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    clientInstance = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });

    return clientInstance;
  }, []);

  useEffect(() => {
    const checkExpiration = async () => {
      try {
        const expirationStr = await SecureStore.getItemAsync("accessTokenExpiration");
        if (expirationStr && Date.now() >= parseInt(expirationStr, 10)) {
          console.log("Token expiration reached in session checker.");
          await clearAuthToken(client);
        }
      } catch (e) {
        console.error("Error in expiration checker:", e);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 2000);
    return () => clearInterval(interval);
  }, [client]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default ApolloProviderWrapper;
