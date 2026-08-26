import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

/**
 * AccountsSegmentTabs — Capsule tab bar with active LinearGradient highlight for switching sub-views.
 */
export default function AccountsSegmentTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "banks", label: "Bank Accounts", icon: "credit-card" },
    { id: "wallets", label: "Crypto Wallets", icon: "shield" },
  ];

  return (
    <View className="w-full bg-white/5 p-1.5 rounded-full flex-row mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.8}
            className="flex-1 overflow-hidden rounded-full"
          >
            {isActive ? (
              <LinearGradient
                colors={["#10b981", "#0A5A37", "#012617"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full py-4 px-4 rounded-full flex-row items-center justify-center gap-2 shadow-lg"
              >
                <Feather name={tab.icon} size={15} color="#ffffff" />
                <Text className="font-noir text-[14px] font-medium text-white">
                  {tab.label}
                </Text>
              </LinearGradient>
            ) : (
              <View className="w-full py-4 px-4 rounded-full flex-row items-center justify-center gap-2 bg-transparent">
                <Feather name={tab.icon} size={15} color="#9ca3af" />
                <Text className="font-noir text-[14px] font-medium text-gray-400">
                  {tab.label}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
