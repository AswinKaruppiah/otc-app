import { useQuery } from "@apollo/client/react";
import { GET_USER } from "../apollo/query";

/**
 * Custom hook to fetch and manage the authenticated user's data.
 * Exposes the user profile, query loading state, any errors, and a refetch function.
 *
 * @param {Object} options - Optional Apollo useQuery configuration options.
 */
export function useUser(options = {}) {
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    // Avoid stale user details by fetching on mount, can be overridden by options.
    fetchPolicy: "cache-and-network",
    ...options,
  });

  return {
    user: data?.userMe || null,
    loading,
    error,
    refetch,
  };
}
