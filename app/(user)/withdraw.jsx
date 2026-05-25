import React, { useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * Withdraw Screen — Inputs withdrawal amount, selects destination bank, and chooses speed.
 * Rebuilt using the premium Noir theme:
 *   - Base font: font-noir / font-noir-medium
 *   - Colors: bg-noirCard, bg-noirMint, bg-noirCyan
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
        <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
          <Feather name="shield" size={13} color="#baffd8" />
          <Text className="text-noirMint text-[12px] font-noir-medium tracking-[0.5px]">
            FDIC Insured Transfers
          </Text>
        </View>
        <Text className="text-[32px] font-noir-medium text-noirText mb-2 text-center tracking-[-0.5px]">
          Withdraw Funds
        </Text>
        <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
          Transfer funds safely from your wallet back to your linked bank account.
        </Text>
      </View>

      {/* Available Balance Reference */}
      <View className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] flex-row justify-between items-center mb-6">
        <Text className="text-gray-400 text-[14px] font-noir">Available Balance</Text>
        <Text className="text-noirText text-[16px] font-noir-medium">${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</Text>
      </View>

      {/* Amount Input Section */}
      <View className="w-full bg-noirMint/5 rounded-3xl p-6 border border-noirMint/15 items-center mb-6">
        <Text className="text-noirCyan text-[13px] font-noir-medium uppercase tracking-[1px] mb-3">
          Enter Amount
        </Text>
        <View className="flex-row items-center justify-center mb-4">
          <Text className="text-noirText text-[32px] font-noir-medium mr-1">$</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="rgba(255, 255, 255, 0.2)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="text-noirText text-[40px] font-noir-medium text-center min-w-[120px] max-w-[220px]"
          />
        </View>

        {/* Quick Percent Selectors */}
        <View className="flex-row gap-2.5">
          {[0.25, 0.50, 1.0].map((val, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleQuickPercent(val)}
              className="px-4 py-2 bg-white/5 border border-white/[0.04] rounded-xl"
            >
              <Text className="text-noirText text-[12px] font-noir-medium">
                {val === 1.0 ? "MAX" : `${val * 100}%`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Destination Bank Selector */}
      <Text className="text-[17px] font-noir-medium text-noirText mb-3 tracking-[0.2px]">Destination Account</Text>
      <View className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-noirCyan/10 items-center justify-center">
            <Feather name="home" size={18} color="#96dded" />
          </View>
          <View>
            <Text className="text-noirText text-[14px] font-noir-medium">Chase Checking</Text>
            <Text className="text-gray-400 text-[12px] font-noir">•••• 8821</Text>
          </View>
        </View>
        <Feather name="chevron-down" size={18} color="rgba(255, 255, 255, 0.4)" />
      </View>

      {/* Transfer Speed Selector */}
      <Text className="text-[17px] font-noir-medium text-noirText mb-3 tracking-[0.2px]">Transfer Method</Text>
      <View className="flex-row gap-3 mb-8">
        {/* Standard Speed */}
        <TouchableOpacity
          onPress={() => setIsInstant(false)}
          className={`flex-1 p-4 rounded-2xl border ${
            !isInstant
              ? "bg-noirMint/10 border-noirMint/30"
              : "bg-noirCard border-white/[0.04]"
          }`}
        >
          <Feather name="clock" size={20} color={!isInstant ? "#baffd8" : "rgba(255, 255, 255, 0.45)"} className="mb-2" />
          <Text className="text-noirText text-[14px] font-noir-medium mb-0.5">Standard</Text>
          <Text className="text-gray-400 text-[11px] font-noir">Free • 1-3 Business Days</Text>
        </TouchableOpacity>

        {/* Instant Speed */}
        <TouchableOpacity
          onPress={() => setIsInstant(true)}
          className={`flex-1 p-4 rounded-2xl border ${
            isInstant
              ? "bg-noirCyan/10 border-noirCyan/30"
              : "bg-noirCard border-white/[0.04]"
          }`}
        >
          <Feather name="zap" size={20} color={isInstant ? "#96dded" : "rgba(255, 255, 255, 0.45)"} className="mb-2" />
          <Text className="text-noirText text-[14px] font-noir-medium mb-0.5">Instant</Text>
          <Text className="text-gray-400 text-[11px] font-noir">$1.50 Fee • In minutes</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3">
        <TouchableOpacity
          onPress={handleWithdraw}
          className="w-full bg-noirMint py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Feather name="arrow-down-right" size={16} color="#111418" />
          <Text className="text-noirBg text-[15px] font-noir-medium">Confirm Withdrawal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-white/5 border border-white/[0.04] py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Text className="text-noirText text-[15px] font-noir-medium">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
