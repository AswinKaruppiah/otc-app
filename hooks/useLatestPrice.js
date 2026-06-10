import { useQuery } from "@apollo/client/react";
import { LATEST_PRICE } from "../apollo/query";
import { useEffect } from "react";

/**
 * Custom hook to fetch and manage the latest exchange rate/price.
 * Exposes the latest price object, query loading state, any errors, and a refetch function.
 *
 * @param {Object} options - Optional Apollo useQuery configuration options.
 */
export function useLatestPrice(options = {}) {
  const { data, loading, error, refetch, networkStatus } = useQuery(LATEST_PRICE, {
    pollInterval: 10000, // Poll every 10 seconds by default to keep the price up to date
    ...options,
  });

  const isStoreReset =
    error?.message?.includes("Store reset while query was in flight") ||
    error?.message?.includes("%22message%22%3A91") ||
    error?.message?.includes('"message":91');

  useEffect(() => {
    if (isStoreReset) {
      refetch().catch((e) => {
        console.log("Failed to auto-refetch latest price after store reset:", e);
      });
    }
  }, [isStoreReset, refetch]);

  return {
    latestPrice: data?.latestPrice || null,
    loading: loading || isStoreReset,
    error: isStoreReset ? null : error,
    refetch,
    networkStatus: isStoreReset ? 1 : networkStatus,
  };
}
