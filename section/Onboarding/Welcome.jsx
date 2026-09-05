import { View, Text, Image, useWindowDimensions, ScrollView } from "react-native";
import Button from "../../components/Button";

export default function WelcomeScreen({ onNext }) {
    const { width } = useWindowDimensions();
    const scaledSize = width * 1.1; // Scale the GIF to 1.1x screen width to make it larger

    return (
        <View className="flex-1 justify-between px-5 py-4 w-full">
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}
            >
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
                    Fast and secure OTC platform. Exchange INR to USDT with seamless verification, reliable payouts, and real-time rates.
                </Text>
            </ScrollView>

            {/* Next Button with built-in Haptic Vibration */}
            <View className="w-full pt-4">
                <Button className="py-5" onPress={onNext} primary={true}>
                    Next
                </Button>
            </View>
        </View>
    );
}
