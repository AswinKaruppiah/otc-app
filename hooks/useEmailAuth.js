import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { REQUEST_EMAIL_OTP, RESEND_OTP, VERIFY_EMAIL_OTP } from "../apollo/mutation";
import * as SecureStore from "../utils/secureStore";
import { useToast } from "heroui-native";
import { useRouter } from "expo-router";

/**
 * Custom hook managing Email OTP authentication (request, resend, and verify).
 * Handles token storage in SecureStore, cache invalidation/refetch, and routing.
 */
export function useEmailAuth() {
  const client = useApolloClient();
  const { toast } = useToast();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const [requestOtpMutation, { loading: sendLoading }] = useMutation(REQUEST_EMAIL_OTP);
  const [resendOtpMutation, { loading: resendLoading }] = useMutation(RESEND_OTP);
  const [verifyOtpMutation, { loading: verifyMutationLoading }] = useMutation(VERIFY_EMAIL_OTP);

  /**
   * Request OTP code for a given email address.
   */
  const sendOtp = async (email) => {
    try {
      const response = await requestOtpMutation({
        variables: { email: email.trim().toLowerCase() },
      });

      const result = response.data?.requestEmailOtp;
      if (result) {
        toast.show({
          label: "OTP Sent",
          description: result.message || `Verification code sent to ${email}`,
          variant: "success",
        });
        return {
          success: true,
          expiresInSeconds: result.expiresInSeconds || 300,
        };
      }
      return { success: false };
    } catch (err) {
      toast.show({
        label: "Failed to Send OTP",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "danger",
      });
      return { success: false, error: err?.message };
    }
  };

  /**
   * Resend OTP code for a given email address.
   */
  const resendOtp = async (email) => {
    try {
      const response = await resendOtpMutation({
        variables: { email: email.trim().toLowerCase() },
      });

      const result = response.data?.resendOtp;
      if (result) {
        toast.show({
          label: "OTP Resent",
          description: result.message || `New code sent to ${email}`,
          variant: "success",
        });
        return {
          success: true,
          expiresInSeconds: result.expiresInSeconds || 300,
        };
      }
      return { success: false };
    } catch (err) {
      toast.show({
        label: "Failed to Resend OTP",
        description: err?.message || "Something went wrong. Please try again.",
        variant: "danger",
      });
      return { success: false, error: err?.message };
    }
  };

  /**
   * Verify the 6-digit OTP code, store token, and handle session initialization.
   */
  const verifyOtp = async (email, otp) => {
    setIsVerifying(true);
    try {
      const response = await verifyOtpMutation({
        variables: {
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        },
      });

      const result = response.data?.verifyEmailOtp;
      if (result?.accessToken) {
        const { accessToken, isNewUser, onboarding } = result;

        // Persist token in SecureStore
        await SecureStore.setItemAsync("accessToken", accessToken);
        const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        await SecureStore.setItemAsync(
          "accessTokenExpiration",
          expirationTime.toString()
        );

        // Refetch all active queries (including GET_USER) in Apollo cache
        await client.refetchQueries({
          include: "active",
        }).catch(() => { });

        if (isNewUser || !onboarding) {
          toast.show({
            label: "Welcome",
            description: "Welcome! Let's get your account set up.",
          });
          router.replace("/onboarding");
        } else {
          toast.show({
            label: "Welcome Back",
            description: "Successfully signed in.",
            variant: "success",
          });
        }

        return {
          success: true,
          accessToken,
          isNewUser,
          onboarding,
        };
      }
      return { success: false };
    } catch (err) {
      toast.show({
        label: "Verification Failed",
        description: err?.message || "Invalid verification code. Please try again.",
        variant: "danger",
      });
      return { success: false, error: err?.message };
    } finally {
      setIsVerifying(false);
    }
  };

  const activeVerifyLoading = verifyMutationLoading || isVerifying;

  return {
    sendOtp,
    resendOtp,
    verifyOtp,
    sendLoading,
    resendLoading,
    verifyLoading: activeVerifyLoading,
    loading: sendLoading || resendLoading || activeVerifyLoading,
  };
}
