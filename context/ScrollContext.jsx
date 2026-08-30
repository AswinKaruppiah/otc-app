import { createContext, useContext, useRef, useState, useEffect } from "react";
import { Animated, Platform, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import { useUser } from "../hooks/useUser";

export const HIDE_TOP_BAR_ROUTES = [];
export const HIDE_BOTTOM_BAR_ROUTES = ["/onboarding", "/order", "/accounts/add-bank", "/accounts/add-wallet"];

const ScrollContext = createContext(null);

/**
 * Provides a shared Animated.Value that tracks how far the user has scrolled,
 * as well as a ref to the shared ScrollView so components can programmatically scroll.
 */
export function ScrollProvider({ children }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  return (
    <ScrollContext.Provider value={{ scrollY, scrollViewRef }}>
      {children}
    </ScrollContext.Provider>
  );
}

/** Returns the shared Animated.Value for vertical scroll position. */
export function useScrollY() {
  const ctx = useContext(ScrollContext);
  return ctx?.scrollY ?? ctx;
}

/** Returns the shared ScrollView ref. */
export function useScrollViewRef() {
  const ctx = useContext(ScrollContext);
  return ctx?.scrollViewRef;
}

/** Helper hook for screens to get standard content padding under TopBar and BottomTabBar, with keyboard support */
export function useScreenPadding() {
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

  const paddingTop = (showTopBar ? 60 : 0) + insets.top + 20;
  const paddingBottom = (showTabBar ? 84 : 20) + insets.bottom + keyboardHeight;

  return { paddingTop, paddingBottom, paddingHorizontal: 20, showTopBar, showTabBar, keyboardHeight };
}

