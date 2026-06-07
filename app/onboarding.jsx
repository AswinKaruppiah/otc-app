import { useEffect, useRef, useState } from "react";
import { View, BackHandler } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import ScreenBackground from "../components/ScreenBackground";
import OnboardingOverview from "../section/Onboarding";
import { useNavigation } from "expo-router";
import ExitOnboardingDialog from "../components/dialog/ExitOnboardingDialog";

export default function OnboardingRoute() {
  return (
    <SafeAreaProvider>
      <OnboardingContent />
    </SafeAreaProvider>
  );
}

function OnboardingContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const allowLeaveRef = useRef(false);
  const pendingActionRef = useRef(null);

  const handleConfirmExit = () => {
    setExitDialogOpen(false);
    allowLeaveRef.current = true;

    if (pendingActionRef.current) {
      const { type, action } = pendingActionRef.current;
      pendingActionRef.current = null;

      if (type === "navigation" && action) {
        navigation.dispatch(action);
      } else if (type === "back") {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          BackHandler.exitApp();
        }
      }
    }
  };

  useEffect(() => {
    const backAction = () => {
      // If onboarding is finished or explicitly allowed to leave, let it proceed
      if (allowLeaveRef.current || step === 5) {
        return false;
      }

      // If on steps 2-4, go to the previous onboarding step
      if (step > 1) {
        setStep((s) => s - 1);
        return true; // Intercepted and handled
      }

      // If on step 1, show confirmation dialog
      pendingActionRef.current = { type: "back" };
      setExitDialogOpen(true);
      return true; // Intercepted and handled
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, step]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (allowLeaveRef.current || step === 5) {
        return;
      }

      e.preventDefault();

      pendingActionRef.current = { type: "navigation", action: e.data.action };
      setExitDialogOpen(true);
    });

    return unsubscribe;
  }, [navigation, step]);

  return (
    <ScreenBackground>
      <StatusBar style="light" />
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <OnboardingOverview
          step={step}
          setStep={setStep}
          onAllowLeave={() => {
            allowLeaveRef.current = true;
          }}
        />
      </View>
      <ExitOnboardingDialog
        isOpen={exitDialogOpen}
        onOpenChange={setExitDialogOpen}
        onConfirm={handleConfirmExit}
      />
    </ScreenBackground>
  );
}
