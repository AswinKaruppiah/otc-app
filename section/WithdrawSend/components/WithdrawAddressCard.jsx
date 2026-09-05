import { View, Text, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { maskText } from "../../../utils/helper";
import Show from "../../../components/Show";

/**
 * WithdrawAddressCard — Destination TRC-20 whitelisted address selector card.
 */
export default function WithdrawAddressCard({
  selectedAddress,
  whitelistedAddresses = [],
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="w-full bg-[#111417] border border-white/10 rounded-3xl p-4 flex-row items-center justify-between active:bg-white/10"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center">
          <Image
            source={require("../../../assets/images/tether-usdt-logo.png")}
            style={{ width: 22, height: 22, borderRadius: 11 }}
            resizeMode="contain"
          />
        </View>
        <View className="flex-1">
          <Show>
            <Show.If isTrue={Boolean(selectedAddress)}>
              <View className="flex-row items-center gap-2">
                <Text className="font-noir font-semibold text-sm text-white">
                  {selectedAddress?.label || "Whitelisted Wallet"}
                </Text>
                <View className="px-1.5 py-0.2 rounded bg-red-500/15 border border-red-500/30">
                  <Text className="text-[9px] font-noir-medium text-red-400">
                    TRC-20
                  </Text>
                </View>
              </View>
              <Text className="font-mono text-xs text-gray-400 mt-0.5">
                {maskText(selectedAddress?.address, 6)}
              </Text>
            </Show.If>
            <Show.ElseIf isTrue={whitelistedAddresses.length === 0}>
              <Text className="font-noir text-xs text-gray-400">
                Add Wallet Address
              </Text>
            </Show.ElseIf>
            <Show.Else>
              <Text className="font-noir text-xs text-gray-400">
                Select recipient address...
              </Text>
            </Show.Else>
          </Show>
        </View>
      </View>
      <Feather name="chevron-down" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
