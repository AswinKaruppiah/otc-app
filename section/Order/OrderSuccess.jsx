import { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";

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
    <View className="flex-1 w-full justify-between items-center pt-8">
      {/* Top section containing Badge and Text */}
      <View className="w-full items-center gap-8 mt-12">
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
        </Animated.View>
      </View>

      {/* Action buttons pinned to bottom */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: "100%",
        }}
        className="w-full gap-3 mt-auto"
      >
        <Button onPress={() => router.replace("/transactions")} primary={false}>
          View Transactions
        </Button>
        <Button onPress={() => router.replace("/")} primary={true}>
          Go to Dashboard
        </Button>
      </Animated.View>
    </View>
  );
}
