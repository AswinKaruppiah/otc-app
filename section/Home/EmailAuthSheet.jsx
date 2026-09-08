import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { BottomSheet } from "heroui-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useEmailAuth } from "../../hooks/useEmailAuth";
import Button from "../../components/Button";
import Show from "../../components/Show";
import { validateEmail, formatTimer } from "../../utils/helper";
import { haptic } from "../../utils/haptics";

const RESEND_COOLDOWN = 30; // 30 seconds

/**
 * Inner form rendered directly inside BottomSheet.Content.
 */
function EmailAuthForm({
  isOpen,
  initialEmail = "",
  onClose,
  sendOtp,
  resendOtp,
  verifyOtp,
  sendLoading,
  resendLoading,
  verifyLoading,
}) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailError, setEmailError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [expiryTimer, setExpiryTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef([]);
  const emailInputRef = useRef(null);

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || "");
      setStep("email");
      setOtp(["", "", "", "", "", ""]);
      setEmailError(null);
      setOtpError(null);
      setResendTimer(RESEND_COOLDOWN);
      setExpiryTimer(300);
      setCanResend(false);
    }
  }, [isOpen, initialEmail]);

  // Resend Countdown Timer (30s)
  useEffect(() => {
    let interval = null;
    if (step === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // OTP Expiration Countdown (e.g. 300s)
  useEffect(() => {
    let interval = null;
    if (step === "otp" && expiryTimer > 0) {
      interval = setInterval(() => {
        setExpiryTimer((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, expiryTimer]);

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      haptic.warning();
      return;
    }
    setEmailError(null);
    haptic.medium();

    const res = await sendOtp(email.trim());
    if (res.success) {
      setStep("otp");
      const expiry = res.expiresInSeconds || 300;
      setExpiryTimer(expiry);
      setResendTimer(RESEND_COOLDOWN);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 300);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || resendLoading || verifyLoading) return;
    haptic.medium();
    const res = await resendOtp(email.trim());
    if (res.success) {
      const expiry = res.expiresInSeconds || 300;
      setExpiryTimer(expiry);
      setResendTimer(RESEND_COOLDOWN);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      otpInputsRef.current[0]?.focus();
    }
  };

  const handleOtpChange = (index, value) => {
    if (otpError) setOtpError(null);

    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Auto-fill or pasted multi-digit code
    if (cleanValue.length >= 6 || (cleanValue.length > 1 && !otp[index])) {
      const digits = cleanValue.slice(0, 6).split("");
      const newOtp = ["", "", "", "", "", ""];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length - 1, 5);
      otpInputsRef.current[nextFocus]?.focus();
      return;
    }

    // Single digit entry
    const singleDigit = cleanValue.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    // Auto focus next box
    if (singleDigit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index, e) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    Keyboard.dismiss();
    if (resendLoading || verifyLoading) return;

    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setOtpError("Please enter all 6 digits of the verification code");
      haptic.warning();
      return;
    }
    setOtpError(null);
    haptic.medium();

    const res = await verifyOtp(email.trim(), fullOtp);
    if (res.success) {
      onClose();
    }
  };

  const goToEmailStep = () => {
    haptic.light();
    setStep("email");
    setOtpError(null);
  };

  return (
    <Show>
      {/* STEP 1: EMAIL INPUT */}
      <Show.If isTrue={step === "email"}>
        <View
          className="w-full pt-2"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
        >
          {/* Header */}
          <View className="mb-6 items-center gap-1.5">
            <BottomSheet.Title className="text-center font-noir-medium text-white text-xl">
              Log in or Sign up
            </BottomSheet.Title>
            <BottomSheet.Description className="text-center font-noir text-xs text-gray-400 px-4">
              Enter your email address to receive a one-time verification code.
            </BottomSheet.Description>
          </View>

          {/* Form */}
          <View className="w-full gap-4">
            <View className="gap-1.5">
              <Text className="text-xs font-noir text-gray-300 ml-1">
                Email Address
              </Text>
              <View
                className={`w-full h-[54px] flex-row items-center bg-noirBg border rounded-3xl px-4 gap-3 ${emailError
                  ? "border-red-400/80"
                  : "border-white/10 focus:border-noirMint/50"
                  }`}
              >
                <Feather name="at-sign" size={18} color="rgba(255, 255, 255, 0.4)" />
                <BottomSheetTextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="name@example.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  importantForAutofill="no"
                  textContentType="none"
                  cursorColor="#baffd8"
                  selectionColor="rgba(186, 255, 216, 0.3)"
                  className="flex-1 text-white font-noir text-base p-0"
                  style={{ height: 44, paddingVertical: 0, includeFontPadding: false }}
                  returnKeyType="done"
                  onSubmitEditing={handleSendOtp}
                />
                <Show>
                  <Show.If isTrue={Boolean(email)}>
                    <Pressable onPress={() => setEmail("")} hitSlop={8} className="w-5 h-5 items-center justify-center">
                      <Feather name="x-circle" size={16} color="rgba(255, 255, 255, 0.3)" />
                    </Pressable>
                  </Show.If>
                </Show>
              </View>
              <Show>
                <Show.If isTrue={Boolean(emailError)}>
                  <Text className="text-xs font-noir text-red-400 ml-1 mt-0.5">
                    {emailError}
                  </Text>
                </Show.If>
              </Show>
            </View>

            {/* Submit Button */}
            <Button
              onPress={handleSendOtp}
              disabled={sendLoading}
              className="w-full mt-2"
            >
              Send Verification Code
            </Button>

            {/* Disclaimer */}
            <Text className="text-[11px] font-noir text-gray-400/70 text-center leading-relaxed px-2 mt-1">
              By continuing, you agree to Quotex Terms of Service and Privacy Policy.
            </Text>
          </View>
        </View>
      </Show.If>

      {/* STEP 2: OTP VERIFICATION */}
      <Show.Else>
        <View
          className="w-full pt-2"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}
        >
          {/* Header */}
          <View className="mb-5 items-center gap-1.5">
            <BottomSheet.Title className="text-center font-noir-medium text-white text-xl">
              Verify your email
            </BottomSheet.Title>

            {/* Email chip with edit button */}
            <View className="flex-row items-center bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full gap-2 mt-1 max-w-full">
              <Feather name="mail" size={13} color="#baffd8" />
              <Text
                numberOfLines={1}
                className="text-xs font-noir text-gray-200 max-w-[200px]"
              >
                {email}
              </Text>
              <Pressable
                onPress={goToEmailStep}
                disabled={verifyLoading || resendLoading}
                hitSlop={8}
                className="flex-row items-center gap-1 pl-1 border-l border-white/10"
              >
                <Feather name="edit-2" size={11} color="#baffd8" />
                <Text className="text-[11px] font-noir text-noirMint">
                  Change
                </Text>
              </Pressable>
            </View>

            <Text className="text-xs font-noir text-gray-400 text-center mt-2">
              Enter the 6-digit code sent to your inbox.
            </Text>

            <Show>
              <Show.If isTrue={expiryTimer > 0}>
                <Text className="text-xs font-noir text-gray-400 mt-0.5">
                  Code expires in{" "}
                  <Text className="text-noirMint font-noir-medium">
                    {formatTimer(expiryTimer)}
                  </Text>
                </Text>
              </Show.If>
              <Show.Else>
                <Text className="text-xs font-noir text-red-400 mt-0.5">
                  Code has expired. Please request a new code.
                </Text>
              </Show.Else>
            </Show>
          </View>

          {/* OTP 6-Box Grid */}
          <View className="w-full gap-5">
            <View className="w-full flex-row items-center justify-center gap-2 my-2">
              {otp.map((digit, idx) => (
                <BottomSheetTextInput
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(idx, val)}
                  onKeyPress={(e) => handleOtpKeyPress(idx, e)}
                  keyboardType="number-pad"
                  maxLength={idx === 0 ? 6 : 1}
                  textAlign="center"
                  textAlignVertical="center"
                  autoComplete="off"
                  importantForAutofill="no"
                  cursorColor="#baffd8"
                  selectionColor="rgba(186, 255, 216, 0.3)"
                  style={{
                    includeFontPadding: false,
                    paddingVertical: 0,
                    paddingHorizontal: 0,
                    textAlign: "center",
                    textAlignVertical: "center",
                  }}
                  className={`w-12 h-14 rounded-2xl bg-noirBg border p-0 text-center font-noir-medium text-2xl ${otpError
                    ? "border-red-400 bg-red-400/5 text-red-400"
                    : digit
                      ? "border-noirMint/60 text-noirMint"
                      : "border-white/15 text-white focus:border-noirMint"
                    }`}
                />
              ))}
            </View>

            <Show>
              <Show.If isTrue={Boolean(otpError)}>
                <Text className="text-xs font-noir text-red-400 text-center -mt-2">
                  {otpError}
                </Text>
              </Show.If>
            </Show>

            {/* Verify Button */}
            <Button
              onPress={handleVerifyOtp}
              disabled={verifyLoading || resendLoading}
              className="w-full"
            >
              Verify & Continue
            </Button>

            {/* Footer Controls: Back & Resend */}
            <View className="flex-row items-center justify-between px-2 mt-1">
              <Pressable
                onPress={goToEmailStep}
                disabled={verifyLoading || resendLoading}
                className="flex-row items-center gap-1.5 py-1"
              >
                <Feather name="arrow-left" size={14} color="rgba(255, 255, 255, 0.5)" />
                <Text className="text-xs font-noir text-gray-400">
                  Back to Email
                </Text>
              </Pressable>

              <Pressable
                onPress={handleResendOtp}
                disabled={!canResend || resendLoading || verifyLoading}
                className="flex-row items-center gap-1.5 py-1"
              >
                <Show>
                  <Show.If isTrue={resendLoading}>
                    <ActivityIndicator size="small" color="#baffd8" />
                  </Show.If>
                  <Show.Else>
                    <Feather
                      name="refresh-cw"
                      size={13}
                      color={canResend ? "#baffd8" : "rgba(255, 255, 255, 0.3)"}
                    />
                  </Show.Else>
                </Show>
                <Text
                  className={`text-xs font-noir ${canResend && !resendLoading
                    ? "text-noirMint font-noir-medium"
                    : "text-gray-500"
                    }`}
                >
                  <Show>
                    <Show.If isTrue={canResend}>Resend Code</Show.If>
                    <Show.Else>{`Resend in ${resendTimer}s`}</Show.Else>
                  </Show>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Show.Else>
    </Show>
  );
}

/**
 * EmailAuthSheet — A bottom sheet for Email + OTP authentication.
 */
export default function EmailAuthSheet({ isOpen, onOpenChange, initialEmail = "" }) {
  const {
    sendOtp,
    resendOtp,
    verifyOtp,
    sendLoading,
    resendLoading,
    verifyLoading,
  } = useEmailAuth();

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustPan"
        >
          <EmailAuthForm
            key={isOpen ? "open" : "closed"}
            isOpen={isOpen}
            initialEmail={initialEmail}
            onClose={() => onOpenChange(false)}
            sendOtp={sendOtp}
            resendOtp={resendOtp}
            verifyOtp={verifyOtp}
            sendLoading={sendLoading}
            resendLoading={resendLoading}
            verifyLoading={verifyLoading}
          />
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
