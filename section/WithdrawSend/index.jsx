import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useQuery } from "@apollo/client/react";
import { GET_USER_WHITELISTED_ADDRESSES } from "../../apollo/query";
import { useUser } from "../../hooks/useUser";
import { useScreenPadding } from "../../context/ScrollContext";
import { maskText, truncateDecimal } from "../../utils/helper";
import { haptic } from "../../utils/haptics";
import Show from "../../components/Show";
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
          {/* 1. Header (Centered title with Back button on left) */}
          <View className="flex-row items-center justify-between mb-3 px-1">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="w-11 h-11 rounded-full bg-[#13171a] border border-white/10 items-center justify-center active:bg-[#1e252a]"
            >
              <Feather name="chevron-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <Text className="text-lg font-noir font-bold text-white tracking-wide">
              Withdraw
            </Text>

            <View className="w-11 h-11" />
          </View>

          {/* 2. Hero Big Amount Display (Native Transparent Input) */}
          <View className="items-center justify-center my-auto py-4">
            <View className="flex-row items-center justify-center">
              <TextInput
                ref={inputRef}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                keyboardType="decimal-pad"
                autoFocus
                cursorColor="#baffd8"
                selectionColor="rgba(186, 255, 216, 0.35)"
                className="text-[52px] leading-tight font-noir font-light text-white tracking-tight text-center bg-transparent min-w-[80px] max-w-[320px] p-0"
              />
            </View>

            {/* Available Balance Subtext */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleQuickPercent(1.0)}
              className="flex-row items-center gap-1.5 mt-2.5"
            >
              <Text className="text-[13px] font-noir text-gray-400">
                Available for withdraw: {truncateDecimal(walletBalance, 2)} USDT
              </Text>
            </TouchableOpacity>

            {/* Validation Alert */}
            <Show>
              <Show.If isTrue={isExceeding}>
                <Text className="text-xs font-noir text-red-400 mt-2">
                  Exceeds available balance ({truncateDecimal(walletBalance, 2)} USDT)
                </Text>
              </Show.If>
            </Show>
          </View>

          {/* 3. Destination Card, Presets & Continue CTA */}
          <View className="w-full gap-3 pb-2">
            {/* Destination Whitelisted Address Selector Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
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
              }}
              className="w-full bg-[#111417] border border-white/10 rounded-2xl p-4 flex-row items-center justify-between active:bg-white/10"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                  <Feather name="shield" size={18} color="#baffd8" />
                </View>
                <View className="flex-1">
                  <Show>
                    <Show.If isTrue={Boolean(selectedAddress)}>
                      <View className="flex-row items-center gap-2">
                        <Text className="font-noir font-semibold text-sm text-white">
                          {selectedAddress?.label || "Whitelisted Wallet"}
                        </Text>
                        <View className="px-1.5 py-0.2 rounded bg-red-500/15 border border-red-500/30">
                          <Text className="text-[9px] font-noir-medium text-red-400">
                            TRC-20
                          </Text>
                        </View>
                      </View>
                      <Text className="font-mono text-xs text-gray-400 mt-0.5">
                        {maskText(selectedAddress?.address, 6)}
                      </Text>
                    </Show.If>
                    <Show.ElseIf isTrue={whitelistedAddresses.length === 0}>
                      <Text className="font-noir text-xs text-gray-400">
                        + Add Whitelisted TRON Address
                      </Text>
                    </Show.ElseIf>
                    <Show.Else>
                      <Text className="font-noir text-xs text-gray-400">
                        Select recipient address...
                      </Text>
                    </Show.Else>
                  </Show>
                </View>
              </View>
              <Feather name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Quick Presets Row */}
            <View className="flex-row items-center justify-between gap-2.5">
              {[
                { label: "25%", value: 0.25 },
                { label: "50%", value: 0.5 },
                { label: "75%", value: 0.75 },
                { label: "Max", value: 1.0 },
              ].map((preset) => (
                <TouchableOpacity
                  key={preset.label}
                  activeOpacity={0.7}
                  onPress={() => handleQuickPercent(preset.value)}
                  className="flex-1 py-2.5 rounded-full bg-[#13171a] border border-white/[0.06] items-center justify-center active:bg-[#1e252a]"
                >
                  <Text className="font-noir text-xs font-medium text-gray-200">
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!canContinue}
              onPress={() => {
                haptic.medium();
                setStep("confirm");
              }}
              className={`w-full py-4 rounded-full bg-noirMint items-center justify-center ${
                canContinue ? "opacity-100" : "opacity-35"
              }`}
            >
              <Text className="font-noir font-bold text-base text-[#060E0B]">
                Continue
              </Text>
            </TouchableOpacity>
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
