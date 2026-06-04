import { useQuery } from "@apollo/client/react";
import { LATEST_PRICE } from "../apollo/query";

/**
 * Custom hook to fetch and manage the latest exchange rate/price.
 * Exposes the latest price object, query loading state, any errors, and a refetch function.
 *
 * @param {Object} options - Optional Apollo useQuery configuration options.
 */
export function useLatestPrice(options = {}) {
  const { data, loading, error, refetch } = useQuery(LATEST_PRICE, {
    pollInterval: 10000, // Poll every 10 seconds by default to keep the price up to date
    ...options,
  });

  return {
    latestPrice: data?.latestPrice || null,
    loading,
    error,
    refetch,
  };
}
