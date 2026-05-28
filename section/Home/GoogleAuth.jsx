import React from "react";
import { Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";

export default function GoogleAuth() {
  return (
    <HapticTouchableOpacity
      activeOpacity={0.8}
      className="w-full bg-white/5 border border-white/[0.08] h-14 rounded-full flex-row items-center justify-center mt-4"
    >
      <Ionicons name="logo-google" size={18} color="#ffffff" style={{ marginRight: 10 }} />
      <Text className="text-noirText font-noir text-[16px] font-medium">
        Sign in with Google
      </Text>
    </HapticTouchableOpacity>
  );
}
