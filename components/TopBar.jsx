import { View, Text, StyleSheet } from "react-native";
import { Animated } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollY } from "../context/ScrollContext";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedText = Animated.createAnimatedComponent(Text);

/**
 * TopBar — Sticky header with a premium blurred background using the
 * theme's navy blue palette to blend with the ScreenBackground glows.
 *
 * Includes smooth scroll-driven scaling and translation animations on the title
 * and actions for a premium "docking" header feel.
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
      style={[
        styles.container,
        { height: headerHeight, paddingTop: insets.top },
      ]}
    >
      {/* Frosted Glass Blur Background */}
      <AnimatedBlurView
        intensity={80}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={[StyleSheet.absoluteFillObject, { opacity: scrimOpacity }]}
      />

      {/* Top-to-bottom theme-matched navy gradient overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity: scrimOpacity,
          },
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            "rgba(11, 16, 24, 1)", // semi-transparent black at the top
            "rgba(11, 29, 64, 0.7)", // completely transparent at the bottom
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Row content positioned below the safe area / status bar */}
      <View style={styles.content}>
        <AnimatedText
          style={[
            styles.title,
            {
              transform: [
                { scale: titleScale },
                { translateX: titleTranslateX },
                { translateY: titleTranslateY },
              ],
            },
          ]}
        >
          {title}
        </AnimatedText>

        {right ? (
          <Animated.View
            style={[
              styles.right,
              {
                transform: [
                  { scale: rightScale },
                  { translateY: rightTranslateY },
                ],
              },
            ]}
          >
            {right}
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
});
