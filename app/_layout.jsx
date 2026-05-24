import "../styles/global.css";
import { useEffect } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";

/**
 * Root layout — wraps the entire app.
 * Import global CSS here once so every route gets it.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Noir-Regular": require("../assets/NOIR_Font/Noir_regular.otf"),
    "Noir-Medium": require("../assets/NOIR_Font/Noir_medium.otf"),
  });

  useEffect(() => {
    if (error) {
      console.warn("Error loading Noir fonts:", error);
    }
  }, [error]);

  if (!loaded && !error) {
    return null;
  }

  return <Slot />;
}

