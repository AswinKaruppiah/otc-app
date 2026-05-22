import { createContext, useContext, useRef } from "react";
import { Animated } from "react-native";

const ScrollContext = createContext(null);

/**
 * Provides a shared Animated.Value that tracks how far the user has scrolled.
 * Wrap the layout root with this provider, then consume `useScrollY` in any
 * component (TopBar, screens, etc.) that needs to react to scroll position.
 */
export function ScrollProvider({ children }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  return (
    <ScrollContext.Provider value={scrollY}>
      {children}
    </ScrollContext.Provider>
  );
}

/** Returns the shared Animated.Value for vertical scroll position. */
export function useScrollY() {
  return useContext(ScrollContext);
}
