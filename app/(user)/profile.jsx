import React from "react";
import { Text, View, ScrollView } from "react-native";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * Profile Screen — Rendered inside the main layout wrapper.
 * Displays user avatar, statistics, settings options, and logout button.
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
        <View className="w-24 h-24 rounded-full bg-[#0a57ff]/10 border-2 border-[#0a57ff]/40 items-center justify-center mb-3.5 relative">
          <Text className="text-[#7eb8ff] text-[32px] font-extrabold">AM</Text>
          <HapticTouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0a57ff] border-2 border-[#0b1018] items-center justify-center">
            <Feather name="camera" size={14} color="white" />
          </HapticTouchableOpacity>
        </View>
        <Text className="text-[22px] font-extrabold text-white mb-1">Alex Mercer</Text>
        <Text className="text-[14px] text-[#9ba3af]">alex.mercer@currensea.com</Text>
      </View>

      {/* Account Tier Badge */}
      <View className="bg-[#0a57ff]/20 border border-[#0a57ff]/40 px-4 py-1.5 rounded-full mb-8 flex-row items-center gap-1.5">
        <Feather name="award" size={14} color="#7eb8ff" />
        <Text className="text-[#7eb8ff] text-[13px] font-semibold tracking-[0.5px]">
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
            className="w-full bg-white/5 rounded-2xl p-4 border border-white/[0.08] flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3.5">
              <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center">
                <Feather name={opt.icon} size={18} color="white" />
              </View>
              <View>
                <Text className="text-[14px] text-[#9ba3af] mb-0.5">{opt.label}</Text>
                <Text className="text-[15px] font-bold text-white">{opt.value}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="rgba(255, 255, 255, 0.35)" />
          </HapticTouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mb-4">
        <HapticTouchableOpacity className="w-full bg-white/10 border border-white/[0.08] py-4 rounded-xl flex-row items-center justify-center gap-2">
          <Feather name="help-circle" size={16} color="white" />
          <Text className="text-white text-[15px] font-semibold">Help & Support</Text>
        </HapticTouchableOpacity>

        <HapticTouchableOpacity
          hapticType="warning"
          className="w-full bg-red-500/10 border border-red-500/20 py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <Feather name="log-out" size={16} color="#ef4444" />
          <Text className="text-[#ef4444] text-[15px] font-bold">Log Out</Text>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
