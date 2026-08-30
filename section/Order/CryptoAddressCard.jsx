import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useUser } from "../../hooks/useUser";
import { copyToClipboard } from "../../utils/helper";

export const CryptoAddressCard = () => {
  const [copied, setCopied] = useState(false);
  const { user } = useUser();

  const handleCopy = async () => {
    const success = await copyToClipboard(user?.walletAddress);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View>
      <View className="pl-1 gap-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Recipient Crypto Address
        </Text>
        <Text className="text-gray-500 font-noir text-xs leading-normal">
          We will release USDT to this wallet once your payment is confirmed.
        </Text>
      </View>

      <View className="flex-row items-center justify-between bg-black/35 rounded-full p-1 pl-6 border border-white/5 gap-8">
        <Text
          className="text-white font-noir text-sm tracking-wide flex-1"
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {user?.walletAddress}
        </Text>
        <Pressable
          onPress={handleCopy}
          className="bg-white/5 h-16 aspect-square rounded-full active:opacity-75 flex-row items-center justify-center"
        >
          <Feather
            name={copied ? "check" : "copy"}
            size={20}
            color={copied ? "#baffd8" : "rgba(255, 255, 255, 0.6)"}
          />
        </Pressable>
      </View>
    </View>
  );
};
