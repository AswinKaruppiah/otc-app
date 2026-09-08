import { useState, useEffect, useCallback } from "react";

const TRON_FULL_HOST = process.env.EXPO_PUBLIC_TRON_FULL_HOST;
const USDT_TRC20_ADDRESS = process.env.EXPO_PUBLIC_USDT_TRC20_ADDRESS;
const DECIMALS = 6;

/**
 * Hook to fetch USDT TRC20 balance for a Tron wallet address via TronGrid REST API.
 * @param {string|null} address - Tron Base58 wallet address
 */
export function useUsdtBalance(address) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(Boolean(address));
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(0);
      setLoading(false);
      return;
    }
    if (!TRON_FULL_HOST || !USDT_TRC20_ADDRESS) {
      setError(new Error("Tron env vars missing"));
      setBalance(0);
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
      const trc20List = account?.trc20 || [];

      // Look up USDT contract address in trc20 list
      let rawBalance = "0";
      for (const item of trc20List) {
        if (item[USDT_TRC20_ADDRESS]) {
          rawBalance = item[USDT_TRC20_ADDRESS];
          break;
        }
      }

      setBalance(Number(rawBalance) / Math.pow(10, DECIMALS));
    } catch (err) {
      console.warn("Error fetching USDT balance:", err);
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
