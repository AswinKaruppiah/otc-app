import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Show from "../../components/Show";
import { formatNumber } from "../../utils/helper";

export const OrderDetailsCard = ({
    inrAmount,
    usdtAmount,
    exchangeRate,
}) => {
    return (
        <Show>
            <Show.If isTrue={!!(inrAmount || usdtAmount || exchangeRate)}>
                <View className="w-full">
                    {/* Preview Section Header */}
                    <View className="pl-1 mb-3">
                        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
                            Order Preview
                        </Text>
                    </View>

                    <View className="relative w-full">
                        {/* Top Half (INR) */}
                        <LinearGradient
                            colors={["#13242A", "#0B1114"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            className="px-6 py-8 border overflow-hidden rounded-t-3xl border-white/[0.04] border-b-0"
                        >
                            {/* Currency Select Chip */}
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center bg-white/5 py-1.5 pl-1.5 pr-3.5 rounded-full gap-2 border border-white/[0.04]">
                                    <Image
                                        source={require("../../assets/images/Flag_of_India.png")}
                                        style={{ width: 24, height: 24, borderRadius: 12 }}
                                        resizeMode="cover"
                                    />
                                    <Text className="text-white -mb-0.5 font-noir text-base">
                                        INR
                                    </Text>
                                </View>

                                <View className="bg-white/5 px-2.5 py-1 rounded-full border border-white/[0.04]">
                                    <Text className="text-gray-400 font-noir-medium text-[10px] uppercase tracking-wider">
                                        You Pay
                                    </Text>
                                </View>
                            </View>

                            {/* Amount Value */}
                            <View className="my-4">
                                <Text className="text-white font-noir text-[42px] font-semibold p-0 m-0 w-full">
                                    {formatNumber(inrAmount || "0")}
                                </Text>
                            </View>
                        </LinearGradient>

                        {/* Divider and Exchange Rate Badge */}
                        <View className="relative items-center justify-center my-0.5 z-10">
                            <View
                                className="absolute bg-noirBg border border-white/5 px-4 py-1.5 rounded-full items-center justify-center shadow-sm"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.08,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            >
                                <Text className="text-gray-400 font-noir -mb-0.5 text-xs">
                                    1 USDT = <Text className="text-white font-noir-medium">{exchangeRate} INR</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Bottom Half (USDT) */}
                        <LinearGradient
                            colors={["#0B1114", "#13242A"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            className="px-6 py-8 rounded-b-3xl overflow-hidden border border-white/[0.04] border-t-0"
                        >
                            {/* Currency Select Chip */}
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center bg-white/5 py-1.5 pl-1.5 pr-3.5 rounded-full gap-2 border border-white/[0.04]">
                                    <Image
                                        source={require("../../assets/images/tether-usdt-logo.png")}
                                        style={{ width: 24, height: 24, borderRadius: 12 }}
                                        resizeMode="cover"
                                    />
                                    <Text className="text-white -mb-0.5 font-noir text-base">
                                        USDT
                                    </Text>
                                </View>

                                <View className="bg-noirMint/10 px-2.5 py-1 rounded-full border border-noirMint/5">
                                    <Text className="text-noirMint font-noir-medium text-[10px] uppercase tracking-wider">
                                        You Receive
                                    </Text>
                                </View>
                            </View>

                            {/* Amount Value */}
                            <View className="my-4">
                                <Text className="text-noirMint font-noir text-[42px] font-semibold p-0 m-0 w-full">
                                    {formatNumber(usdtAmount || "0")}
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </Show.If>
        </Show>
    );
};
