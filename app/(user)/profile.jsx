import React from "react";
import { Text, View } from "react-native";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import Feather from "@expo/vector-icons/Feather";

/**
 * Profile Screen — User avatar, status details, account actions.
 * Rebuilt using the premium Noir theme:
 *   - Base font: font-noir / font-noir-medium
 *   - Colors: bg-noirCard, bg-noirMint, bg-noirCyan
 */
export default function Profile() {
  const profileOptions = [
    { id: "1", label: "Personal Details", value: "Alex Mercer", icon: "user" },
    { id: "2", label: "Linked Bank Accounts", value: "2 Banks", icon: "briefcase" },
    { id: "3", label: "Security & Biometrics", value: "FaceID On", icon: "shield" },
    { id: "4", label: "Preferences", value: "English • USD", icon: "sliders" },
  ];

  return (
    <View className="items-center py-[10px] w-full">
      {/* Avatar Section */}
      <View className="items-center mb-6">
        <View className="w-24 h-24 rounded-full bg-noirMint/10 border-2 border-noirMint/25 items-center justify-center mb-3.5 relative">
          <Text className="text-noirMint text-[32px] font-noir-medium">AM</Text>
          <HapticTouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-noirMint border-2 border-noirBg items-center justify-center">
            <Feather name="camera" size={14} color="#111418" />
          </HapticTouchableOpacity>
        </View>
        <Text className="text-[22px] font-noir-medium text-noirText mb-1">Alex Mercer</Text>
        <Text className="text-[14px] text-gray-400 font-noir">alex.mercer@currensea.com</Text>
      </View>

      {/* Account Tier Badge */}
      <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-8 flex-row items-center gap-1.5">
        <Feather name="award" size={14} color="#baffd8" />
        <Text className="text-noirMint text-[12px] font-noir-medium tracking-[0.5px]">
          CurrenSea Pro Member
        </Text>
      </View>

      {/* Options List */}
      <View className="w-full gap-4 mb-8">
        {profileOptions.map((opt) => (
          <HapticTouchableOpacity
            key={opt.id}
            activeOpacity={0.7}
            hapticType="selection"
            className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3.5">
              <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center">
                <Feather name={opt.icon} size={18} color="white" />
              </View>
              <View>
                <Text className="text-[14px] text-gray-400 font-noir mb-0.5">{opt.label}</Text>
                <Text className="text-[15px] font-noir-medium text-noirText">{opt.value}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="rgba(255, 255, 255, 0.35)" />
          </HapticTouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mb-4">
        <HapticTouchableOpacity className="w-full bg-white/5 border border-white/[0.04] py-4 rounded-xl flex-row items-center justify-center gap-2">
          <Feather name="help-circle" size={16} color="white" />
          <Text className="text-noirText text-[15px] font-noir-medium">Help & Support</Text>
        </HapticTouchableOpacity>

        <HapticTouchableOpacity
          hapticType="warning"
          className="w-full bg-red-500/5 border border-red-500/10 py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Feather name="log-out" size={16} color="#ff7b7b" />
          <Text className="text-[#ff7b7b] text-[15px] font-noir-medium">Log Out</Text>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
