import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Show from "../../../components/Show";
import HapticTouchableOpacity from "../../../components/HapticTouchableOpacity";

/**
 * AccountsHeader — Left-aligned header with thin rounded plus button on the right with haptic feedback.
 */
export default function AccountsHeader({
  activeTab = "banks",
  onAddPress,
  bankCount = 0,
  maxBanks = 3,
}) {
  const isBanks = activeTab === "banks";
  const isLimitReached = isBanks && bankCount >= maxBanks;

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

        <Show>
          <Show.If isTrue={isBanks}>
            {/* Segmented Progress Bar & Count indicator */}
            <View className="flex-row items-center gap-2 mt-2">
              <View className="flex-row gap-1 items-center">
                {Array.from({ length: maxBanks }).map((_, i) => {
                  const isActive = i < bankCount;
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
                  ? `${bankCount}/${maxBanks} Limit Reached`
                  : `${bankCount} of ${maxBanks} linked`}
              </Text>
            </View>
          </Show.If>
          <Show.Else>
            <Text className="text-xs text-gray-400 font-noir mt-1">
              Manage whitelisted crypto payout addresses.
            </Text>
          </Show.Else>
        </Show>
      </View>

      {/* Right Column: Plus Button */}
      <HapticTouchableOpacity
        onPress={onAddPress}
        disabled={isLimitReached}
        activeOpacity={0.8}
        hapticType="light"
        className={`w-13 h-13 rounded-full items-center justify-center ${
          isLimitReached
            ? "bg-white/10 border border-white/15 opacity-60"
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
