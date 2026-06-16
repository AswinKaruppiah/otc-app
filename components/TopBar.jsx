import { useState } from "react";
import { View, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollY } from "../context/ScrollContext";
import { useUser } from "../hooks/useUser";
import { useToast } from "heroui-native";
import LogoutDialog from "./dialog/LogoutDialog";
import { useApolloClient } from "@apollo/client/react";
import Show from "./Show";
import { isUnauthenticatedError, clearAuthSession } from "../utils/helper";
import { useRouter } from "expo-router";
import ProfileSheet from "./ProfileSheet";


/**
 * TopBar — Sticky header with a premium blurred background using the
 * theme's navy blue palette to blend with the ScreenBackground glows.
 *
 * Built using NativeWind classes and scroll-driven scaling/translation animations.
 */
export default function TopBar() {
  const scrollY = useScrollY();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, loading, isAuth } = useUser();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const apolloClient = useApolloClient();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await clearAuthSession(apolloClient, async () => {
        setLogoutDialogOpen(false);
        router.replace("/");
      });
      toast.show({
        label: "Signed Out",
        description: "You have successfully signed out.",
        variant: "success",
      });
    } catch (error) {
      if (isUnauthenticatedError(error)) {
        toast.show({
          label: "Signed Out",
          description: "You have successfully signed out.",
          variant: "success",
        });
        router.replace("/");
      } else {
        toast.show({
          label: "Error",
          description: `Failed to sign out: ${error.message}`,
          variant: "danger",
        });
      }
    }
  };

  // 2. Title Scale: shrinks from 1 to 0.88 as user scrolls
  const titleScale = scrollY
    ? scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0.88],
      extrapolate: "clamp",
    })
    : 1;

  // 3. Title Translation: slides slightly left and up to align with compact mode
  const titleTranslateX = scrollY
    ? scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -10],
      extrapolate: "clamp",
    })
    : 0;

  const titleTranslateY = scrollY
    ? scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -2],
      extrapolate: "clamp",
    })
    : 0;

  // 4. Right Content Scale and Translation: matches the title's shift
  const rightScale = scrollY
    ? scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [1, 0.92],
      extrapolate: "clamp",
    })
    : 1;

  const rightTranslateY = scrollY
    ? scrollY.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -2],
      extrapolate: "clamp",
    })
    : 0;

  const headerHeight = 60 + insets.top;

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 z-10 rounded-b-3xl overflow-hidden"
      style={{ height: headerHeight, paddingTop: insets.top }}
    >
      {/* Frosted Glass Blur Background */}
      <BlurView
        intensity={40}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        className="absolute inset-0"
      />

      {/* Top-to-bottom theme-matched navy gradient overlay */}
      <View
        className="absolute inset-0"
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            "rgba(17, 20, 24, 1)", // semi-transparent obsidian black at the top
            "rgba(17, 20, 24, 0)", // completely transparent at the bottom
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="absolute inset-0"
        />
      </View>

      {/* Row content positioned below the safe area / status bar */}
      <View className="flex-1 flex-row items-center justify-between px-5">
        <Animated.Image
          source={require("../assets/logo/quotex-logo.png")}
          style={{
            width: 44,
            height: 44,
            resizeMode: "contain",
            transform: [
              { scale: titleScale },
              { translateX: titleTranslateX },
              { translateY: titleTranslateY },
            ],
          }}
        />

        <Show>
          <Show.If isTrue={isAuth}>
            <ProfileSheet
              isOpen={profileSheetOpen}
              onOpenChange={setProfileSheetOpen}
              user={user}
              loading={loading}
              rightScale={rightScale}
              rightTranslateY={rightTranslateY}
              onLogoutPress={() => setLogoutDialogOpen(true)}
            />
          </Show.If>
        </Show>
      </View>

      <LogoutDialog
        isOpen={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleSignOut}
      />
    </Animated.View>
  );
}
