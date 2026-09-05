import { View, Text, TouchableOpacity } from "react-native";

export const PRESET_OPTIONS = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "Max", value: 1.0 },
];

/**
 * WithdrawQuickPresets — Quick percentage buttons (25%, 50%, 75%, Max) for instant amount setting.
 */
export default function WithdrawQuickPresets({ onSelectPercent }) {
  return (
    <View className="flex-row items-center justify-between gap-1">
      {PRESET_OPTIONS.map((preset) => (
        <TouchableOpacity
          key={preset.label}
          activeOpacity={0.7}
          onPress={() => onSelectPercent(preset.value)}
          className="flex-1 py-2.5 rounded-full bg-[#13171a] border border-white/[0.06] items-center justify-center active:bg-[#1e252a]"
        >
          <Text className="font-noir text-xs font-medium text-gray-200">
            {preset.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
