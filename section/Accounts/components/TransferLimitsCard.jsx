import React from "react";
import { View, Text } from "react-native";

/**
 * TransferLimitsCard — Displays transfer limit progress and usage details.
 */
export default function TransferLimitsCard({
  dailyLimit = "$5,000.00 max",
  remainingLimit = "$1,200.00 left",
  progressPercent = "76%",
}) {
  return (
    <View className="w-full mb-8">
      <Text className="text-[17px] text-noirText font-noir mb-3 tracking-[0.2px]">
        Transfer Limits
      </Text>
      <View className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] gap-3.5">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-noirText font-noir text-[14px]">
              Daily Withdrawal Limit
            </Text>
            <Text className="text-gray-400 font-noir text-[12px]">
              {dailyLimit}
            </Text>
          </View>
          <Text className="text-noirCyan font-noir text-[15px]">
            {remainingLimit}
          </Text>
        </View>
        <View className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
          <View
            className="h-full bg-noirMint"
            style={{ width: progressPercent }}
          />
        </View>
      </View>
    </View>
  );
}
