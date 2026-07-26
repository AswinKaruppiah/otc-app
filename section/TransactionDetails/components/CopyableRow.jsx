import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { haptic } from "../../../utils/haptics";

export const CopyableRow = ({
  label,
  value,
  displayValue,
  isMonospace = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    haptic.light();
    try {
      await Clipboard.setStringAsync(String(value));
    } catch (e) {
      console.log("Clipboard error:", e);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="flex-row justify-between items-center py-2 last:border-b-0">
      <View className="flex-1 mr-4">
        <Text className="text-gray-400 font-noir text-[13px]">{label}</Text>
        <Text
          className={`text-white font-noir text-[14px] mt-0.5 ${
            isMonospace ? "tracking-wider uppercase" : ""
          }`}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {displayValue || value}
        </Text>
      </View>
      <Pressable
        onPress={handleCopy}
        hitSlop={8}
        className="p-2 rounded-lg bg-white/5 active:bg-white/10"
      >
        <Feather
          name={copied ? "check" : "copy"}
          size={15}
          color={copied ? "#baffd8" : "rgba(255, 255, 255, 0.6)"}
        />
      </Pressable>
    </View>
  );
};
