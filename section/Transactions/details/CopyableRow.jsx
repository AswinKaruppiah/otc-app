import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { haptic } from "../../../utils/haptics";

export const CopyableRow = ({ label, value, displayValue, isMonospace = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    haptic.light();
    try {
      await Clipboard.setStringAsync(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.log("Copy error:", e);
    }
  };

  return (
    <View className="flex-row justify-between items-center py-2 last:border-b-0">
      <View className="flex-1 mr-4">
        <Text className="text-gray-400 font-noir text-[13px]">{label}</Text>
        <Text
          className={`text-white font-noir text-[14px] mt-0.5 ${isMonospace ? "tracking-wider uppercase" : ""
            }`}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {displayValue || value}
        </Text>
      </View>
      <Pressable
        onPress={handleCopy}
        className="w-8 h-8 rounded-lg bg-white/5 items-center justify-center active:bg-white/10"
      >
        <Feather
          name={copied ? "check" : "copy"}
          size={14}
          color={copied ? "#baffd8" : "rgba(255, 255, 255, 0.4)"}
        />
      </Pressable>
    </View>
  );
};
