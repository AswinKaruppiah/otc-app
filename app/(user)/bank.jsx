import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { maskAccountNumber } from "../../utils/helper";
import PageContainer from "../../components/PageContainer";

/**
 * Bank Screen — Linked bank accounts, details, and transfer limits.
 * Rebuilt using the premium Noir theme:
 *   - Base font:  /
 *   - Colors: bg-noirCard, bg-noirMint, bg-noirCyan
 */
export default function Bank() {
  const router = useRouter();

  const linkedBanks = [
    {
      id: "1",
      bankName: "Chase Bank",
      type: "Checking Account",
      accountNum: maskAccountNumber("8821"),
      routingNum: "021000021",
      status: "Primary",
      icon: "home",
      iconColor: "#baffd8",
    },
    {
      id: "2",
      bankName: "Wells Fargo",
      type: "Savings Account",
      accountNum: maskAccountNumber("4302"),
      routingNum: "121000248",
      status: "Secondary",
      icon: "briefcase",
      iconColor: "#96dded",
    },
  ];

  return (
    <PageContainer>
      <View className="w-full pb-8">
      {/* Header Badge */}
      <View className="items-center mb-6">
        <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
          <Feather name="shield" size={13} color="#baffd8" />
          <Text className="text-noirMint font-noir text-[12px] tracking-[0.5px]">
            Linked Funding Sources
          </Text>
        </View>
        <Text className="text-[32px] text-noirText font-noir mb-2 text-center tracking-[-0.5px]">
          Bank Accounts
        </Text>
        <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
          Manage your external bank connections and transfer limits.
        </Text>
      </View>

      {/* Linked Banks List */}
      <Text className="text-[17px] text-noirText font-noir mb-3 tracking-[0.2px]">
        Linked Accounts
      </Text>
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
                  <Text className="text-noirText font-noir text-[16px] ">
                    {bank.bankName}
                  </Text>
                  <Text className="text-gray-400 font-noir text-[12px] ">
                    {bank.type}
                  </Text>
                </View>
              </View>
              <View className="px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5">
                <Text className="text-noirText font-noir text-[11px] ">
                  {bank.status}
                </Text>
              </View>
            </View>

            {/* Account Details */}
            <View className="border-t border-white/[0.04] pt-4 gap-2.5">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-noir text-[13px] ">
                  Account Number
                </Text>
                <Text className="text-noirText font-noir text-[14px] ">
                  {bank.accountNum}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-noir text-[13px] ">
                  Routing Number
                </Text>
                <Text className="text-noirText font-noir text-[14px] ">
                  {bank.routingNum}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Transfer Limits Section */}
      <Text className="text-[17px] text-noirText font-noir mb-3 tracking-[0.2px]">
        Transfer Limits
      </Text>
      <View className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] gap-3.5 mb-8">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-noirText font-noir text-[14px] ">
              Daily Withdrawal Limit
            </Text>
            <Text className="text-gray-400 font-noir text-[12px] ">$5,000.00 max</Text>
          </View>
          <Text className="text-noirCyan font-noir text-[15px] ">$1,200.00 left</Text>
        </View>
        <View className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
          <View className="h-full bg-noirMint w-[76%]" />
        </View>
      </View>

      {/* Actions */}
      <View className="w-full gap-3">
        <TouchableOpacity className="w-full bg-noirMint py-4 rounded-xl flex-row items-center justify-center gap-2">
          <Feather name="plus" size={16} color="#111418" />
          <Text className="text-noirBg font-noir text-[15px] ">Link Another Bank</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-white/5 border border-white/[0.04] py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Text className="text-noirText font-noir text-[15px] ">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  </PageContainer>
);
}
