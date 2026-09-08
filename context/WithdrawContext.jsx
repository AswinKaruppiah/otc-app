import { createContext, useContext, useState, useCallback } from "react";
import { useUser } from "../hooks/useUser";
import { useUsdtBalance } from "../hooks/useUsdtBalance";
import { useTrxBalance } from "../hooks/useTrxBalance";

const IS_PROD = process.env.EXPO_PUBLIC_APP_ENV === "prod";

const WithdrawContext = createContext(null);

/**
 * WithdrawProvider — Manages shared global state for the withdrawal flow (amount, address, and live on-chain balance).
 */
export function WithdrawProvider({ children }) {
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { user, loading: userLoading, refetch: refetchUser } = useUser();

  const {
    balance: usdtBalance,
    loading: usdtLoading,
    refetch: refetchUsdtBalance,
  } = useUsdtBalance(IS_PROD ? user?.walletAddress : null);

  const {
    balance: trxBalance,
    loading: trxLoading,
    refetch: refetchTrxBalance,
  } = useTrxBalance(IS_PROD ? null : user?.walletAddress);

  const walletBalance = (IS_PROD ? usdtBalance : trxBalance) ?? 0;
  const rawLoading = IS_PROD ? usdtLoading : trxLoading;
  const balanceSymbol = IS_PROD ? "USDT" : "TRX";
  const walletHold = user?.walletHold ?? 0;

  const isBalanceLoading =
    userLoading ||
    rawLoading ||
    (Boolean(user?.walletAddress) && (IS_PROD ? usdtBalance === null : trxBalance === null));

  const refetchBalance = useCallback(async () => {
    await Promise.allSettled([
      refetchUser?.(),
      IS_PROD ? refetchUsdtBalance?.() : refetchTrxBalance?.(),
    ]);
  }, [refetchUser, refetchUsdtBalance, refetchTrxBalance]);

  const resetWithdraw = () => {
    setAmount("");
    setSelectedAddress(null);
  };

  return (
    <WithdrawContext.Provider
      value={{
        amount,
        setAmount,
        selectedAddress,
        setSelectedAddress,
        resetWithdraw,
        walletBalance,
        walletHold,
        balanceSymbol,
        balanceLoading: isBalanceLoading,
        userLoading,
        refetchBalance,
        user,
      }}
    >
      {children}
    </WithdrawContext.Provider>
  );
}

export function useWithdraw() {
  const context = useContext(WithdrawContext);
  if (!context) {
    throw new Error("useWithdraw must be used within a WithdrawProvider");
  }
  return context;
}
