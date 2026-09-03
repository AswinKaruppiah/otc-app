import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PageContainer from "../../components/PageContainer";
import Show from "../../components/Show";
import { haptic } from "../../utils/haptics";
import { useUser } from "../../hooks/useUser";
import { copyToClipboard } from "../../utils/helper";
import { useToast } from "heroui-native";

const PORTAL_KYC_URL = "https://app.bloqex.com/settings/verification";

const GUIDE_STEPS = [
  {
    step: "01",
    title: "Sign in with the Same Account",
    badge: "app.bloqex.com",
    badgeColor: "#96dded",
    icon: "log-in",
    desc: "Open your browser and navigate to https://app.bloqex.com/. Log in using the exact same Google account or credentials you are using in this app.",
    tip: "Make sure you use the same email address so your verification status syncs seamlessly.",
  },
  {
    step: "02",
    title: "Navigate to KYC Verification",
    badge: "Settings Menu",
    badgeColor: "#baffd8",
    icon: "sliders",
    desc: "Click on your profile avatar in the sidebar or top bar, then navigate to Settings → Identity Verification (Personal Details).",
    tip: "Direct link: app.bloqex.com/settings/verification",
  },
  {
    step: "03",
    title: "Complete 3-Step Verification",
    badge: "DigiLocker • PAN • Selfie",
    badgeColor: "#fbbf24",
    icon: "shield-check",
    desc: "Follow the on-screen guided prompts:\n• Step A: Aadhaar e-KYC via DigiLocker OTP\n• Step B: PAN Card validation against NSDL\n• Step C: AI Live Selfie Face Match",
    tip: "Keep your Aadhaar-linked mobile phone ready to receive the government OTP.",
  },
  {
    step: "04",
    title: "Automatic Instant App Sync",
    badge: "Verified Badge Unlocked",
    badgeColor: "#baffd8",
    icon: "check-decagram",
    desc: "Once submitted, your verification is approved instantly. Re-open this app and pull down to refresh — your profile will immediately show the Verified checkmark badge with full trading limits unlocked.",
    tip: "No document re-upload is needed in the mobile app.",
  },
];

