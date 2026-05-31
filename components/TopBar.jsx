import React, { useState } from "react";
import { View, Animated, Image, Text, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScrollY } from "../context/ScrollContext";
import { useUser } from "../hooks/useUser";
import { useRouter } from "expo-router";
import { Avatar, Skeleton, BottomSheet, Button, useToast } from "heroui-native";
import { useApolloClient } from "@apollo/client/react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "../utils/secureStore";
import Show from "./Show";
import { getInitials } from "../utils/helper";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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
  const { user, loading } = useUser();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const apolloClient = useApolloClient();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("accessTokenExpiration");
      await apolloClient.resetStore();
      await apolloClient.clearStore();
      setProfileSheetOpen(false);
      toast.show({
        label: "Signed Out",
        description: "You have successfully signed out.",
        variant: "success",
      });
    } catch (error) {
      toast.show({
        label: "Error",
        description: `Failed to sign out: ${error.message}`,
        variant: "danger",
      });
    }
  };

  // 1. Interpolate scrollY to drive the blur and gradient overlay (0 at top, 1 at 80px scroll)
  const scrimOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 1],
        extrapolate: "clamp",
      })
    : 1;

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
      <AnimatedBlurView
        intensity={40}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        className="absolute inset-0"
        style={{ opacity: scrimOpacity }}
      />

      {/* Top-to-bottom theme-matched navy gradient overlay */}
      <Animated.View
        className="absolute inset-0"
        pointerEvents="none"
        style={{ opacity: scrimOpacity }}
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
      </Animated.View>

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
          <Show.If isTrue={user || loading}>
            <BottomSheet
              isOpen={profileSheetOpen}
              onOpenChange={setProfileSheetOpen}
            >
              <BottomSheet.Trigger asChild>
                <Animated.View
                  style={{
                    transform: [
                      { scale: rightScale },
                      { translateY: rightTranslateY },
                    ],
                  }}
                >
                  <Pressable
                    onPress={() => setProfileSheetOpen(true)}
                    className="active:opacity-75"
                  >
                    <Show>
                      <Show.If isTrue={loading}>
                        <Skeleton className="w-10 h-10 rounded-full" />
                      </Show.If>
                      <Show.ElseIf isTrue={user}>
                        <Avatar size="sm" className="ring ring-noirMint">
                          {user?.profileImage ? (
                            <Avatar.Image source={{ uri: user.profileImage }} />
                          ) : null}
                          <Avatar.Fallback>
                            <Text className="text-noirMint">
                              {getInitials(user?.fullName)}
                            </Text>
                          </Avatar.Fallback>
                        </Avatar>
                      </Show.ElseIf>
                    </Show>
                  </Pressable>
                </Animated.View>
              </BottomSheet.Trigger>
              <BottomSheet.Portal>
                <BottomSheet.Overlay />
                <BottomSheet.Content>
                  <View className="items-center mb-5">
                    <Avatar className="ring h-24 w-24 ring-noirMint">
                      {user?.profileImage ? (
                        <Avatar.Image source={{ uri: user.profileImage }} />
                      ) : null}
                      <Avatar.Fallback>
                        <Text className="text-noirMint text-xl">
                          {getInitials(user?.fullName)}
                        </Text>
                      </Avatar.Fallback>
                    </Avatar>
                  </View>
                  <View className="mb-8 gap-2 items-center">
                    <BottomSheet.Title className="text-center font-noir-medium">
                      {user?.fullName ?? "My Account"}
                    </BottomSheet.Title>
                    <BottomSheet.Description className="text-center font-noir">
                      {user?.email ?? ""}
                    </BottomSheet.Description>
                  </View>
                  <View className="h-px bg-white/5 mb-8" />
                  <Button
                    variant="danger-soft"
                    onPress={handleSignOut}
                    className="h-14"
                  >
                    Log Out
                  </Button>
                </BottomSheet.Content>
              </BottomSheet.Portal>
            </BottomSheet>
          </Show.If>
        </Show>
      </View>
    </Animated.View>
  );
}
