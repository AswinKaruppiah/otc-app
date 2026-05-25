import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Path } from "react-native-svg";
import Button from "../../components/Button";

export const ExchangeCard = () => {
  return (
    <View>
      {/* Main card container */}
      <View className="relative w-full">
        {/* Top Half (ETH) */}
        <LinearGradient
          colors={["#1d282d", "#111418"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="px-6 py-8 border overflow-hidden rounded-t-3xl border-white/[0.04] border-b-0"
        >
          {/* Row 1: Currency Select Chip */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="flex-row items-center bg-white/5 py-1.5 px-3.5 rounded-full gap-2 border border-white/[0.04]">
              {/* Ethereum SVG Icon */}
              <Svg width={12} height={20} viewBox="0 0 784 1277" fill="none">
                <Path
                  d="M392 0L383.5 28.5V870.5L392 879L784 648L392 0Z"
                  fill="#343434"
                />
                <Path d="M392 0L0 648L392 879V0Z" fill="#8C8C8C" />
                <Path
                  d="M392 956L387 962V1271.5L392 1277L784 726L392 956Z"
                  fill="#3C3C3C"
                />
                <Path d="M392 1277V956L0 726L392 1277Z" fill="#8C8C8C" />
                <Path d="M392 879L784 648L392 470V879Z" fill="#141414" />
                <Path d="M392 879V470L0 648L392 879Z" fill="#393939" />
              </Svg>
              <Text className="text-noirText font-noir text-[15px]">ETH</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Amount Value */}
          <View className="my-5">
            <Text className="text-noirText font-noir text-[50px]">12.695</Text>
          </View>

          {/* Row 3: Balance */}
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Balance</Text>
            <Text className="text-gray-400 font-noir text-[13px]">293.018</Text>
          </View>
        </LinearGradient>

        {/* Divider and Swap button */}
        <View className="relative items-center justify-center my-0.5 z-10">
          <TouchableOpacity
            activeOpacity={0.8}
            className="absolute bg-noirCard border border-white/[0.08] w-12 h-12 rounded-2xl items-center justify-center shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Ionicons name="swap-vertical" size={24} color="#baffd8" />
          </TouchableOpacity>
        </View>

        {/* Bottom Half (USD) */}
        <LinearGradient
          colors={["#111418", "#1d282d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="px-6 py-8 rounded-b-3xl overflow-hidden border border-white/[0.04] border-t-0"
        >
          {/* Row 1: Currency Select Chip */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="flex-row items-center bg-white/5 py-1.5 px-3.5 rounded-full gap-2 border border-white/[0.04]">
              <Text className="text-gray-400 font-noir text-[15px]">$</Text>
              <Text className="text-noirText font-noir text-[15px]">USD</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Amount Value */}
          <View className="my-5">
            <Text className="text-noirText font-noir text-[50px]">
              43,762.64
            </Text>
          </View>

          {/* Row 3: Balance */}
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-400 font-noir text-[13px]">Balance</Text>
            <Text className="text-gray-400 font-noir text-[13px]">
              122,987.21
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Action Button */}
      <Button onPress={() => {}} className="mt-8">
        Buy USD
      </Button>
    </View>
  );
};
