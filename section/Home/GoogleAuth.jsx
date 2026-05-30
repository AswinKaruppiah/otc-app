import React, { useState, useEffect } from "react";
import { View, Text, Image, Alert, ActivityIndicator } from "react-native";
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import Ionicons from "@expo/vector-icons/Ionicons";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  profileImageSize: 120,
});

export default function GoogleAuth() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already signed in on mount
    const checkUser = async () => {
      try {
        const response = await GoogleSignin.signInSilently();
        if (isSuccessResponse(response)) {
          setUserInfo(response.data);
        }
      } catch (error) {
        // Silence errors on automatic sign-in checks
        console.log("Silent sign-in check failed:", error);
      }
    };
    checkUser();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUserInfo(response.data);
        Alert.alert("Success", `Welcome back, ${response.data.user.name}!`);
      } else {
        // Sign in was cancelled by user
        console.log("Google Sign-In cancelled by user");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // Operation cancelled
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert("In Progress", "Sign in is already in progress.");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert(
              "Error",
              "Google Play Services are not available or outdated.",
            );
            break;
          default:
            Alert.alert(
              "Error",
              `Google Sign-in failed: ${error.message || error.code}`,
            );
        }
      } else {
        Alert.alert(
          "Error",
          `An unexpected error occurred: ${error?.message || error}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      Alert.alert("Signed Out", "You have successfully signed out.");
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
      Alert.alert("Error", `Failed to sign out: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (userInfo) {
    return (
      <View className="w-full bg-noirCard border border-white/[0.08] rounded-3xl p-6 mt-6">
        <View className="flex-row items-center gap-4 mb-5">
          <View className="relative">
            {userInfo.user.photo ? (
              <Image
                source={{ uri: userInfo.user.photo }}
                className="w-14 h-14 rounded-full border-2 border-noirMint"
              />
            ) : (
              <View className="w-14 h-14 rounded-full bg-noirMint/10 border-2 border-noirMint/25 items-center justify-center">
                <Text className="text-noirMint font-noir-medium text-lg">
                  {userInfo.user.name
                    ? userInfo.user.name.charAt(0).toUpperCase()
                    : "U"}
                </Text>
              </View>
            )}
            <View className="absolute -bottom-1 -right-1 bg-noirMint rounded-full p-0.5 border border-noirCard">
              <Ionicons name="checkmark-circle" size={14} color="#111418" />
            </View>
          </View>

          <View className="flex-1">
            <Text
              className="text-noirText font-noir-medium text-lg"
              numberOfLines={1}
            >
              {userInfo.user.name}
            </Text>
            <Text
              className="text-gray-400 font-noir text-xs mt-0.5"
              numberOfLines={1}
            >
              {userInfo.user.email}
            </Text>
          </View>

          <View className="bg-noirMint/10 border border-noirMint/20 px-2.5 py-1 rounded-full">
            <Text className="text-noirMint font-noir text-[11px] font-semibold">
              Verified
            </Text>
          </View>
        </View>

        <HapticTouchableOpacity
          onPress={handleSignOut}
          disabled={loading}
          hapticType="light"
          className="w-full bg-white/5 border border-white/[0.04] py-3.5 rounded-full items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ff7b7b" />
          ) : (
            <Text className="text-red-400 font-noir text-sm">
              Sign Out from Google
            </Text>
          )}
        </HapticTouchableOpacity>
      </View>
    );
  }

  return (
    <View className="w-full bg-noirCard border border-white/[0.04] rounded-3xl p-6 mt-6">
      <Text className="text-gray-400 font-noir text-[14px] mb-4 text-center">
        Access all premium features instantly
      </Text>
      <HapticTouchableOpacity
        onPress={handleSignIn}
        disabled={loading}
        hapticType="medium"
        className={`w-full bg-white flex-row items-center justify-center py-4 rounded-full gap-3 ${
          loading ? "opacity-60" : ""
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#111418" />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#111418" />
            <Text className="text-noirBg font-noir-medium text-base">
              Continue with Google
            </Text>
          </>
        )}
      </HapticTouchableOpacity>
    </View>
  );
}
