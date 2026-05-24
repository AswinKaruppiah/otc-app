import React, { useState } from "react";
import { Text, View, TextInput, Alert } from "react-native";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * Withdraw Screen — Rendered inside the main layout wrapper.
 * Allows users to input withdrawal amount, select destination bank, and choose transfer speed.
 */
export default function Withdraw() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("Chase Checking (•••• 8821)");
  const [isInstant, setIsInstant] = useState(false);
  const totalBalance = 12450.80;

  const handleQuickPercent = (percent) => {
    const calculated = (totalBalance * percent).toFixed(2);
    setAmount(calculated.toString());
  };

  const handleWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to withdraw.");
      return;
    }
    if (numAmount > totalBalance) {
      Alert.alert("Insufficient Funds", "You do not have enough funds in your account.");
      return;
    }

    Alert.alert(
      "Withdrawal Initiated",
      `Successfully requested a withdrawal of $${numAmount.toFixed(2)} to your ${selectedBank}.`,
      [{ text: "OK", onPress: () => router.replace("/") }]
    );
  };

  return (
    <View className="w-full pb-8">
      {/* Header Badge */}
      <View className="items-center mb-6">
        <View className="bg-[#0a57ff]/20 border border-[#0a57ff]/40 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
          <Feather name="shield" size={14} color="#7eb8ff" />
          <Text className="text-[#7eb8ff] text-[13px] font-semibold tracking-[0.5px]">
            FDIC Insured Transfers
          </Text>
        </View>
        <Text className="text-[32px] font-extrabold text-white mb-2 text-center tracking-[-0.5px]">
          Withdraw Funds
        </Text>
        <Text className="text-[14px] text-[#9ba3af] text-center max-w-[280px]">
          Transfer funds safely from your wallet back to your linked bank account.
        </Text>
      </View>

      {/* Available Balance Reference */}
      <View className="w-full bg-white/5 rounded-2xl p-4 border border-white/[0.08] flex-row justify-between items-center mb-6">
        <Text className="text-[#9ba3af] text-[14px]">Available Balance</Text>
        <Text className="text-white text-[16px] font-bold">${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</Text>
      </View>

      {/* Amount Input Section */}
      <View className="w-full bg-[#0a57ff]/5 rounded-3xl p-6 border border-[#0a57ff]/20 items-center mb-6">
        <Text className="text-[#7eb8ff] text-[13px] font-semibold uppercase tracking-[1px] mb-3">
          Enter Amount
        </Text>
        <View className="flex-row items-center justify-center mb-4">
          <Text className="text-white text-[32px] font-bold mr-1">$</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="text-white text-[40px] font-black text-center min-w-[120px] max-w-[220px]"
          />
        </View>

        {/* Quick Percent Selectors */}
        <View className="flex-row gap-2.5">
          {[0.25, 0.50, 1.0].map((val, idx) => (
            <HapticTouchableOpacity
              key={idx}
              onPress={() => handleQuickPercent(val)}
              className="px-4 py-2 bg-white/10 border border-white/[0.08] rounded-xl"
            >
              <Text className="text-white text-[12px] font-bold">
                {val === 1.0 ? "MAX" : `${val * 100}%`}
              </Text>
            </HapticTouchableOpacity>
          ))}
        </View>
      </View>

      {/* Destination Bank Selector */}
      <Text className="text-[17px] font-bold text-white mb-3 tracking-[0.2px]">Destination Account</Text>
      <View className="w-full bg-white/5 rounded-2xl p-4 border border-white/[0.08] flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-[#0a57ff]/10 items-center justify-center">
            <Feather name="home" size={18} color="#0a57ff" />
          </View>
          <View>
            <Text className="text-white text-[14px] font-bold">Chase Checking</Text>
            <Text className="text-[#9ba3af] text-[12px]">•••• 8821</Text>
          </View>
        </View>
        <Feather name="chevron-down" size={18} color="rgba(255, 255, 255, 0.4)" />
      </View>

      {/* Transfer Speed Selector */}
      <Text className="text-[17px] font-bold text-white mb-3 tracking-[0.2px]">Transfer Method</Text>
      <View className="flex-row gap-3 mb-8">
        {/* Standard Speed */}
        <HapticTouchableOpacity
          onPress={() => setIsInstant(false)}
          className={`flex-1 p-4 rounded-2xl border ${
            !isInstant
              ? "bg-[#0a57ff]/10 border-[#0a57ff]/40"
              : "bg-white/5 border-white/[0.08]"
          }`}
        >
          <Feather name="clock" size={20} color={!isInstant ? "#7eb8ff" : "#9ba3af"} className="mb-2" />
          <Text className="text-white text-[14px] font-bold mb-0.5">Standard</Text>
          <Text className="text-[#9ba3af] text-[11px]">Free • 1-3 Business Days</Text>
        </HapticTouchableOpacity>

        {/* Instant Speed */}
        <HapticTouchableOpacity
          onPress={() => setIsInstant(true)}
          className={`flex-1 p-4 rounded-2xl border ${
            isInstant
              ? "bg-[#0a57ff]/10 border-[#0a57ff]/40"
              : "bg-white/5 border-white/[0.08]"
          }`}
        >
          <Feather name="zap" size={20} color={isInstant ? "#7eb8ff" : "#9ba3af"} className="mb-2" />
          <Text className="text-white text-[14px] font-bold mb-0.5">Instant</Text>
          <Text className="text-[#9ba3af] text-[11px]">$1.50 Fee • In minutes</Text>
        </HapticTouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3">
        <HapticTouchableOpacity
          onPress={handleWithdraw}
          hapticType="medium"
          className="w-full bg-[#0a57ff] py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Feather name="arrow-down-right" size={16} color="white" />
          <Text className="text-white text-[15px] font-bold">Confirm Withdrawal</Text>
        </HapticTouchableOpacity>

        <HapticTouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-white/10 border border-white/[0.08] py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Text className="text-white text-[15px] font-semibold">Cancel</Text>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
