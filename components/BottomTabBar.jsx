import React, { useState, useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import HapticTouchableOpacity from "./HapticTouchableOpacity";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

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

  const [containerWidth, setContainerWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeIndex,
      useNativeDriver: true,
      tension: 68,
      friction: 9.5,
    }).start();
  }, [activeIndex]);

  const singleTabWidth = containerWidth / tabs.length;
  const translateX = slideAnim.interpolate({
    inputRange: [0, tabs.length - 1],
    outputRange: [0, singleTabWidth * (tabs.length - 1)],
  });

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

      <View
        className="flex-1 flex-row items-center justify-between"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        {/* Sliding Active Highlight */}
        {containerWidth > 0 && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: singleTabWidth,
              transform: [{ translateX }],
            }}
            pointerEvents="none"
          >
            <View className="absolute top-0 left-[32%] right-[32%] h-[3px] bg-[#0a57ff] rounded-full" />
          </Animated.View>
        )}

        {tabs.map((tab, index) => (
          <TabButton
            key={tab.route}
            tab={tab}
            isActive={activeIndex === index}
            onPress={() => router.replace(tab.route)}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * TabButton — Renders each individual navigation icon with a bouncing spring
 * scale animation when it becomes active.
 */
function TabButton({ tab, isActive, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isActive ? 1.2 : 1.0,
        useNativeDriver: true,
        tension: 100,
        friction: 6,
      }),
      Animated.timing(glowOpacity, {
        toValue: isActive ? 1.0 : 0.0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const radialId = `activeTabRadial-${tab.name}`;

  return (
    <HapticTouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      hapticType="selection"
      className="flex-1 h-full justify-center items-center w-full"
    >
      {/* Static Radial Glow: fades smoothly on the active tab */}
      <Animated.View
        style={{
          position: "absolute",
          opacity: glowOpacity,
        }}
        pointerEvents="none"
      >
        <Svg height={104} width={104}>
          <Defs>
            <RadialGradient id={radialId} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#0a57ff" stopOpacity="0.28" />
              <Stop offset="50%" stopColor="#0a57ff" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#0a57ff" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width={104} height={104} fill={`url(#${radialId})`} />
        </Svg>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <Feather
          name={tab.icon}
          size={24}
          color={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.45)"}
        />
      </Animated.View>
    </HapticTouchableOpacity>
  );
}
