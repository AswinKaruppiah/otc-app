import { View, Animated, Image } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollY } from "../context/ScrollContext";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * TopBar — Sticky header with a premium blurred background using the
 * theme's navy blue palette to blend with the ScreenBackground glows.
 *
 * Built using NativeWind classes and scroll-driven scaling/translation animations.
 */
export default function TopBar({ title = "CURRENSEA", right }) {
  const scrollY = useScrollY();
  const insets = useSafeAreaInsets();

  // 1. Interpolate scrollY to drive the blur and gradient overlay (0 at top, 1 at 80px scroll)
  const scrimOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    : 1;

  // 2. Title Scale: shrinks from 1 to 0.88 as user scrolls
  const titleScale = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0.88],
        extrapolate: "clamp",
      })
    : 1;

  // 3. Title Translation: slides slightly left and up to align with compact mode
  const titleTranslateX = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, -10],
        extrapolate: "clamp",
      })
    : 0;

  const titleTranslateY = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, -2],
        extrapolate: "clamp",
      })
    : 0;

  // 4. Right Content Scale and Translation: matches the title's shift
  const rightScale = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0.92],
        extrapolate: "clamp",
      })
    : 1;

  const rightTranslateY = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, -2],
        extrapolate: "clamp",
      })
    : 0;

  const headerHeight = 60 + insets.top;

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 z-10 rounded-b-3xl overflow-hidden"
      style={{ height: headerHeight, paddingTop: insets.top }}
    >
      {/* Frosted Glass Blur Background */}
      <AnimatedBlurView
        intensity={40}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        className="absolute inset-0"
        style={{ opacity: scrimOpacity }}
      />

      {/* Top-to-bottom theme-matched navy gradient overlay */}
      <Animated.View
        className="absolute inset-0"
        pointerEvents="none"
        style={{ opacity: scrimOpacity }}
      >
        <LinearGradient
          colors={[
            "rgba(11, 16, 24, 1)", // semi-transparent black at the top
            "rgba(11, 29, 64, 0.1)", // completely transparent at the bottom
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute inset-0"
        />
      </Animated.View>

      {/* Row content positioned below the safe area / status bar */}
      <View className="flex-1 flex-row items-center justify-between px-5">
        <Animated.Image
          source={require("../assets/logo/currensea-logo.png")}
          style={{
            width: 44,
            height: 44,
            resizeMode: "contain",
            transform: [
              { scale: titleScale },
              { translateX: titleTranslateX },
              { translateY: titleTranslateY },
            ],
          }}
        />

        {right ? (
          <Animated.View
            className="flex-row items-center"
            style={{
              transform: [
                { scale: rightScale },
                { translateY: rightTranslateY },
              ],
            }}
          >
            {right}
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}
