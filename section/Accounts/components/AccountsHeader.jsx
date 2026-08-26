import React from "react";
import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * AccountsHeader — Dynamic header for Accounts page switching between Bank Accounts and Crypto Wallets.
 */
export default function AccountsHeader({ activeTab = "banks" }) {
  const isBanks = activeTab === "banks";

  return (
    <View className="items-center mb-6">
      <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
        <Feather name={isBanks ? "shield" : "cpu"} size={13} color="#baffd8" />
        <Text className="text-noirMint font-noir text-[12px] tracking-[0.5px]">
          {isBanks ? "Linked Funding Sources" : "Whitelisted Destinations"}
        </Text>
      </View>
      <Text className="text-[32px] text-noirText font-noir mb-2 text-center tracking-[-0.5px]">
        {isBanks ? "Bank Accounts" : "Crypto Wallets"}
      </Text>
      <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
        {isBanks
          ? "Manage your external bank connections and transfer limits."
          : "Manage your whitelisted wallet addresses for crypto payouts."}
      </Text>
    </View>
  );
}
