import { useState, useEffect, useRef } from "react";
import { View, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import { GET_USER_WHITELISTED_ADDRESSES } from "../../apollo/query";
import { useUser } from "../../hooks/useUser";
import { useScreenPadding } from "../../context/ScrollContext";
import { haptic } from "../../utils/haptics";
import Show from "../../components/Show";
import WithdrawSendHeader from "./components/WithdrawSendHeader";
import WithdrawAmountHero from "./components/WithdrawAmountHero";
import WithdrawAddressCard from "./components/WithdrawAddressCard";
import WithdrawQuickPresets from "./components/WithdrawQuickPresets";
import WithdrawSendFooter from "./components/WithdrawSendFooter";
import SelectAddressSheet from "./components/SelectAddressSheet";
import WithdrawConfirmView from "./components/WithdrawConfirmView";

/**
 * WithdrawSendSection — Dedicated full-screen withdrawal section using native keypad.
 * Route: /withdraw/send
 */
export default function WithdrawSendSection() {
  const router = useRouter();
  const { paddingBottom, paddingTop } = useScreenPadding();
  const { user } = useUser();
  const inputRef = useRef(null);

  const [step, setStep] = useState("input"); // 'input' | 'confirm'
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);

  const walletBalance = user?.wallet?.walletBalance ?? 0;

  // Whitelisted addresses query
  const { data: walletData } = useQuery(GET_USER_WHITELISTED_ADDRESSES);
  const whitelistedAddresses =
    walletData?.getUserWhitelistedAddresses || [];

  // Auto-select default whitelisted address
  useEffect(() => {
    if (whitelistedAddresses.length > 0 && !selectedAddress) {
      const defaultAddr =
        whitelistedAddresses.find((a) => a.isDefault) || whitelistedAddresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [whitelistedAddresses, selectedAddress]);

  // Default select 25% on mount / balance load
  useEffect(() => {
    if (walletBalance > 0 && !amount) {
      const defaultVal = (walletBalance * 0.25).toFixed(2);
      if (parseFloat(defaultVal) > 0) {
        setAmount(defaultVal);
      }
    }
  }, [walletBalance]);

  const handleAmountChange = (val) => {
    const cleaned = val.replace(/[^0-9.]/g, "");
    if ((cleaned.match(/\./g) || []).length > 1) return;
    if (cleaned.includes(".")) {
      const [, dec] = cleaned.split(".");
      if (dec && dec.length > 2) return;
    }
    setAmount(cleaned);
  };

  const handleQuickPercent = (percent) => {
    haptic.light();
    const calc = (walletBalance * percent).toFixed(2);
    setAmount(parseFloat(calc) > 0 ? calc.toString() : "");
  };

  const handleAddressCardPress = () => {
    Keyboard.dismiss();
    haptic.light();
    if (whitelistedAddresses.length === 0) {
      router.push({
        pathname: "/accounts",
        params: { tab: "wallets" },
      });
    } else {
      setIsAddressPickerOpen(true);
    }
  };

  const handleContinue = () => {
    haptic.medium();
    setStep("confirm");
  };

  const numAmount = parseFloat(amount) || 0;
  const isExceeding = numAmount > walletBalance;
  const canContinue =
    numAmount > 0 &&
    !isExceeding &&
    Boolean(selectedAddress?.address);

  return (
    <Show>
      {/* STEP 2: Full-screen Confirmation Screen */}
      <Show.If isTrue={step === "confirm"}>
        <View
          className="flex-1 w-full px-5"
          style={{ paddingTop, paddingBottom }}
        >
          <WithdrawConfirmView
            amount={amount}
            selectedAddress={selectedAddress}
            onBack={() => setStep("input")}
            onSuccess={() => {
              router.replace("/withdraw");
            }}
          />
        </View>
      </Show.If>

      {/* STEP 1: Full-screen Native Input Screen */}
      <Show.Else>
        <View
          className="flex-1 w-full justify-between px-3"
          style={{ paddingTop, paddingBottom }}
        >
          {/* Top Header */}
          <WithdrawSendHeader
            title="Withdraw"
            onBack={() => router.back()}
          />

          {/* Hero Big Amount Input */}
          <WithdrawAmountHero
            ref={inputRef}
            amount={amount}
            onChangeAmount={handleAmountChange}
            walletBalance={walletBalance}
            isExceeding={isExceeding}
            onQuickPercent={handleQuickPercent}
          />

          {/* Destination Address, Quick Presets & Continue Footer */}
          <View className="w-full gap-3 pb-2">
            <WithdrawAddressCard
              selectedAddress={selectedAddress}
              whitelistedAddresses={whitelistedAddresses}
              onPress={handleAddressCardPress}
            />

            <WithdrawQuickPresets
              onSelectPercent={handleQuickPercent}
            />

            <WithdrawSendFooter
              disabled={!canContinue}
              onPress={handleContinue}
            />
          </View>

          {/* Select Address Bottom Sheet */}
          <SelectAddressSheet
            isOpen={isAddressPickerOpen}
            onOpenChange={(open) => {
              setIsAddressPickerOpen(open);
              if (!open) {
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 200);
              }
            }}
            addresses={whitelistedAddresses}
            selectedId={selectedAddress?.id}
            onSelect={(addr) => {
              setSelectedAddress(addr);
              setIsAddressPickerOpen(false);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 200);
            }}
          />
        </View>
      </Show.Else>
    </Show>
  );
}
