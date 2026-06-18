import React from "react";
import { Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { withUniwind } from "uniwind";
import HapticTouchableOpacity from "./HapticTouchableOpacity";

const StyledMaterialIcons = withUniwind(MaterialIcons);

/**
 * Reusable Button Component for Quotex
 *
 * Props:
 * - title (string): Button label text.
 * - onPress (function): Click/Press handler.
 * - primary (boolean): True for premium mint pill with arrow; false for translucent dark outline.
 * - disabled (boolean): If true, reduces opacity and disables touch events.
 * - className (string): Additional tailwind utility styles.
 * - style (object): Custom stylesheet styles.
 */
export default function Button({
  children,
  onPress,
  primary = true,
  disabled = false,
  className = "",
  style,
}) {
  if (primary) {
    return (
      <HapticTouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled}
        hapticType="medium"
        className={`w-full bg-noirMint py-6 rounded-full flex-row items-center justify-center relative ${
          disabled ? "opacity-50" : ""
        } ${className}`}
        style={style}
      >
        <Text className="text-noirBg font-noir-medium text-xl">{children}</Text>
        <View className="absolute top-1 bottom-1 right-1 aspect-square rounded-full bg-noirBg items-center justify-center">
          <StyledMaterialIcons
            name={disabled ? "lock" : "arrow-forward-ios"}
            size={disabled ? 18 : 20}
            colorClassName="accent-noirMint"
          />
        </View>
      </HapticTouchableOpacity>
    );
  }

  // Secondary/Outline Variant
  return (
    <HapticTouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      hapticType="light"
      className={`w-full bg-white/5 border border-white/[0.04] h-14 rounded-full flex-row items-center justify-center ${
        disabled ? "opacity-50" : ""
      } ${className}`}
      style={style}
    >
      <Text className="text-gray-400 font-noir text-[16px] font-semibold">
        {children}
      </Text>
    </HapticTouchableOpacity>
  );
}
