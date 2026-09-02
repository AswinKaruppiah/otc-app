import { createContext, useContext, useState } from "react";

const WithdrawContext = createContext(null);

/**
 * WithdrawProvider — Manages shared state for the withdrawal flow (amount & selectedAddress).
 */
export function WithdrawProvider({ children }) {
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);

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
