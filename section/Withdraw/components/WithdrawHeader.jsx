import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * WithdrawHeader — Header badge, title, and description for withdrawal screen.
 */
export default function WithdrawHeader() {
  return (
    <View className="items-center mb-6">
      <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-3 flex-row items-center gap-1.5">
        <Feather name="shield" size={13} color="#baffd8" />
        <Text className="text-noirMint font-noir text-[12px] tracking-[0.5px]">
          Whitelisted USDT Withdrawals
        </Text>
      </View>
      <Text className="text-[32px] text-white font-noir font-bold mb-1 text-center tracking-[-0.5px]">
        Withdraw Funds
      </Text>
      <Text className="text-xs text-gray-400 font-noir text-center max-w-[290px] leading-5">
        Transfer USDT securely to your verified whitelisted wallet address.
      </Text>
    </View>
  );
}
