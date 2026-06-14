import React from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../utils/haptics";
import { useConfirmExit } from "../../hooks/useConfirmExit";
import ConfirmExitDialog from "../../components/dialog/ConfirmExitDialog";

/**
 * Order Screen — A premium, dummy order preview screen that displays the chosen bank account
 * and details of the order. Conforms to the parent UserLayout container.
 */
export default function OrderRoute() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isOpen, setIsOpen, confirmExit, cancelExit } = useConfirmExit();

  // Retrieve parameters passed via route navigation
  const {
    id,
    bankName = "Chase Bank",
    accountHolderName = "John Doe",
    accountNumber = "",
    ifscCode = "",
    branch = "",
    type = "Checking Account",
  } = params;

  // Mask account number inline if it exists
  const accountNumMasked = accountNumber
    ? `•••• ${accountNumber.slice(-4)}`
    : "•••• 8821";

  const handleBack = () => {
    haptic.light();
    router.back();
  };

  return (
    <View className="w-full pb-8">
      {/* Header Badge */}
      <View className="items-center mb-6">
        <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
          <Feather name="check-circle" size={13} color="#baffd8" />
          <Text className="text-noirMint font-noir text-[12px] tracking-[0.5px]">
            Order Initiated Successfully
          </Text>
        </View>
        <Text className="text-[32px] text-noirText font-noir mb-2 text-center tracking-[-0.5px]">
          Order Details
        </Text>
        <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
          Your transfer order is set up and processing.
        </Text>
      </View>

      {/* Order Status Card */}
      <View className="w-full bg-white/5 border border-white/[0.04] p-6 rounded-3xl items-center mb-6">
        <View className="w-14 h-14 rounded-full bg-noirMint/10 border border-noirMint/20 items-center justify-center mb-4">
          <Feather name="clock" size={24} color="#baffd8" />
        </View>
        <Text className="text-white font-noir text-xl tracking-tight">Processing</Text>
        <Text className="text-gray-400 font-noir text-xs mt-1.5 text-center px-4 leading-normal">
          We are routing your transfer. You will receive an update shortly.
        </Text>

        <View className="w-full h-px bg-white/5 my-5" />

        {/* Dummy Order ID & Amount */}
        <View className="w-full gap-3.5">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Order ID</Text>
            <Text className="text-white font-noir text-[13px] font-noir-medium">#CRN-839281</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Transfer Amount</Text>
            <Text className="text-noirMint font-noir-medium text-[16px]">10,000 INR</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Estimated Arrival</Text>
            <Text className="text-white font-noir text-[13px]">5 - 10 mins</Text>
          </View>
        </View>
      </View>

      {/* Selected Bank Details Card */}
      <Text className="text-gray-400 font-noir-medium text-sm mb-3 tracking-wider uppercase pl-1">
        Bank Account Details
      </Text>

      <View className="w-full bg-noirCard rounded-3xl p-5 border border-white/[0.04] gap-4 mb-8">
        <View className="flex-row items-center gap-3.5 pb-4 border-b border-white/5">
          <View className="w-12 h-12 rounded-2xl bg-noirCyan/10 items-center justify-center">
            <Feather
              name={type.toLowerCase().includes("saving") ? "briefcase" : "home"}
              size={20}
              color="#96dded"
            />
          </View>
          <View>
            <Text className="text-white font-noir-medium text-base leading-tight">
              {bankName}
            </Text>
            <Text className="text-gray-400 font-noir text-xs mt-0.5">
              {type || "Checking Account"} • {accountNumMasked}
            </Text>
          </View>
        </View>

        <View className="gap-3.5">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Account Holder</Text>
            <Text className="text-white font-noir text-[13px]">{accountHolderName || "N/A"}</Text>
          </View>

          {ifscCode ? (
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-400 font-noir text-[13px]">IFSC Code</Text>
              <Text className="text-white font-noir text-[13px] tracking-wide uppercase">
                {ifscCode}
              </Text>
            </View>
          ) : null}

          {branch ? (
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-400 font-noir text-[13px]">Branch</Text>
              <Text className="text-white font-noir text-[13px]">{branch}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Action Button */}
      <Pressable
        onPress={handleBack}
        className="w-full bg-noirMint py-4 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
      >
        <Text className="text-noirBg font-noir-medium text-[15px]">Go Back</Text>
      </Pressable>

      {/* Exit confirmation dialog */}
      <ConfirmExitDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={confirmExit}
      />
    </View>
  );
}
