import React from "react";
import { View, Text, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";
import { LinearGradient } from "expo-linear-gradient";

export default function SuccessScreen({ onFinish }) {
  return (
    <View className="flex-1 justify-between px-5 py-4 w-full">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}
      >
        {/* Header Info */}
        <View className="items-center mb-6">
          <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-4 flex-row items-center gap-1.5">
            <Feather name="shield" size={13} color="#baffd8" />
            <Text className="text-noirMint font-noir text-[12px] tracking-[0.5px]">
              Setup Complete
            </Text>
          </View>
          <Text className="text-[32px] text-noirText font-noir mb-2 text-center tracking-[-0.5px]">
            All Set!
          </Text>
          <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
            Your account has been configured successfully.
          </Text>
        </View>

        {/* Success Card Animation/Glow */}
        <View className="w-full relative items-center justify-center my-4">
          <View className="absolute w-48 h-48 rounded-full bg-noirMint/5 blur-xl" />
          <LinearGradient
            colors={["#baffd8", "#96dded"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
          >
            <View className="w-[88px] h-[88px] rounded-full bg-noirBg items-center justify-center">
              <Feather name="check" size={42} color="#baffd8" />
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View className="w-full pt-4">
        <Button onPress={onFinish} primary={true}>
          Go to Dashboard
        </Button>
      </View>
    </View>
  );
}
