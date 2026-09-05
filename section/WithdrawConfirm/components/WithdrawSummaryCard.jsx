import { View, Text } from "react-native";

/**
 * WithdrawSummaryCard — Key transfer metadata breakdown including source, network and arrival estimate.
 */
export default function WithdrawSummaryCard({ network = "TRON (TRC-20)" }) {
  return (
    <View className="w-full bg-[#111417] border border-white/10 rounded-2xl p-4 gap-3">
      <View className="flex-row justify-between items-center">
        <Text className="font-noir text-xs text-gray-400">From</Text>
        <Text className="font-noir text-xs font-medium text-white">
          Available Balance
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="font-noir text-xs text-gray-400">Network</Text>
        <Text className="font-noir text-xs font-medium text-white">
          {network}
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="font-noir text-xs text-gray-400">Estimated Arrival</Text>
        <Text className="font-noir text-xs font-medium text-noirMint">
          1–2 Business Days
        </Text>
      </View>
    </View>
  );
}
