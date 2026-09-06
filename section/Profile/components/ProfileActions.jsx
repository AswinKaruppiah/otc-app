import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import HapticTouchableOpacity from "../../../components/HapticTouchableOpacity";

/**
 * ProfileActions — Luxury grouped list card for Guides, Support, and Sign Out.
 */
export default function ProfileActions({
  onKycGuidePress,
  onSupportPress,
  onLogoutPress,
}) {
  return (
    <View className="w-full">
      {/* Section Header */}
      <Text className="text-sm font-noir-medium font-bold text-white mb-3">
        Resources & Assistance
      </Text>

      {/* Grouped Rounded Card */}
      <View className="w-full bg-noirCard mb-6 border border-white/[0.08] rounded-3xl overflow-hidden divide-y divide-white/[0.06]">
        {/* Row 1: KYC Verification Guide */}
        <HapticTouchableOpacity
          activeOpacity={0.7}
          hapticType="light"
          onPress={onKycGuidePress}
          className="p-4 flex-row items-center justify-between active:bg-white/[0.04]"
        >
          <View className="flex-row items-center gap-3.5 flex-1 mr-2">
            <View className="w-10 h-10 rounded-2xl bg-noirMint/10 border border-noirMint/20 items-center justify-center">
              <Feather name="shield" size={18} color="#baffd8" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-noir-medium text-sm font-semibold">
                KYC Verification Guide
              </Text>
              <Text className="text-gray-400 font-noir text-[11px]" numberOfLines={1}>
                Step-by-step verification on app.bloqex.com
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#6b7280" />
        </HapticTouchableOpacity>

        {/* Row 2: Help & Support Desk */}
        <HapticTouchableOpacity
          activeOpacity={0.7}
          hapticType="light"
          onPress={onSupportPress}
          className="p-4 flex-row items-center justify-between active:bg-white/[0.04]"
        >
          <View className="flex-row items-center gap-3.5 flex-1 mr-2">
            <View className="w-10 h-10 rounded-2xl bg-noirCyan/10 border border-noirCyan/20 items-center justify-center">
              <Feather name="headphones" size={18} color="#96dded" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-noir-medium text-sm font-semibold">
                Help & Support Desk
              </Text>
              <Text className="text-gray-400 font-noir text-[11px]" numberOfLines={1}>
                24/7 OTC assistance & dispute tickets
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#6b7280" />
        </HapticTouchableOpacity>
      </View>

      {/* Premium Obsidian-Crimson Logout Button */}
      <HapticTouchableOpacity
        activeOpacity={0.85}
        hapticType="medium"
        onPress={onLogoutPress}
        className="w-full rounded-full overflow-hidden border border-red-500/25 mb-6"
      >
        <LinearGradient
          colors={["rgba(239, 68, 68, 0.12)", "rgba(127, 29, 29, 0.05)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pr-3 pl-3 py-3 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3.5 flex-1 mr-2">
            <View className="w-16 aspect-square rounded-full bg-red-500/15 border border-red-500/30 items-center justify-center">
              <Feather name="log-out" size={18} color="#f87171" />
            </View>
            <View className="flex-1">
              <Text className="text-red-400 font-noir-medium text-sm font-semibold tracking-wide">
                Log Out of Account
              </Text>
              <Text className="text-red-300/60 font-noir text-[11px] mt-0.5" numberOfLines={1}>
                Safely end your session on this device
              </Text>
            </View>
          </View>
        </LinearGradient>
      </HapticTouchableOpacity>
    </View>
  );
}
