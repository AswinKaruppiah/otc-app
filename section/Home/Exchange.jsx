import { useState } from "react";
import { View, Text, Image, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "../../components/Button";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { sanitizeAmount, formatNumber } from "../../utils/helper";
import GoogleAuth from "./GoogleAuth";
import { useUser } from "../../hooks/useUser";
import Show from "../../components/Show";
import { Skeleton } from "heroui-native";

export const ExchangeCard = () => {
  const [inrAmount, setInrAmount] = useState("10000");
  const [usdtAmount, setUsdtAmount] = useState("1000");
  const [isBaseInr, setIsBaseInr] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const EXCHANGE_RATE = 85;
  const { isAuth, loading, error } = useUser();

  const handleInrChange = (val) => {
    const cleanInr = sanitizeAmount(val);
    setInrAmount(cleanInr);
    setIsBaseInr(true);

    if (cleanInr === "") {
      setUsdtAmount("");
    } else {
      const inrVal = parseFloat(cleanInr) || 0;
      const usdtVal = inrVal / EXCHANGE_RATE;
      setUsdtAmount(Number(usdtVal.toFixed(2)).toString());
    }
  };

  const handleUsdtChange = (val) => {
    const cleanUsdt = sanitizeAmount(val);
    setUsdtAmount(cleanUsdt);
    setIsBaseInr(false);

    if (cleanUsdt === "") {
      setInrAmount("");
    } else {
      const usdtVal = parseFloat(cleanUsdt) || 0;
      const inrVal = usdtVal * EXCHANGE_RATE;
      setInrAmount(Number(inrVal.toFixed(2)).toString());
    }
  };

  const handleSwap = () => {
    if (isBaseInr) {
      // The current INR amount becomes the new USDT amount
      const val = inrAmount;
      if (val === "") {
        setUsdtAmount("");
        setInrAmount("");
      } else {
        setUsdtAmount(val);
        const usdtVal = parseFloat(val) || 0;
        const inrVal = usdtVal * EXCHANGE_RATE;
        setInrAmount(Number(inrVal.toFixed(2)).toString());
      }
      setIsBaseInr(false);
    } else {
      // The current USDT amount becomes the new INR amount
      const val = usdtAmount;
      if (val === "") {
        setInrAmount("");
        setUsdtAmount("");
      } else {
        setInrAmount(val);
        const inrVal = parseFloat(val) || 0;
        const usdtVal = inrVal / EXCHANGE_RATE;
        setUsdtAmount(Number(usdtVal.toFixed(2)).toString());
      }
      setIsBaseInr(true);
    }
  };

  return (
    <View className="gap-8">
      {/* Main card container */}
      <View className="relative w-full">
        {/* Top Half (INR) */}
        <LinearGradient
          colors={["#1d282d", "#111418"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="px-6 py-8 border overflow-hidden rounded-t-3xl border-white/[0.04] border-b-0"
        >
          {/* Row 1: Currency Select Chip */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-white/5 py-1.5 pl-1.5 pr-3.5 rounded-full gap-2 border border-white/[0.04]">
              {/* India Flag Image */}
              <Image
                source={require("../../assets/images/Flag_of_India.png")}
                style={{ width: 24, height: 24, borderRadius: 12 }}
                resizeMode="cover"
              />
              <Text className="text-noirText -mb-0.5 font-noir text-base">
                INR
              </Text>
            </View>
          </View>

          {/* Row 2: Amount Value Input */}
          <View className="my-4">
            <TextInput
              value={formatNumber(inrAmount)}
              onChangeText={handleInrChange}
              keyboardType="numeric"
              className="text-noirText font-noir text-[50px] p-0 m-0 w-full"
              placeholder="0"
              placeholderTextColor="rgba(255, 255, 255, 0.2)"
              style={{ paddingVertical: 0 }}
            />
          </View>

          {/* Row 3: Order Pending */}
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Order Pending</Text>
            <Text className="text-gray-400 font-noir text-[13px]">
              2
            </Text>
          </View>
        </LinearGradient>

        {/* Divider and Swap button */}
        <View className="relative items-center justify-center my-0.5 z-10">
          <HapticTouchableOpacity
            activeOpacity={0.8}
            hapticType="medium"
            onPress={handleSwap}
            className="absolute bg-noirCard border border-white/[0.08] w-12 h-12 rounded-2xl items-center justify-center shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <MaterialIcons name="swap-calls" size={30} color="#baffd8" strokeWidth={1.2} />
          </HapticTouchableOpacity>
        </View>

        {/* Bottom Half (USDT) */}
        <LinearGradient
          colors={["#111418", "#1d282d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="px-6 py-8 rounded-b-3xl overflow-hidden border border-white/[0.04] border-t-0"
        >
          {/* Row 1: Currency Select Chip */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-white/5 py-1.5 pl-1.5 pr-3.5 rounded-full gap-2 border border-white/[0.04]">
              {/* USDT Logo Image */}
              <Image
                source={require("../../assets/images/tether-usdt-logo.png")}
                style={{ width: 24, height: 24, borderRadius: 12 }}
                resizeMode="cover"
              />
              <Text className="text-noirText -mb-0.5 font-noir text-base">
                USDT
              </Text>
            </View>
          </View>

          {/* Row 2: Amount Value Input */}
          <View className="my-4">
            <TextInput
              value={formatNumber(usdtAmount)}
              onChangeText={handleUsdtChange}
              keyboardType="numeric"
              className="text-noirText font-noir text-[50px] p-0 m-0 w-full"
              placeholder="0"
              placeholderTextColor="rgba(255, 255, 255, 0.2)"
              style={{ paddingVertical: 0 }}
            />
          </View>

          {/* Row 3: Exchange Rate */}
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Exchange Rate</Text>
            <Text className="text-gray-400 font-noir text-[13px]">
              1 USDT = 85 INR
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Action Button */}

      <Show>
        <Show.If isTrue={(loading || !!error) && !isLoggingIn}>
          <Skeleton className="w-full h-20 rounded-full" />
        </Show.If>
        <Show.ElseIf isTrue={isAuth && !isLoggingIn}>
          <Button onPress={() => { }}>Buy USDT</Button>
        </Show.ElseIf>
        <Show.Else>
          <GoogleAuth isLoggingIn={isLoggingIn} setIsLoggingIn={setIsLoggingIn} />
        </Show.Else>
      </Show>
    </View>
  );
};
