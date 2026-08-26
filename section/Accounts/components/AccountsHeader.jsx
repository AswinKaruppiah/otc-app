import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Show from "../../../components/Show";
import HapticTouchableOpacity from "../../../components/HapticTouchableOpacity";

/**
 * AccountsHeader — Left-aligned header with thin rounded plus button on the right with haptic feedback.
 */
export default function AccountsHeader({ activeTab = "banks", onAddPress }) {
  const isBanks = activeTab === "banks";

  return (
    <View className="flex-row justify-between items-center mb-6">
      {/* Left Column: Title & Description */}
      <View className="flex-1 pr-4">
        <Text className="text-3xl text-noirText font-noir font-bold tracking-tight">
          <Show>
            <Show.If isTrue={isBanks}>Bank Accounts</Show.If>
            <Show.Else>Crypto Wallets</Show.Else>
          </Show>
        </Text>
        <Text className="text-xs text-gray-400 font-noir mt-1">
          <Show>
            <Show.If isTrue={isBanks}>
              Manage external bank connections and limits.
            </Show.If>
            <Show.Else>
              Manage whitelisted crypto payout addresses.
            </Show.Else>
          </Show>
        </Text>
      </View>

      {/* Right Column: Mint Rounded Plus Button */}
      <HapticTouchableOpacity
        onPress={onAddPress}
        activeOpacity={0.8}
        hapticType="light"
        className="w-14 aspect-square rounded-full bg-noirMint items-center justify-center active:opacity-75 shadow-md shadow-noirMint/20"
      >
        <Feather name="plus" size={22} color="#111418" />
      </HapticTouchableOpacity>
    </View>
  );
}
