import React from "react";
import { Text, View } from "react-native";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * Bank Screen — Linked bank accounts, details, and transfer limits.
 * Rebuilt using the premium Noir theme:
 *   - Base font: font-noir / font-noir-medium
 *   - Colors: bg-noirCard, bg-noirMint, bg-noirCyan
 */
export default function Bank() {
  const router = useRouter();

  const linkedBanks = [
    {
      id: "1",
      bankName: "Chase Bank",
      type: "Checking Account",
      accountNum: "•••• 8821",
      routingNum: "021000021",
      status: "Primary",
      icon: "home",
      iconColor: "#baffd8",
    },
    {
      id: "2",
      bankName: "Wells Fargo",
      type: "Savings Account",
      accountNum: "•••• 4302",
      routingNum: "121000248",
      status: "Secondary",
      icon: "briefcase",
      iconColor: "#96dded",
    },
  ];

  return (
    <View className="w-full pb-8">
      {/* Header Badge */}
      <View className="items-center mb-6">
        <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
          <Feather name="shield" size={13} color="#baffd8" />
          <Text className="text-noirMint text-[12px] font-noir-medium tracking-[0.5px]">
            Linked Funding Sources
          </Text>
        </View>
        <Text className="text-[32px] font-noir-medium text-noirText mb-2 text-center tracking-[-0.5px]">
          Bank Accounts
        </Text>
        <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
          Manage your external bank connections and transfer limits.
        </Text>
      </View>

      {/* Linked Banks List */}
      <Text className="text-[17px] font-noir-medium text-noirText mb-3 tracking-[0.2px]">Linked Accounts</Text>
      <View className="w-full gap-4 mb-6">
        {linkedBanks.map((bank) => (
          <View
            key={bank.id}
            className="w-full bg-noirCard rounded-2xl p-5 border border-white/[0.04] relative overflow-hidden"
          >
            {/* Header: Bank Name & Status */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${bank.iconColor}15` }}
                >
                  <Feather name={bank.icon} size={18} color={bank.iconColor} />
                </View>
                <View>
                  <Text className="text-noirText text-[16px] font-noir-medium">{bank.bankName}</Text>
                  <Text className="text-gray-400 text-[12px] font-noir">{bank.type}</Text>
                </View>
              </View>
              <View
                className="px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5"
              >
                <Text className="text-noirText text-[11px] font-noir-medium">{bank.status}</Text>
              </View>
            </View>

            {/* Account Details */}
            <View className="border-t border-white/[0.04] pt-4 gap-2.5">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-[13px] font-noir">Account Number</Text>
                <Text className="text-noirText text-[14px] font-noir-medium">{bank.accountNum}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 text-[13px] font-noir">Routing Number</Text>
                <Text className="text-noirText text-[14px] font-noir-medium">{bank.routingNum}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Transfer Limits Section */}
      <Text className="text-[17px] font-noir-medium text-noirText mb-3 tracking-[0.2px]">Transfer Limits</Text>
      <View className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] gap-3.5 mb-8">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-noirText text-[14px] font-noir-medium">Daily Withdrawal Limit</Text>
            <Text className="text-gray-400 text-[12px] font-noir">$5,000.00 max</Text>
          </View>
          <Text className="text-noirCyan text-[15px] font-noir-medium">$1,200.00 left</Text>
        </View>
        <View className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
          <View className="h-full bg-noirMint w-[76%]" />
        </View>
      </View>

      {/* Actions */}
      <View className="w-full gap-3">
        <HapticTouchableOpacity className="w-full bg-noirMint py-4 rounded-xl flex-row items-center justify-center gap-2">
          <Feather name="plus" size={16} color="#111418" />
          <Text className="text-noirBg text-[15px] font-noir-medium">Link Another Bank</Text>
        </HapticTouchableOpacity>

        <HapticTouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-white/5 border border-white/[0.04] py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Text className="text-noirText text-[15px] font-noir-medium">Back</Text>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
