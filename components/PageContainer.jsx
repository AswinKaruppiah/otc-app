import { Animated, Platform } from "react-native";
import { useScreenPadding, useScrollY, useScrollViewRef } from "../context/ScrollContext";

/**
 * PageContainer — Reusable scroll wrapper for static user pages.
 * Handles TopBar & BottomTabBar safe padding, keyboard height adjustments,
 * auto-focus scrolling refs, and connects vertical scroll position to ScrollContext.
 */
export default function PageContainer({
  children,
  className = "w-full",
  contentContainerStyle,
  keyboardShouldPersistTaps = "handled",
  keyboardDismissMode = "interactive",
  ...props
}) {
  const { paddingTop, paddingBottom } = useScreenPadding();
  const scrollY = useScrollY();
  const scrollViewRef = useScrollViewRef();

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      keyboardDismissMode={keyboardDismissMode}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop,
        paddingBottom,
        paddingHorizontal: 20,
        gap: 20,
        ...contentContainerStyle,
      }}
      className={className}
      {...props}
    >
      {children}
    </Animated.ScrollView>
  );
}
