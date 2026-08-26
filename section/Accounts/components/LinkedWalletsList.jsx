import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * LinkedWalletsList — Renders whitelisted crypto wallet addresses with details.
 */
export default function LinkedWalletsList({ linkedWallets = [] }) {
  const maskAddress = (addr) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <View className="w-full mb-6">
      <Text className="text-[17px] text-noirText font-noir mb-3 tracking-[0.2px]">
        Whitelisted Wallets
      </Text>
      <View className="w-full gap-4">
        {linkedWallets.map((wallet) => (
          <View
            key={wallet.id}
            className="w-full bg-noirCard rounded-2xl p-5 border border-white/[0.04] relative overflow-hidden"
          >
            {/* Header: Wallet Label & Status */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: `${wallet.iconColor || "#baffd8"}15` }}
                >
                  <Feather
                    name={wallet.icon || "cpu"}
                    size={18}
                    color={wallet.iconColor || "#baffd8"}
                  />
                </View>
                <View>
                  <Text className="text-noirText font-noir text-[16px]">
                    {wallet.label}
                  </Text>
                  <Text className="text-gray-400 font-noir text-[12px]">
                    {wallet.network}
                  </Text>
                </View>
              </View>
              <View className="px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5">
                <Text className="text-noirMint font-noir text-[11px]">
                  {wallet.status}
                </Text>
              </View>
            </View>

            {/* Wallet Address Details */}
            <View className="border-t border-white/[0.04] pt-4 gap-2.5">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-noir text-[13px]">
                  Network
                </Text>
                <Text className="text-noirText font-noir text-[14px]">
                  {wallet.networkName || "Ethereum (ERC-20)"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400 font-noir text-[13px]">
                  Wallet Address
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-noirCyan font-noir text-[14px]">
                    {maskAddress(wallet.address)}
                  </Text>
                  <Feather name="copy" size={12} color="#96dded" />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
