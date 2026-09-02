import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatNumber } from "../../../utils/helper";

/**
 * WithdrawPreviewCard — Gradient highlight card showcasing withdrawal token and amount.
 */
export default function WithdrawPreviewCard({ amount }) {
  return (
    <View className="w-full mb-6">
      <View className="pl-1 mb-2.5">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Withdrawal Preview
        </Text>
      </View>

      <LinearGradient
        colors={[
          "rgba(255,255,255,0.09)",
          "rgba(255,255,255,0.04)",
          "rgba(52,211,153,0.22)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 28, padding: 1 }}
      >
        <View style={{ borderRadius: 27, overflow: "hidden" }}>
          <LinearGradient
            colors={["#060C0A", "#091310", "#0D2018"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 pt-6 pb-7"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center bg-white/5 py-1.5 pl-1.5 pr-3.5 rounded-full gap-2 border border-white/[0.06]">
                <Image
                  source={require("../../../assets/images/tether-usdt-logo.png")}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                  resizeMode="cover"
                />
                <Text className="text-white -mb-0.5 font-noir text-base">
                  USDT
                </Text>
              </View>

              <View className="bg-noirMint/10 px-2.5 py-1 rounded-full border border-noirMint/[0.12]">
                <Text className="text-noirMint font-noir-medium text-[10px] uppercase tracking-wider">
                  You Withdraw
                </Text>
              </View>
            </View>

            <View className="mt-5 mb-1">
              <Text className="text-noirMint font-noir text-[44px] leading-none">
                {formatNumber(amount || "0")}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}
