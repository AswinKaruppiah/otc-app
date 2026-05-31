import React, { useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import Ionicons from "@expo/vector-icons/Ionicons";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { useUser } from "../../hooks/useUser";
import * as SecureStore from "../../utils/secureStore";
import { SYNC_GOOGLE_USER } from "../../apollo/mutation";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  profileImageSize: 120,
});

export default function GoogleAuth() {
  const client = useApolloClient();
  const [syncGoogleUser, { loading }] = useMutation(SYNC_GOOGLE_USER);
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { id, email, name, photo } = response.data.user;

        // Hit backend sync mutation
        const syncResponse = await syncGoogleUser({
          variables: {
            googleId: id,
            email: email,
            name: name,
            image: photo || null,
          },
        });

        const token = syncResponse.data?.syncGoogleUser?.accessToken;
        if (token) {
          await SecureStore.setItemAsync("accessToken", token);
          // Store token expiration (10 seconds for testing)
          const expirationTime = Date.now() + 30 * 60 * 1000;
          await SecureStore.setItemAsync(
            "accessTokenExpiration",
            expirationTime.toString(),
          );
          // Reset cache to reload query components with authenticated auth headers
          await client.resetStore();
        }

        toast.show({
          label: "Success",
          description: `Welcome back, ${name}!`,
          variant: "success",
        });
      } else {
        // Sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // Operation cancelled
            break;
          case statusCodes.IN_PROGRESS:
            toast.show({
              label: "In Progress",
              description: "Sign in is already in progress.",
              variant: "warning",
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            toast.show({
              label: "Error",
              description:
                "Google Play Services are not available or outdated.",
              variant: "danger",
            });
            break;
          default:
            toast.show({
              label: "Error",
              description: `Google Sign-in failed: ${error.message || error.code}`,
              variant: "danger",
            });
        }
      } else {
        toast.show({
          label: "Error",
          description: `An unexpected error occurred: ${error?.message || error}`,
          variant: "danger",
        });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("accessTokenExpiration");
      await client.resetStore();
      await client.clearStore();
      toast.show({
        label: "Signed Out",
        description: "You have successfully signed out.",
        variant: "success",
      });
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
      toast.show({
        label: "Error",
        description: `Failed to sign out: ${error.message}`,
        variant: "danger",
      });
    }
  };

  if (userLoading && !user) {
    return (
      <View className="w-full bg-noirCard border border-white/[0.04] rounded-3xl p-6 mt-6 items-center justify-center min-h-[140px]">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (user) {
    const isVerified =
      user.kycStatus === "COMPLETED" || user.kycStatus === "VERIFIED";

    return (
      <View className="w-full bg-noirCard border border-white/[0.08] rounded-3xl p-6">
        <View className="flex-row items-center gap-4 mb-5">
          <View className="relative">
            {user.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                className="w-14 h-14 rounded-full border-2 border-noirMint"
              />
            ) : (
              <View className="w-14 h-14 rounded-full bg-noirMint/10 border-2 border-noirMint/25 items-center justify-center">
                <Text className="text-noirMint font-noir-medium text-lg">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
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
              {user.fullName}
            </Text>
            <Text
              className="text-gray-400 font-noir text-xs mt-0.5"
              numberOfLines={1}
            >
              {user.email}
            </Text>
          </View>

          <View
            className={`border px-2.5 py-1 rounded-full ${
              isVerified
                ? "bg-noirMint/10 border-noirMint/20"
                : "bg-amber-500/10 border-amber-500/20"
            }`}
          >
            <Text
              className={`font-noir text-[11px] font-semibold ${
                isVerified ? "text-noirMint" : "text-amber-500"
              }`}
            >
              {isVerified ? "Verified" : "Unverified"}
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
