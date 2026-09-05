import { useState, useEffect, useRef } from "react";
import { View, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import { GET_USER_WHITELISTED_ADDRESSES } from "../../apollo/query";
import { useUser } from "../../hooks/useUser";
import { useScreenPadding } from "../../context/ScrollContext";
import { useWithdraw } from "../../context/WithdrawContext";
import { haptic } from "../../utils/haptics";
import { truncateDecimal } from "../../utils/helper";
import WithdrawSendHeader from "./components/WithdrawSendHeader";
import WithdrawAmountHero from "./components/WithdrawAmountHero";
import WithdrawAddressCard from "./components/WithdrawAddressCard";
import WithdrawQuickPresets, { PRESET_OPTIONS } from "./components/WithdrawQuickPresets";
import WithdrawSendFooter from "./components/WithdrawSendFooter";
import SelectAddressSheet from "./components/SelectAddressSheet";

/**
 * WithdrawSendSection — Dedicated full-screen withdrawal section using native keypad.
 * Route: /withdraw/send
 */
export default function WithdrawSendSection() {
  const router = useRouter();
  const { paddingBottom, paddingTop } = useScreenPadding();
  const { user } = useUser();
  const {
    amount,
    setAmount,
    selectedAddress,
    setSelectedAddress,
  } = useWithdraw();
  const inputRef = useRef(null);
  const initialSetRef = useRef(false);

  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);

  const walletBalance = user?.wallet?.walletBalance ?? 0;

  // Whitelisted addresses query
  const { data: walletData } = useQuery(GET_USER_WHITELISTED_ADDRESSES);
  const whitelistedAddresses =
    walletData?.getUserWhitelistedAddresses || [];

  // Auto-select default whitelisted address on mount
  useEffect(() => {
    if (whitelistedAddresses.length > 0 && !selectedAddress) {
      const defaultAddr =
        whitelistedAddresses.find((a) => a.isDefault) || whitelistedAddresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [whitelistedAddresses, selectedAddress]);

  // Default select 25% ONCE on initial mount if amount is empty
  useEffect(() => {
    if (amount) {
      initialSetRef.current = true;
      return;
    }
    if (walletBalance > 0 && !initialSetRef.current) {
      initialSetRef.current = true;
      const defaultPercent = PRESET_OPTIONS[0]?.value ?? 0.25;
      const defaultVal = truncateDecimal(walletBalance * defaultPercent, 2).replace(/,/g, "");
      if (parseFloat(defaultVal) > 0) {
        setAmount(defaultVal);
      }
    }
  }, [walletBalance, amount]);

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
    const calc = truncateDecimal(walletBalance * percent, 2).replace(/,/g, "");
    setAmount(parseFloat(calc) > 0 ? calc : "");
  };

  const handleAddressCardPress = () => {
    Keyboard.dismiss();
    haptic.light();
    setIsAddressPickerOpen(true);
  };

  const handleContinue = () => {
    haptic.medium();
    router.push("/withdraw/confirm");
  };

  const numAmount = parseFloat(amount) || 0;
  const isExceeding = numAmount > walletBalance;
  const canContinue =
    numAmount > 0 &&
    !isExceeding &&
    Boolean(selectedAddress?.address);

  const handleBack = () => {
    haptic.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/withdraw");
    }
  };


  return (
    <View
      className="flex-1 w-full justify-between px-3"
      style={{ paddingTop, paddingBottom }}
    >
      {/* Top Header */}
      <WithdrawSendHeader
        title="Withdraw"
        onBack={handleBack}
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
  );
}
