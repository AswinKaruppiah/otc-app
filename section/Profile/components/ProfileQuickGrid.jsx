import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../../utils/haptics";

/**
 * ProfileQuickGrid — Clean 2-column card grid mirroring the "My Work" section in the reference design.
 */
export default function ProfileQuickGrid({
  onBanksPress,
  onWalletsPress,
  onWithdrawPress,
  onOrdersPress,
}) {
  const cards = [
    {
      id: "banks",
      title: "Bank Accounts",
      subtitle: "IMPS / RTGS Payouts",
      icon: "briefcase",
      color: "#baffd8",
      onPress: onBanksPress,
    },
    {
      id: "wallets",
      title: "Crypto Wallets",
      subtitle: "TRC-20 Whitelist",
      icon: "credit-card",
      color: "#96dded",
      onPress: onWalletsPress,
    },
    {
      id: "withdraw",
      title: "Withdraw Hub",
      subtitle: "USDT Settlement (1–2 Days)",
      icon: "upload",
      color: "#baffd8",
      onPress: onWithdrawPress,
    },
    {
      id: "orders",
      title: "Order History",
      subtitle: "Receipts & Timeline",
      icon: "activity",
      color: "#fbbf24",
      onPress: onOrdersPress,
    },
  ];

  return (
    <View className="w-full mb-6">
      {/* Section Header Title */}
      <Text className="text-sm font-noir-medium font-bold text-white mb-3">
        Quick Access & Vault
      </Text>

      {/* 2-Column Grid */}
      <View className="flex-row flex-wrap gap-3">
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            activeOpacity={0.75}
            onPress={() => {
              haptic.light();
              card.onPress?.();
            }}
            className="w-[48%] bg-noirCard border border-white/[0.08] rounded-3xl p-4 justify-between h-32 active:bg-white/[0.08] relative overflow-hidden"
          >
            {/* Top Icon Box */}
            <View className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.06] items-center justify-center">
              <Feather name={card.icon} size={18} color={card.color} />
            </View>

            {/* Bottom Titles */}
            <View>
              <Text className="text-white font-noir-medium text-sm font-semibold mb-0.5">
                {card.title}
              </Text>
              <Text className="text-gray-400 font-noir text-[11px]" numberOfLines={1}>
                {card.subtitle}
              </Text>
            </View>

            {/* Subtle corner arrow */}
            <View className="absolute top-3.5 right-3.5 opacity-30">
              <Feather name="arrow-up-right" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
