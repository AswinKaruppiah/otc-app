import React from "react";
import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * AccountsHeader — Renders top badge, page title, and subtitle for Accounts section.
 */
export default function AccountsHeader() {
  return (
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
  );
}
