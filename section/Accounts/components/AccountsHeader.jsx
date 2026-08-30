import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Show from "../../../components/Show";
import HapticTouchableOpacity from "../../../components/HapticTouchableOpacity";

/**
 * AccountsHeader — Left-aligned header with segmented progress bar and plus button.
 */
export default function AccountsHeader({
  activeTab = "banks",
  onAddPress,
  bankCount = 0,
  maxBanks = 3,
  walletCount = 0,
  maxWallets = 5,
}) {
  const isBanks = activeTab === "banks";
  const count = isBanks ? bankCount : walletCount;
  const max = isBanks ? maxBanks : maxWallets;
  const isLimitReached = count >= max;

  return (
    <View className="flex-row justify-between items-center mb-6">
      {/* Left Column: Title & Progress Bar */}
      <View className="flex-1 pr-4">
        <Text className="text-3xl text-noirText font-noir font-bold tracking-tight">
          <Show>
            <Show.If isTrue={isBanks}>Bank Accounts</Show.If>
            <Show.Else>Crypto Wallets</Show.Else>
          </Show>
        </Text>

        {/* Segmented Progress Bar & Count indicator */}
        <View className="flex-row items-center gap-2 mt-2">
          <View className="flex-row gap-1 items-center">
            {Array.from({ length: max }).map((_, i) => {
              const isActive = i < count;
              return (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${
                    isActive
                      ? isLimitReached
                        ? "w-4 bg-amber-400"
                        : "w-4 bg-noirMint"
                      : "w-2 bg-white/15"
                  }`}
                />
              );
            })}
          </View>

          <Text
            className={`font-noir text-xs font-medium ${
              isLimitReached ? "text-amber-400" : "text-gray-400"
            }`}
          >
            {isLimitReached
              ? `${count}/${max} Limit Reached`
              : `${count} of ${max} ${isBanks ? "linked" : "whitelisted"}`}
          </Text>
        </View>
      </View>

      {/* Right Column: Plus Button */}
      <HapticTouchableOpacity
        onPress={onAddPress}
        activeOpacity={0.8}
        hapticType="light"
        className={`w-13 h-13 rounded-full items-center justify-center ${
          isLimitReached
            ? "bg-white/10 border border-white/15"
            : "bg-noirMint shadow-md shadow-noirMint/20 active:opacity-75"
        }`}
      >
        <Feather
          name="plus"
          size={22}
          color={isLimitReached ? "#9CA3AF" : "#111418"}
        />
      </HapticTouchableOpacity>
    </View>
  );
}
