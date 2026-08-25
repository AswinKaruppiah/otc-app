import { useState, useEffect } from "react";
import { View, Animated, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot, usePathname } from "expo-router";
import ScreenBackground from "../../components/ScreenBackground";
import TopBar from "../../components/TopBar";
import { ScrollProvider, useScrollY, useScrollViewRef } from "../../context/ScrollContext";
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

// Routes where the Top Bar or Bottom Tab Bar should be hidden
const HIDE_TOP_BAR_ROUTES = [];
const HIDE_BOTTOM_BAR_ROUTES = ["/onboarding", "/order"];

function UserLayoutContent() {
  const insets = useSafeAreaInsets();
  const { isAuth } = useUser();
  const pathname = usePathname();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const showTopBar = !HIDE_TOP_BAR_ROUTES.includes(pathname);
  const showTabBar = isAuth && !HIDE_BOTTOM_BAR_ROUTES.includes(pathname);

  // TopBar height is 60. Add 20px spacing so content starts below TopBar.
  const paddingTop = (showTopBar ? 60 : 0) + insets.top + 20;
  const paddingBottom = (showTabBar ? 84 : 20) + insets.bottom + keyboardHeight;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      {showTopBar && <TopBar />}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      {showTabBar && <BottomTabBar />}
    </KeyboardAvoidingView>
  );
}
