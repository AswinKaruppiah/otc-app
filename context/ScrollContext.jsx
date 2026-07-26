import { createContext, useContext, useRef } from "react";
import { Animated } from "react-native";

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

