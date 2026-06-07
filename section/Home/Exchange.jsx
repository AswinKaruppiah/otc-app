import { useState, useMemo } from "react";
import { View, Text, Image, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "../../components/Button";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { sanitizeAmount, formatNumber } from "../../utils/helper";
import GoogleAuth from "./GoogleAuth";
import { useUser } from "../../hooks/useUser";
import { useLatestPrice } from "../../hooks/useLatestPrice";
import Show from "../../components/Show";
import { Skeleton } from "heroui-native";
import { useQuery } from "@apollo/client/react";
import { LIST_ORDERS } from "../../apollo/query";
import { useRouter } from "expo-router";

export const ExchangeCard = () => {
  const router = useRouter();
  const { latestPrice } = useLatestPrice();
  const exchangeRate = latestPrice?.sellPrice ? parseFloat(latestPrice.sellPrice) : 0;

  const { data: ordersData, loading: ordersLoading, error: ordersError, networkStatus } = useQuery(LIST_ORDERS, {
    variables: { status: ["PENDING"] },
  });
  const pendingOrdersCount = ordersData?.listOrders?.total ?? 0;

  const [inputValue, setInputValue] = useState("10000");
  const [isBaseInr, setIsBaseInr] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isAuth, loading, error, user } = useUser();

  // Compute inrAmount using useMemo
  const inrAmount = useMemo(() => {
    if (isBaseInr) return inputValue;
    if (!inputValue) return "";
    if (exchangeRate === 0) return "";
    const usdtVal = parseFloat(inputValue) || 0;
    const inrVal = usdtVal * exchangeRate;
    return Number(inrVal.toFixed(2)).toString();
  }, [inputValue, isBaseInr, exchangeRate]);

  // Compute usdtAmount using useMemo
  const usdtAmount = useMemo(() => {
    if (!isBaseInr) return inputValue;
    if (!inputValue) return "";
    if (exchangeRate === 0) return "";
    const inrVal = parseFloat(inputValue) || 0;
    const usdtVal = inrVal / exchangeRate;
    return Number(usdtVal.toFixed(2)).toString();
  }, [inputValue, isBaseInr, exchangeRate]);

  const handleInrChange = (val) => {
    const cleanInr = sanitizeAmount(val);
    setIsBaseInr(true);
    setInputValue(cleanInr);
  };

  const handleUsdtChange = (val) => {
    const cleanUsdt = sanitizeAmount(val);
    setIsBaseInr(false);
    setInputValue(cleanUsdt);
  };

  const handleSwap = () => {
    setIsBaseInr((prev) => !prev);
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
          <View className="flex-row justify-between items-end">
            <Text className="text-gray-400 font-noir text-[13px]">Order Pending</Text>
            <Show>
              <Show.If isTrue={!isAuth}>
                <Text className="text-gray-400 leading-none font-noir text-sm">-</Text>
              </Show.If>
              <Show.ElseIf isTrue={networkStatus === 1 || !!ordersError}>
                <Skeleton className="w-8 h-3.5 rounded-sm" />
              </Show.ElseIf>
              <Show.Else>
                <Text className="text-gray-400 leading-none font-noir text-sm">
                  {pendingOrdersCount}
                </Text>
              </Show.Else>
            </Show>
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
          <View className="flex-row justify-between items-end">
            <Text className="text-gray-400 font-noir text-[13px]">Exchange Rate</Text>
            <Show>
              <Show.If isTrue={loading || !!error}>
                <Skeleton className="w-24 h-3.5 rounded-sm" />
              </Show.If>
              <Show.Else>
                <Text className="text-gray-400 leading-none font-noir text-sm">
                  1 USDT = {exchangeRate} INR
                </Text>
              </Show.Else>
            </Show>
          </View>
        </LinearGradient>
      </View>

      {/* Action Button */}

      <Show>
        <Show.If isTrue={(loading || !!error) && !isLoggingIn}>
          <Skeleton className="w-full h-20 rounded-full" />
        </Show.If>
        <Show.ElseIf isTrue={isAuth && !isLoggingIn && !user.onboarding}>
          <Button onPress={() => router.replace("/onboarding")}>
            Get Started
          </Button>
        </Show.ElseIf>
        <Show.ElseIf isTrue={isAuth && !isLoggingIn}>
          <Button>Buy USDT</Button>
        </Show.ElseIf>
        <Show.Else>
          <GoogleAuth isLoggingIn={isLoggingIn} setIsLoggingIn={setIsLoggingIn} />
        </Show.Else>
      </Show>
    </View>
  );
};
