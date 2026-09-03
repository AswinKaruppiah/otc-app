import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../../utils/haptics";

/**
 * ProfileMenuItem — Clean interactive list row inside a profile menu card.
 */
export default function ProfileMenuItem({
  icon,
  iconColor = "#baffd8",
  label,
  value,
  badgeText,
  badgeColor,
  onPress,
  isLast = false,
}) {
  const handlePress = () => {
    haptic.light();
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`w-full py-3.5 px-3 flex-row items-center justify-between ${
        !isLast ? "border-b border-white/[0.04]" : ""
      }`}
    >
      {/* Left: Icon and Title */}
      <View className="flex-row items-center gap-3.5 flex-1 mr-3">
        <View className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/[0.05] items-center justify-center">
          <Feather name={icon} size={18} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-white font-noir text-sm tracking-tight">{label}</Text>
          {value ? (
            <Text className="text-gray-400 font-noir text-xs mt-0.5" numberOfLines={1}>
              {value}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Right: Badge / Chevron */}
      <View className="flex-row items-center gap-2">
        {badgeText ? (
          <View
            className="px-2.5 py-0.5 rounded-full border border-white/10"
            style={{ backgroundColor: badgeColor || "rgba(255, 255, 255, 0.08)" }}
          >
            <Text className="text-[11px] font-noir font-medium text-white">{badgeText}</Text>
          </View>
        ) : null}
        <Feather name="chevron-right" size={16} color="rgba(255, 255, 255, 0.3)" />
      </View>
    </TouchableOpacity>
  );
}
