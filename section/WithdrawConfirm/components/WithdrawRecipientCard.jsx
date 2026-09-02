import { View, Text, Image } from "react-native";

/**
 * WithdrawRecipientCard — Summary card of the destination whitelisted recipient address.
 */
export default function WithdrawRecipientCard({
  address,
  label = "Whitelisted Wallet",
  network = "TRC-20",
}) {
  return (
    <View className="w-full mb-6">
      <View className="pl-1 gap-1 mb-2.5">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Recipient Crypto Address
        </Text>
        <Text className="text-gray-500 font-noir text-xs leading-normal">
          USDT will be transferred to this whitelisted {network} wallet.
        </Text>
      </View>

      <View className="flex-row items-center justify-between bg-black/35 rounded-2xl p-4 border border-white/5 gap-3">
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="font-noir font-semibold text-sm text-white">
              {label}
            </Text>
            <View className="px-1.5 py-0.2 rounded bg-red-500/15 border border-red-500/30">
              <Text className="text-[9px] font-noir-medium text-red-400">
                {network}
              </Text>
            </View>
          </View>
          <Text
            className="font-mono text-xs text-gray-300 tracking-wide"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {address}
          </Text>
        </View>
        <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
          <Image
            source={require("../../../assets/images/tether-usdt-logo.png")}
            style={{ width: 22, height: 22, borderRadius: 11 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}
