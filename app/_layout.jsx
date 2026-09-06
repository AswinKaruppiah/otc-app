import "../styles/global.css";
import { useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import ApolloProviderWrapper from "../components/provider/ApolloProvider";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Uniwind } from "uniwind";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Prevent native splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

// Configure Google Sign-In globally on app load
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  profileImageSize: 120,
});

// Force dark theme for both Uniwind (Tailwind) and HeroUI Native
Uniwind.setTheme("dark");

/**
 * Root layout — wraps the entire app.
 * Import global CSS here once so every route gets it.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Noir-Regular": require("../assets/NOIR_Font/NoirPro-Regular.ttf"),
    "Noir-Medium": require("../assets/NOIR_Font/NoirPro-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#111418" }}>
      <StatusBar style="light" />
      <HeroUINativeProvider
        config={{
          devInfo: { stylingPrinciples: false },
        }}
      >
        <ApolloProviderWrapper>
          <Slot />
        </ApolloProviderWrapper>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
