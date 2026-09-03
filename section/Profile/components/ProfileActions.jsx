import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../../utils/haptics";

/**
 * ProfileActions — Bottom action buttons for Support, Policy, and Destructive Sign Out.
 */
export default function ProfileActions({ onSupportPress, onLogoutPress }) {
  return (
    <View className="w-full gap-3 mt-1">
      {/* Help & Support Button */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          haptic.light();
          onSupportPress?.();
        }}
        className="w-full bg-noirCard border border-white/[0.08] py-4 rounded-2xl flex-row items-center justify-center gap-2"
      >
        <Feather name="help-circle" size={17} color="#96dded" />
        <Text className="text-white font-noir font-medium text-sm">Help & Support</Text>
      </TouchableOpacity>

      {/* Log Out Destructive Button */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          haptic.medium();
          onLogoutPress?.();
        }}
        className="w-full bg-red-500/10 border border-red-500/20 py-4 rounded-2xl flex-row items-center justify-center gap-2 active:bg-red-500/20"
      >
        <Feather name="log-out" size={17} color="#f87171" />
        <Text className="text-red-400 font-noir font-medium text-sm">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
