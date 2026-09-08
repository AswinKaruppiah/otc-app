import { useState, useEffect, useCallback } from "react";

const TRON_FULL_HOST = process.env.EXPO_PUBLIC_TRON_FULL_HOST;
const SUN_PER_TRX = 1_000_000;

/**
 * Hook to fetch native TRX balance for a Tron wallet address via TronGrid REST API.
 * @param {string|null} address - Tron Base58 wallet address
 */
export function useTrxBalance(address) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(Boolean(address));
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(0);
      setLoading(false);
      return;
    }
    if (!TRON_FULL_HOST) {
      setError(new Error("Tron host env var missing"));
      setBalance(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cleanHost = TRON_FULL_HOST.replace(/\/+$/, "");
      const res = await fetch(`${cleanHost}/v1/accounts/${address}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Tron API HTTP error: ${res.status}`);
      }

      const json = await res.json();
      const account = json?.data?.[0];
      const sun = account?.balance ?? 0;
      setBalance(Number(sun) / SUN_PER_TRX);
    } catch (err) {
      console.warn("Error fetching TRX balance:", err);
      setError(err);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      setLoading(true);
    }
    fetchBalance();
  }, [fetchBalance, address]);

  const isLoading = loading || (Boolean(address) && balance === null);

  return { balance, loading: isLoading, error, refetch: fetchBalance };
}
