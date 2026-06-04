import { View, Text, ActivityIndicator } from "react-native";
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import Ionicons from "@expo/vector-icons/Ionicons";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { useUser } from "../../hooks/useUser";
import * as SecureStore from "../../utils/secureStore";
import { SYNC_GOOGLE_USER } from "../../apollo/mutation";
import { useToast } from "heroui-native";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  profileImageSize: 120,
});

export default function GoogleAuth({ isLoggingIn, setIsLoggingIn }) {
  const client = useApolloClient();
  const [syncGoogleUser, { loading }] = useMutation(SYNC_GOOGLE_USER);
  const { isAuth, loading: userLoading } = useUser();
  const { toast } = useToast();

  const handleSignIn = async () => {
    setIsLoggingIn(true);
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
          const expirationTime = Date.now() + 24 * 60 * 60 * 1000;
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
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoggingIn || (!userLoading && !isAuth)) {
    return (
      <View className="gap-3">
        <View className="flex-row items-center gap-3">
          <View className="flex-1 h-px bg-white/10" />
          <Text className="text-white/30 font-noir text-xs tracking-widest uppercase">
            Sign in or Login
          </Text>
          <View className="flex-1 h-px bg-white/10" />
        </View>

        <HapticTouchableOpacity
          onPress={handleSignIn}
          disabled={isLoggingIn || loading}
          hapticType="medium"
          activeOpacity={0.85}
          className="w-full flex-row items-center justify-center gap-3 py-5 rounded-2xl border border-white/[0.08] bg-white/[0.04]"
        >
          {isLoggingIn || loading ? (
            <ActivityIndicator size="small" color="rgba(255,255,255,0.6)" />
          ) : (
            <>
              <View className="w-5 h-5 items-center justify-center">
                <Ionicons name="logo-google" size={18} color="#ffffff" />
              </View>
              <Text className="text-white/80 font-noir-medium text-sm tracking-wide">
                Continue with Google
              </Text>
            </>
          )}
        </HapticTouchableOpacity>
      </View>
    );
  }
}
