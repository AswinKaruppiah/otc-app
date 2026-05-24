import React from "react";
import { View, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * BottomTabBar — Minimal bottom navigation bar displaying only the icons,
 * with a static premium frosted glass blur and navy gradient background.
 */
export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      name: "Withdraw",
      route: "/withdraw",
      icon: "arrow-down-right",
    },
    {
      name: "Bank",
      route: "/bank",
      icon: "briefcase",
    },
    {
      name: "Home",
      route: "/",
      icon: "home",
    },
    {
      name: "Transactions",
      route: "/transactions",
      icon: "repeat",
    },
    {
      name: "Profile",
      route: "/profile",
      icon: "user",
    },
  ];

  // Resolve the active tab index by matching the parent segment of the pathname
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const parentRoute = firstSegment ? `/${firstSegment}` : "/";
  const matchedIndex = tabs.findIndex((tab) => tab.route === parentRoute);
  const activeIndex =
    matchedIndex !== -1
      ? matchedIndex
      : Math.max(
          0,
          tabs.findIndex((tab) => tab.route === "/"),
        );

  return (
    <View
      className="absolute left-0 right-0 bottom-0 z-[100] rounded-t-3xl overflow-hidden"
      style={{
        paddingBottom: insets.bottom,
        height: 64 + insets.bottom,
      }}
    >
      {/* Frosted Glass Blur Background */}
      <BlurView
        intensity={80}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        className="absolute inset-0"
      />

      {/* Top-to-bottom theme-matched navy gradient overlay */}
      <View className="absolute inset-0" pointerEvents="none">
        <LinearGradient
          colors={[
            "rgba(11, 16, 24, 1)", // semi-transparent black at the top
            "rgba(11, 29, 64, 0.1)", // completely transparent at the bottom
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute inset-0"
        />
      </View>

      <View className="flex-1 flex-row items-center justify-between gap-3">
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;

          return (
            <TouchableOpacity
              key={tab.route}
              activeOpacity={0.7}
              onPress={() => router.replace(tab.route)}
              className="flex-1 h-full justify-center items-center w-full"
            >
              <Feather
                name={tab.icon}
                size={24}
                color={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.45)"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
