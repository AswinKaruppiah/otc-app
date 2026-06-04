import { useMemo, useEffect } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { SetContextLink } from "@apollo/client/link/context";
import { useToast } from "heroui-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "../../utils/secureStore";
import { router } from "expo-router";
import { loggerLink } from "../../apollo/logger";
import { isUnauthenticatedError } from "../../utils/helper";

/**
 * Helper to clear local token and reset Apollo cache.
 */
const clearAuthToken = async (client, toast) => {
  try {
    const existingToken = await SecureStore.getItemAsync("accessToken");
    if (existingToken) {
      await GoogleSignin.signOut();
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("accessTokenExpiration");
      await client.clearStore();
      await client.resetStore();
      toast?.show({
        label: "Signed Out",
        description: "Your session has expired.",
        variant: "success",
      });
      router.replace("/");
    }
  } catch (e) {
    console.error("Error clearing auth token:", e);

    if (isUnauthenticatedError(e)) {
      toast?.show({
        label: "Signed Out",
        description: "Your session has expired.",
        variant: "success",
      });
      router.replace("/");
    } else {
      toast?.show({
        label: "Error",
        description: `Sign out failed: ${e.message}`,
        variant: "danger",
      });
    }
  }
};

/**
 * Encapsulates Apollo Client initialization inside a component scope.
 */
function ApolloProviderWrapper({ children }) {
  const { toast } = useToast();
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
      link: authLink.concat(loggerLink).concat(httpLink),
      cache: new InMemoryCache(),
    });

    return clientInstance;
  }, []);

  useEffect(() => {
    const checkExpiration = async () => {
      try {
        const expirationStr = await SecureStore.getItemAsync(
          "accessTokenExpiration",
        );
        if (expirationStr && Date.now() >= parseInt(expirationStr, 10)) {
          console.log("Token expiration reached in session checker.");
          await clearAuthToken(client, toast);
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
