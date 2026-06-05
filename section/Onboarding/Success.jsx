import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";
import { LinearGradient } from "expo-linear-gradient";

import { TURNOVER_OPTIONS } from "./constants";

export default function SuccessScreen({ profileType, formData, onFinish }) {
  const isIndividual = profileType === "individual";

  const displayTurnoverLabel = () => {
    if (!formData.annualTurnover) return "N/A";
    const found = TURNOVER_OPTIONS.find(
      (opt) => opt.key === formData.annualTurnover || opt.label === formData.annualTurnover
    );
    return found ? found.label : formData.annualTurnover;
  };

  return (
    <View className="w-full flex-col items-center">
      {/* Header Info */}
      <View className="items-center mb-8">
        <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-4 flex-row items-center gap-1.5">
          <Feather name="shield" size={13} color="#baffd8" />
          <Text className="text-noirMint font-noir text-[12px] tracking-[0.5px]">
            Step 3 of 3
          </Text>
        </View>
        <Text className="text-[32px] text-noirText font-noir mb-2 text-center tracking-[-0.5px]">
          All Set!
        </Text>
        <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
          Your account has been configured successfully.
        </Text>
      </View>

      {/* Success Card Animation/Glow */}
      <View className="w-full relative items-center justify-center my-6">
        <View className="absolute w-48 h-48 rounded-full bg-noirMint/5 blur-xl" />
        <LinearGradient
          colors={["#baffd8", "#96dded"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
        >
          <View className="w-[88px] h-[88px] rounded-full bg-noirBg items-center justify-center">
            <Feather name="check" size={42} color="#baffd8" />
          </View>
        </LinearGradient>
      </View>

      {/* Summary Box */}
      <View className="w-full bg-noirCard border border-white/[0.04] p-6 rounded-3xl gap-4 mb-10 mt-4">
        <Text className="text-noirText font-noir-medium text-base mb-1 text-center">
          Account Created: {formData.fullName}
        </Text>

        <View className="h-[1px] bg-white/[0.06] w-full" />

        <View className="flex-row justify-between items-center py-0.5">
          <Text className="text-gray-400 font-noir text-sm">Account Type</Text>
          <Text className="text-noirMint font-noir text-sm font-semibold">
            {isIndividual ? "Individual" : "Business"}
          </Text>
        </View>



        {!isIndividual && (
          <View className="flex-row justify-between items-center py-0.5">
            <Text className="text-gray-400 font-noir text-sm">Company Name</Text>
            <Text className="text-noirText font-noir text-sm">{formData.companyName}</Text>
          </View>
        )}

        <View className="flex-row justify-between items-center py-0.5">
          <Text className="text-gray-400 font-noir text-sm">Annual Turnover</Text>
          <Text className="text-noirText font-noir text-sm">{displayTurnoverLabel()}</Text>
        </View>

        {formData.referralCode ? (
          <View className="flex-row justify-between items-center py-0.5">
            <Text className="text-gray-400 font-noir text-sm">Referral Applied</Text>
            <Text className="text-noirCyan font-noir text-sm">{formData.referralCode}</Text>
          </View>
        ) : null}
      </View>

      {/* Action Button */}
      <View className="w-full">
        <Button onPress={onFinish} primary={true}>
          Go to Dashboard
        </Button>
      </View>
    </View>
  );
}
