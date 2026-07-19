import { View, Dimensions } from "react-native";
import HapticTouchableOpacity from "./HapticTouchableOpacity";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

/**
 * BottomTabBar — Premium floating capsule bottom navigation.
 * Features a frosted glass blur background and a sliding white circle
 * that dynamically highlights the active tab.
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

  const BAR_WIDTH = Dimensions.get("window").width - 80;
  const singleTabWidth = (BAR_WIDTH - 8) / tabs.length;
  const translateX = 4 + singleTabWidth * activeIndex;

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
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: singleTabWidth,
            transform: [{ translateX }],
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
        </View>

        {tabs.map((tab, index) => (
          <TabButton
            key={tab.route}
            tab={tab}
            isActive={activeIndex === index}
            onPress={() => router.push(tab.route)}
          />
        ))}
      </View>
    </View>
  );
}

/**
 * TabButton — Renders each individual navigation icon and transitions its icon color when active.
 */
function TabButton({ tab, isActive, onPress }) {
  return (
    <HapticTouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
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
}

