import { useMemo, useCallback, memo, useRef, useEffect } from "react";
import { View, Dimensions, Animated } from "react-native";
import HapticTouchableOpacity from "./HapticTouchableOpacity";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

const TABS = [
  {
    name: "Withdraw",
    route: "/withdraw",
    icon: "arrow-down-right",
  },
  {
    name: "Bank",
    route: "/bank",
    icon: "credit-card",
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
    icon: "hexagon",
  },
];

const BAR_WIDTH = Dimensions.get("window").width - 80;
const SINGLE_TAB_WIDTH = (BAR_WIDTH - 8) / TABS.length;

/**
 * BottomTabBar — Premium floating capsule bottom navigation.
 * Features a frosted glass blur background and a sliding white circle
 * that dynamically highlights the active tab.
 */
export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Resolve the active tab index by matching the parent segment of the pathname
  const activeIndex = useMemo(() => {
    const firstSegment = pathname.split("/").filter(Boolean)[0];
    const parentRoute = firstSegment ? `/${firstSegment}` : "/";
    const matchedIndex = TABS.findIndex((tab) => tab.route === parentRoute);
    return matchedIndex !== -1
      ? matchedIndex
      : Math.max(0, TABS.findIndex((tab) => tab.route === "/"));
  }, [pathname]);

  // High-performance native translation value
  const translateXAnim = useRef(
    new Animated.Value(4 + SINGLE_TAB_WIDTH * activeIndex)
  ).current;

  // Animate the highlight bar using spring physics on tab changes
  useEffect(() => {
    Animated.spring(translateXAnim, {
      toValue: 4 + SINGLE_TAB_WIDTH * activeIndex,
      useNativeDriver: true,
      damping: 20,
      mass: 0.4,
      stiffness: 250,
    }).start();
  }, [activeIndex]);

  const handlePress = useCallback((route) => {
    router.push(route);
  }, [router]);

  return (
    <View
      className="absolute z-[100] rounded-full overflow-hidden"
      style={{
        width: BAR_WIDTH,
        alignSelf: "center",
        bottom: Math.max(insets.bottom, 16),
        height: 74,
        backgroundColor: "rgba(15, 18, 22, 0.55)",
      }}
    >
      {/* Frosted Glass Blur Background */}
      <BlurView
        intensity={100}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        className="absolute inset-0"
      />

      <View
        className="flex-1 flex-row items-center justify-between"
        style={{ paddingHorizontal: 4 }}
      >
        {/* Sliding Active Highlight */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: SINGLE_TAB_WIDTH,
            transform: [{ translateX: translateXAnim }],
            justifyContent: "center",
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <LinearGradient
            colors={["#97D8A4", "#0A5A37", "#012617"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              shadowColor: "#0A5A37",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 14,
              elevation: 10,
            }}
          />
        </Animated.View>

        {TABS.map((tab, index) => (
          <TabButton
            key={tab.route}
            tab={tab}
            isActive={activeIndex === index}
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * TabButton — Renders each individual navigation icon and transitions its icon color when active.
 */
const TabButton = memo(function TabButton({ tab, isActive, onPress }) {
  return (
    <HapticTouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(tab.route)}
      hapticType="selection"
      className="flex-1 h-full justify-center items-center"
    >
      <Feather
        name={tab.icon}
        size={18}
        color={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.45)"}
      />
    </HapticTouchableOpacity>
  );
});

