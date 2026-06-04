import { View, Animated } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot, usePathname } from "expo-router";
import ScreenBackground from "../../components/ScreenBackground";
import TopBar from "../../components/TopBar";
import { ScrollProvider, useScrollY } from "../../context/ScrollContext";
import BottomTabBar from "../../components/BottomTabBar";
import { useUser } from "../../hooks/useUser";

/**
 * Layout for all (user) screens.
 * Wraps screens in a shared scroll container so the TopBar fading transition
 * and notch spacing are handled globally.
 */
export default function UserLayout() {
  return (
    <SafeAreaProvider>
      <ScrollProvider>
        <ScreenBackground>
          <StatusBar style="light" />
          <UserLayoutContent />
        </ScreenBackground>
      </ScrollProvider>
    </SafeAreaProvider>
  );
}

function UserLayoutContent() {
  const scrollY = useScrollY();
  const insets = useSafeAreaInsets();
  const { isAuth } = useUser();
  const pathname = usePathname();

  // TopBar height is 60. Add 20px spacing so content starts below TopBar.
  const paddingTop = 60 + insets.top + 20;
  const showTabBar = isAuth && pathname !== "/onboarding";

  return (
    <View style={{ flex: 1 }}>
      <TopBar />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: (showTabBar ? 84 : 20) + insets.bottom,
          paddingTop,
          gap: 20,
        }}
      >
        <Slot />
      </Animated.ScrollView>
      {showTabBar && <BottomTabBar />}
    </View>
  );
}
