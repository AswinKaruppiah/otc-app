import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_USER } from "../apollo/query";
import * as SecureStore from "../utils/secureStore";

/**
 * Custom hook to fetch and manage the authenticated user's data.
 * Exposes the user profile, query loading state, any errors, and a refetch function.
 *
 * @param {Object} options - Optional Apollo useQuery configuration options.
 */
export function useUser(options = {}) {
  const [isAuth, setIsAuth] = useState(!!SecureStore.getTokenSync());
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    // Avoid stale user details by fetching on mount, can be overridden by options.
    ...options,
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        setIsAuth(!!token);
      } catch (e) {
        setIsAuth(false);
      }
    };

    checkToken();

    // Subscribe to real-time token changes (login/logout/expiration)
    const unsubscribe = SecureStore.subscribeToToken(checkToken);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user: data?.userMe || null,
    isAuth,
    loading,
    error,
    refetch,
  };
}
