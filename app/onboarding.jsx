import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ScreenBackground from "../components/ScreenBackground";
import OnboardingOverview from "../section/Onboarding";

export default function OnboardingRoute() {
  return (
    <SafeAreaProvider>
      <OnboardingContent />
    </SafeAreaProvider>
  );
}

function OnboardingContent() {
  const insets = useSafeAreaInsets();
  return (
    <ScreenBackground>
      <StatusBar style="light" />
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <OnboardingOverview />
      </View>
    </ScreenBackground>
  );
}
