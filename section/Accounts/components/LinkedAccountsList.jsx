import React from "react";
import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * LinkedAccountsList — Renders list of linked bank accounts with details.
 */
export default function LinkedAccountsList({ linkedBanks = [] }) {
  return (
    <View className="w-full mb-6">
      <Text className="text-[17px] text-noirText font-noir mb-3 tracking-[0.2px]">
        Linked Accounts
      </Text>
      <View className="w-full gap-4">
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
                  <Text className="text-noirText font-noir text-[16px]">
                    {bank.bankName}
                  </Text>
                  <Text className="text-gray-400 font-noir text-[12px]">
                    {bank.type}
                  </Text>
                </View>
              </View>
              <View className="px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5">
                <Text className="text-noirText font-noir text-[11px]">
                  {bank.status}
                </Text>
              </View>
            </View>

            {/* Account Details */}
            <View className="border-t border-white/[0.04] pt-4 gap-2.5">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-noir text-[13px]">
                  Account Number
                </Text>
                <Text className="text-noirText font-noir text-[14px]">
                  {bank.accountNum}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-noir text-[13px]">
                  Routing Number
                </Text>
                <Text className="text-noirText font-noir text-[14px]">
                  {bank.routingNum}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
