import "../styles/global.css";
import { useEffect } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import ApolloProviderWrapper from "../components/provider/ApolloProvider";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

/**
 * Root layout — wraps the entire app.
 * Import global CSS here once so every route gets it.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Noir-Regular": require("../assets/NOIR_Font/NoirPro-Regular.ttf"),
    "Noir-Medium": require("../assets/NOIR_Font/NoirPro-Medium.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.warn("Error loading Noir fonts:", error);
    }
  }, [error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={{ devInfo: { stylingPrinciples: false } }}>
        <ApolloProviderWrapper>
          <Slot />
        </ApolloProviderWrapper>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

