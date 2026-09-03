import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../../utils/haptics";

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
      <View className="w-full bg-noirCard mb-8 border border-white/[0.08] rounded-3xl overflow-hidden divide-y divide-white/[0.06]">
        {/* Row 1: KYC Verification Guide */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            haptic.light();
            onKycGuidePress?.();
          }}
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
        </TouchableOpacity>

        {/* Row 2: Help & Support Desk */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            haptic.light();
            onSupportPress?.();
          }}
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
        </TouchableOpacity>
      </View>

      {/* Understated Destructive Log Out Button */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          haptic.medium();
          onLogoutPress?.();
        }}
        className="w-full bg-red-500/10 border border-red-500/20 py-3.5 rounded-2xl flex-row items-center justify-center gap-2 mt-4 active:bg-red-500/20"
      >
        <Feather name="log-out" size={16} color="#f87171" />
        <Text className="text-red-400 font-noir font-medium text-xs tracking-wide">
          Log Out of Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
