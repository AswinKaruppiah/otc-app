import { View, Text, Image, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../components/Button";

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const scaledSize = width * 1.1; // Scale the GIF to 1.1x screen width to make it larger
  const router = useRouter();

  return (
    <View className="w-full pb-8 items-center">
      {/* GIF Asset */}
      <View className="items-center mb-6" style={{ marginHorizontal: -20 }}>
        <Image
          source={require("../../assets/images/onboarding.gif")}
          style={{ width: scaledSize, height: scaledSize }}
          resizeMode="contain"
        />
      </View>

      {/* Heading */}
      <Text className="text-3xl text-noirText font-noir mb-3 text-center tracking-[-0.5px]">
        Welcome to Quotex
      </Text>

      {/* Short Onboarding Paragraph */}
      <Text className="text-sm text-gray-400 font-noir text-center max-w-[300px] leading-[22px] mb-8">
        Fast and secure OTC platform. Exchange INR to USDT with instant verification, automated payouts, and real-time rates.
      </Text>

      {/* Next Button with built-in Haptic Vibration */}
      <View className="w-full pt-4">
        <Button className="py-5" onPress={() => router.replace("/")} primary={true}>
          Next
        </Button>
      </View>
    </View>
  );
}
