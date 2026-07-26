import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatNumber } from "../../../utils/helper";

export const TransactionHeroCard = ({ fiatAmount = 0, cryptoAmount = 0, rate = 0 }) => {
  return (
    <View className="w-full">
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
          {/* Top Half — INR / You Pay */}
          <LinearGradient
            colors={["#060C0A", "#091310"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 pt-8 pb-7"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center bg-white/5 py-1.5 pl-1.5 pr-3.5 rounded-full gap-2 border border-white/[0.06]">
                <Image
                  source={require("../../../assets/images/Flag_of_India.png")}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                  resizeMode="cover"
                />
                <Text className="text-white -mb-0.5 font-noir text-base">
                  INR
                </Text>
              </View>

              <View className="bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/[0.06]">
                <Text className="text-gray-400 font-noir-medium text-[10px] uppercase tracking-wider">
                  Transferred
                </Text>
              </View>
            </View>

            <View className="mt-5 mb-1">
              <Text className="text-white/90 font-noir text-[40px] leading-none font-bold">
                ₹{formatNumber(fiatAmount || "0")}
              </Text>
            </View>
          </LinearGradient>

          {/* Divider line — horizontal mint gradient */}
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.03)",
              "rgba(52,211,153,0.14)",
              "rgba(255,255,255,0.03)",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 1 }}
          />

          {/* Bottom Half — USDT / You Receive */}
          <LinearGradient
            colors={["#091310", "#0D2018"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="px-6 pt-7 pb-8"
          >
            <LinearGradient
              colors={["transparent", "rgba(52,211,153,0.06)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />

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
                  You Receive
                </Text>
              </View>
            </View>

            <View className="mt-5 mb-1">
              <Text className="text-noirMint font-noir text-[40px] leading-none font-bold">
                {cryptoAmount.toFixed(2)}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Floating Exchange Rate Badge */}
        {rate > 0 && (
          <View
            className="absolute left-0 right-0 items-center"
            style={{ top: "50%", marginTop: -16 }}
            pointerEvents="none"
          >
            <LinearGradient
              colors={["#0C1812", "#091310"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                borderRadius: 100,
                borderWidth: 1,
                borderColor: "rgba(52,211,153,0.18)",
                paddingHorizontal: 14,
                paddingVertical: 5,
              }}
            >
              <Text className="text-gray-400 font-noir text-xs -mb-0.5">
                1 USDT ={" "}
                <Text className="text-noirMint font-noir-medium">
                  {rate} INR
                </Text>
              </Text>
            </LinearGradient>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};
