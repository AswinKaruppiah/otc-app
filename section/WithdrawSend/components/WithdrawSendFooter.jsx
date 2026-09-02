import { View, Text, TouchableOpacity } from "react-native";

/**
 * WithdrawSendFooter — Bottom action button container for proceeding to confirmation.
 */
export default function WithdrawSendFooter({ disabled, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      className={`w-full py-4 rounded-full bg-noirMint items-center justify-center ${
        !disabled ? "opacity-100" : "opacity-35"
      }`}
    >
      <Text className="font-noir font-bold text-base text-[#060E0B]">
        Continue
      </Text>
    </TouchableOpacity>
  );
}