export default function KycGuideSection() {
  const { user } = useUser();
  const { toast } = useToast();
  const [expandedStep, setExpandedStep] = useState(0);

  const kycStatus = (user?.kycStatus || "pending").toUpperCase();
  const isApproved = kycStatus === "APPROVED" || kycStatus === "VERIFIED";

  const handleOpenPortal = () => {
    haptic.medium();
    Linking.openURL(PORTAL_KYC_URL).catch(() => {
      toast.show({
        label: "Open Portal",
        description: "Visit https://app.bloqex.com/ in your browser.",
        variant: "warning",
      });
    });
  };

  const handleCopyLink = () => {
    haptic.light();
    copyToClipboard(PORTAL_KYC_URL, toast, "Link Copied", "https://app.bloqex.com/ copied to clipboard.");
  };

  const toggleStep = (idx) => {
    haptic.selection();
    setExpandedStep((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <PageContainer>
      <View className="w-full pb-8">
        {/* Header Hero Banner */}
        <View className="w-full rounded-3xl overflow-hidden bg-noirCard border border-white/10 p-6 mb-5 relative">
          <LinearGradient
            colors={["rgba(186, 255, 216, 0.08)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 pointer-events-none"
          />

          <View className="flex-row items-center justify-between mb-4">
            <View className="w-12 h-12 rounded-2xl bg-noirMint/10 border border-noirMint/20 items-center justify-center">
              <MaterialCommunityIcons name="shield-check-outline" size={26} color="#baffd8" />
            </View>
            <View
              className={`px-3 py-1 rounded-full border ${
                isApproved
                  ? "bg-noirMint/15 border-noirMint/30"
                  : "bg-amber-400/15 border-amber-400/30"
              }`}
            >
              <Text
                className={`font-noir text-xs font-semibold ${
                  isApproved ? "text-noirMint" : "text-amber-400"
                }`}
              >
                {isApproved ? "Status: Verified" : "Status: Action Required"}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-noir-medium text-white tracking-tight mb-2">
            How to Complete KYC
          </Text>
          <Text className="text-sm font-noir text-white/70 leading-relaxed">
            Identity verification is processed on our web portal at{" "}
            <Text className="text-noirMint font-semibold">app.bloqex.com</Text>. Follow the simple guide below to verify your account.
          </Text>
        </View>

        {/* Portal Action Card */}
        <View className="w-full rounded-2xl bg-black/40 border border-noirMint/25 p-5 mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Feather name="globe" size={16} color="#baffd8" />
            <Text className="font-noir-medium text-white text-sm font-bold">
              Bloqex Web Portal
            </Text>
          </View>
          <Text className="font-noir text-xs text-white/60 mb-4 leading-relaxed">
            Logged in as: <Text className="text-white font-medium">{user?.email || "your account"}</Text>
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenPortal}
              className="flex-1 bg-noirMint py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-noirMint/20"
            >
              <Feather name="external-link" size={15} color="#111418" />
              <Text className="font-noir font-bold text-xs text-[#111418]">
                Open app.bloqex.com
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCopyLink}
              className="px-4 bg-white/10 border border-white/15 py-3.5 rounded-xl flex-row items-center justify-center active:bg-white/20"
            >
              <Feather name="copy" size={15} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Step-by-Step Instructions */}
        <View className="mb-6">
          <Text className="text-xs font-noir text-white/50 font-semibold tracking-wider uppercase mb-3 px-1">
            4-Step Web Portal Instructions
          </Text>

          <View className="gap-3">
            {GUIDE_STEPS.map((item, idx) => {
              const isExpanded = expandedStep === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => toggleStep(idx)}
                  className={`w-full rounded-2xl border transition-all ${
                    isExpanded
                      ? "bg-noirCard border-noirMint/30"
                      : "bg-noirCard/60 border-white/[0.08]"
                  } p-4`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1 mr-2">
                      <View className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                        <Text className="font-noir font-bold text-xs text-noirMint">
                          {item.step}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-noir-medium text-white text-sm font-semibold" numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text className="font-noir text-[11px] text-white/50" numberOfLines={1}>
                          {item.badge}
                        </Text>
                      </View>
                    </View>
                    <Feather
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#9ca3af"
                    />
                  </View>

                  <Show>
                    <Show.If isTrue={isExpanded}>
                      <View className="mt-3 pt-3 border-t border-white/10">
                        <Text className="text-xs font-noir text-white/70 leading-relaxed mb-3">
                          {item.desc}
                        </Text>
                        <View className="bg-black/30 rounded-xl p-3 border border-white/5 flex-row items-start gap-2">
                          <Feather name="info" size={13} color="#96dded" className="mt-0.5" />
                          <Text className="text-[11px] font-noir text-noirCyan/90 flex-1 leading-relaxed">
                            {item.tip}
                          </Text>
                        </View>
                      </View>
                    </Show.If>
                  </Show>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Security Notice */}
        <View className="w-full rounded-2xl bg-black/40 border border-white/10 p-5 flex-row items-center gap-4">
          <View className="w-11 h-11 rounded-2xl bg-noirMint/10 border border-noirMint/20 items-center justify-center">
            <Feather name="lock" size={20} color="#baffd8" />
          </View>
          <View className="flex-1">
            <Text className="font-noir-medium text-white text-xs font-semibold">
              Encrypted Government API Verification
            </Text>
            <Text className="font-noir text-[11px] text-white/50 leading-relaxed mt-0.5">
              DigiLocker and NSDL endpoints are verified directly by government servers. Your credentials remain safe and private.
            </Text>
          </View>
        </View>
      </View>
    </PageContainer>
  );
}
