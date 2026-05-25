import React, { useState } from "react";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

const { width } = Dimensions.get("window");

/**
 * Home/Index Screen — Main dashboard of the CurrenSea application.
 * Rebuilt using the premium Noir theme colors and typography:
 *   - Base Font: font-noir (Noir-Regular) / font-noir-medium (Noir-Medium)
 *   - Cards Color: bg-noirCard (#1d282d)
 *   - Accents: text-noirMint / bg-noirMint (#baffd8), text-noirCyan / bg-noirCyan (#96dded)
 */
export default function Index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Week");

  const quickActions = [
    {
      name: "Withdraw",
      route: "/withdraw",
      icon: "arrow-down-right",
      color: "#baffd8",
    },
    { name: "Bank", route: "/bank", icon: "briefcase", color: "#96dded" },
    {
      name: "Activity",
      route: "/transactions",
      icon: "repeat",
      color: "#ffffff",
    },
    { name: "Profile", route: "/profile", icon: "user", color: "#ffffff" },
  ];

  const chartData = [
    { day: "Tue", amount: 120, active: false },
    { day: "Wed", amount: 225, active: true },
    { day: "Thu", amount: 160, active: false },
    { day: "Fri", amount: 190, active: false },
    { day: "Sat", amount: 90, active: false },
    { day: "Sun", amount: 140, active: false },
  ];

  return (
    <View className="w-full pb-8">
      {/* 1. Header Balance Section */}
      <View className="mb-6">
        <Text className="text-[14px] text-gray-400 font-noir tracking-[0.5px]">
          Available Balance
        </Text>
        <View className="flex-row items-baseline mt-1">
          <Text className="text-[36px] font-noir-medium text-noirText tracking-[-1px]">
            $12,450
          </Text>
          <Text className="text-[22px] font-noir text-noirMint">.80</Text>
          <Text className="text-[14px] text-gray-400 font-noir ml-2">USD</Text>
        </View>
      </View>

      {/* 2. Premium Credit Card Component */}
      <View className="w-full mb-6">
        <View className="w-full h-[220px] bg-noirCard rounded-3xl p-6 border-[0.6px] border-noirMint relative overflow-hidden shadow-xl shadow-black/40">
          {/* Top Row: VISA & Chip / Logo */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-[20px] font-noir-medium text-noirText italic tracking-[1px]">
              VISA
            </Text>
            <Text className="text-[14px] font-noir-medium text-gray-400 tracking-[1.5px]">
              •••• 3422
            </Text>
          </View>

          {/* Middle Row: Star Accents and Contactless */}
          <View className="flex-row justify-between items-center flex-1">
            <View className="flex-row items-center gap-1.5 opacity-80">
              {/* Star shapes */}
              <Svg height={24} width={24} viewBox="0 0 24 24">
                <Path
                  d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z"
                  fill="#baffd8"
                />
              </Svg>
              <Svg height={16} width={16} viewBox="0 0 24 24" className="mt-4">
                <Path
                  d="M12,2 L14.5,9.5 L22,12 L14.5,14.5 L12,22 L9.5,14.5 L2,12 L9.5,9.5 Z"
                  fill="#96dded"
                />
              </Svg>
            </View>

            <Feather
              name="rss"
              size={18}
              color="rgba(255, 255, 255, 0.6)"
              className="transform rotate-[90deg]"
            />
          </View>

          {/* Bottom Row: Name & Expiry */}
          <View className="flex-row justify-between items-end mt-auto">
            <View>
              <Text className="text-[12px] text-gray-400 font-noir mb-0.5">
                Card Holder
              </Text>
              <Text className="text-[15px] font-noir-medium text-noirText">
                Alex Mercer
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-[12px] text-gray-400 font-noir mb-0.5">
                Expires
              </Text>
              <Text className="text-[15px] font-noir-medium text-noirText">
                12/28
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Quick Action Buttons */}
      <View className="flex-row justify-between items-center mb-8 gap-3">
        {quickActions.map((action, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => router.push(action.route)}
            className="flex-1 py-4 bg-noirCard border border-white/[0.04] rounded-2xl items-center justify-center gap-1.5"
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${action.color}15` }}
            >
              <Feather name={action.icon} size={16} color={action.color} />
            </View>
            <Text className="text-[12px] font-noir-medium text-gray-300">
              {action.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
