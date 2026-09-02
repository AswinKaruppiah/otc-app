import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * WithdrawConfirmHeader — Top navigation bar with back arrow and centered Confirmation title.
 */
export default function WithdrawConfirmHeader({ title = "Confirmation", onBack }) {
  return (
    <View className="flex-row items-center justify-between mb-4 px-1">
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        className="w-11 h-11 rounded-full bg-[#13171a] border border-white/10 items-center justify-center active:bg-[#1e252a]"
      >
        <Feather name="chevron-left" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text className="text-lg font-noir font-bold text-white tracking-wide">
        {title}
      </Text>

      <View className="w-11 h-11" />
    </View>
  );
}
