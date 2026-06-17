import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";
import { formatNumber } from "../../utils/helper";

export default function OrderSuccess({ inrAmount, usdtAmount, walletAddress, proofsList }) {
  const router = useRouter();

  // Animation values for entrance transitions
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View className="w-full py-8 items-center justify-center gap-8">
      {/* Celebration Badge */}
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }] }}
        className="items-center justify-center"
      >
        <View className="w-32 h-32 rounded-full bg-noirMint/10 items-center justify-center">
          <View className="w-24 h-24 rounded-full bg-noirMint items-center justify-center">
            <Feather name="check" size={48} color="#111418" />
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: "100%",
          alignItems: "center",
        }}
        className="gap-6"
      >
        <View className="items-center mb-2">
          <Text className="text-white font-noir text-[32px] text-center tracking-[-0.5px]">
            Payment Submitted
          </Text>
          <Text className="text-gray-400 font-noir text-sm text-center leading-[20px] max-w-[290px] mt-2">
            Our team is verifying your payment receipt. USDT will be released to your wallet address shortly.
          </Text>
        </View>

        {/* Summary Card */}
        <View className="w-full bg-[#0b0e11] border border-white/10 rounded-2xl p-5 gap-4">
          <View className="flex-row justify-between items-center border-b border-white/5 pb-3">
            <Text className="text-gray-400 font-noir text-xs">Status</Text>
            <View className="bg-noirMint/10 px-2.5 py-0.5 rounded-full border border-noirMint/25">
              <Text className="text-noirMint font-noir-medium text-[10px] uppercase tracking-wider">
                In Review
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-400 font-noir text-xs">Amount Paid</Text>
            <Text className="text-white font-noir text-sm">
              {formatNumber(inrAmount || "0")} INR
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-400 font-noir text-xs">USDT to Receive</Text>
            <Text className="text-noirMint font-noir text-sm">
              +{formatNumber(usdtAmount || "0")} USDT
            </Text>
          </View>

          <View className="flex-row justify-between border-t border-white/5 pt-3">
            <Text className="text-gray-400 font-noir text-xs">Recipient Wallet</Text>
            <Text
              className="text-white font-noir text-sm flex-1 text-right ml-4"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {walletAddress}
            </Text>
          </View>

          {proofsList && proofsList.length > 0 && (
            <View className="border-t border-white/5 pt-3 gap-3">
              <Text className="text-gray-400 font-noir-medium text-[10px] uppercase tracking-wider pl-1">
                Submitted Proofs ({proofsList.length})
              </Text>
              
              {proofsList.map((proof, idx) => (
                <View key={proof.id || idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 gap-2">
                  <View className="flex-row justify-between items-center border-b border-white/5 pb-1.5 mb-0.5">
                    <Text className="text-white font-noir-medium text-xs">{proof.title}</Text>
                    <View className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                      <Text className="text-gray-400 font-noir text-[8px] uppercase tracking-wide">
                        {proof.type}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 font-noir text-[10px]">Amount Paid</Text>
                    <Text className="text-white font-noir text-xs">₹{formatNumber(proof.amount)}</Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 font-noir text-[10px]">UTR / Ref ID</Text>
                    <Text className="text-white font-noir text-xs">{proof.utr}</Text>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500 font-noir text-[10px]">Attachment</Text>
                    <Text className="text-noirMint font-noir text-xs flex-1 text-right ml-4" numberOfLines={1} ellipsizeMode="tail">
                      {proof.file?.name || "Payment Receipt"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action buttons */}
        <View className="w-full gap-3 mt-4">
          <Button onPress={() => router.replace("/")} primary={true}>
            Go to Dashboard
          </Button>

          <Button onPress={() => router.replace("/transactions")} primary={false}>
            View Transactions
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}
