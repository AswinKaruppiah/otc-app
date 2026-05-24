import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * Bank Screen — Rendered inside the main layout wrapper.
 * Displays list of linked bank accounts, details, and transfer limits.
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
      iconColor: "#0a57ff",
    },
    {
      id: "2",
      bankName: "Wells Fargo",
      type: "Savings Account",
      accountNum: "•••• 4302",
      routingNum: "121000248",
      status: "Secondary",
      icon: "briefcase",
      iconColor: "#eab308",
    },
  ];

  return (
    <View className="w-full pb-8">
      {/* Header Badge */}
      <View className="items-center mb-6">
        <View className="bg-[#0a57ff]/20 border border-[#0a57ff]/40 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
          <Feather name="shield" size={14} color="#7eb8ff" />
          <Text className="text-[#7eb8ff] text-[13px] font-semibold tracking-[0.5px]">
            Linked Funding Sources
          </Text>
        </View>
        <Text className="text-[32px] font-extrabold text-white mb-2 text-center tracking-[-0.5px]">
          Bank Accounts
        </Text>
        <Text className="text-[14px] text-[#9ba3af] text-center max-w-[280px] leading-[20px]">
          Manage your external bank connections and transfer limits.
        </Text>
      </View>

      {/* Linked Banks List */}
      <Text className="text-[17px] font-bold text-white mb-3 tracking-[0.2px]">Linked Accounts</Text>
      <View className="w-full gap-4 mb-6">
        {linkedBanks.map((bank) => (
          <View
            key={bank.id}
            className="w-full bg-white/5 rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden"
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
                  <Text className="text-white text-[16px] font-bold">{bank.bankName}</Text>
                  <Text className="text-[#9ba3af] text-[12px]">{bank.type}</Text>
                </View>
              </View>
              <View
                className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5"
              >
                <Text className="text-white text-[11px] font-semibold">{bank.status}</Text>
              </View>
            </View>

            {/* Account Details */}
            <View className="border-t border-white/[0.05] pt-4 gap-2.5">
              <View className="flex-row justify-between items-center">
                <Text className="text-[#9ba3af] text-[13px]">Account Number</Text>
                <Text className="text-white text-[14px] font-medium">{bank.accountNum}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-[#9ba3af] text-[13px]">Routing Number</Text>
                <Text className="text-white text-[14px] font-medium">{bank.routingNum}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Transfer Limits Section */}
      <Text className="text-[17px] font-bold text-white mb-3 tracking-[0.2px]">Transfer Limits</Text>
      <View className="w-full bg-white/5 rounded-2xl p-4 border border-white/[0.08] gap-3.5 mb-8">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-[14px] font-bold">Daily Withdrawal Limit</Text>
            <Text className="text-[#9ba3af] text-[12px]">$5,000.00 max</Text>
          </View>
          <Text className="text-[#7eb8ff] text-[15px] font-semibold">$1,200.00 left</Text>
        </View>
        <View className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <View className="h-full bg-[#0a57ff] w-[76%]" />
        </View>
      </View>

      {/* Actions */}
      <View className="w-full gap-3">
        <TouchableOpacity className="w-full bg-[#0a57ff] py-4 rounded-xl flex-row items-center justify-center gap-2">
          <Feather name="plus" size={16} color="white" />
          <Text className="text-white text-[15px] font-bold">Link Another Bank</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full bg-white/10 border border-white/[0.08] py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Text className="text-white text-[15px] font-semibold">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
