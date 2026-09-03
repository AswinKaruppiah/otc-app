import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PageContainer from "../../components/PageContainer";
import Show from "../../components/Show";
import { haptic } from "../../utils/haptics";
import { copyToClipboard } from "../../utils/helper";
import { useToast } from "heroui-native";
import { useUser } from "../../hooks/useUser";

const PORTAL_SUPPORT_URL = "https://app.bloqex.com/support";

const SUPPORT_PORTAL_STEPS = [
  {
    step: "01",
    title: "Sign in with the Same Account",
    desc: "Visit https://app.bloqex.com/support in your browser and sign in using the same Google account you use in this app.",
    icon: "log-in",
    tip: "Logging in with the same account automatically attaches your active OTC orders and wallet IDs.",
  },
  {
    step: "02",
    title: "Submit Assistance Request",
    desc: "Click 'Create Request' on the support dashboard. Select your category (Settlement, KYC, UTR payment verification, or Bank Whitelist) and describe the issue.",
    icon: "file-plus",
    tip: "Attach your payment UTR slip or screenshot for fast under-5-minute clearance.",
  },
  {
    step: "03",
    title: "Live Compliance Advisor Chat",
    desc: "An OTC compliance specialist is assigned to your ticket in real time. Message back and forth securely within the ticket thread until resolution.",
    icon: "message-square",
    tip: "Average response time on active trade requests is under 5 minutes.",
  },
];

const FAQS = [
  {
    q: "How do I check my support ticket status?",
    a: "Visit app.bloqex.com/support and log in. All open and resolved tickets with full message history and advisor notes are available there in real-time.",
  },
  {
    q: "How long do TRC-20 settlements take?",
    a: "Once your bank payment is verified with UTR on the OTC desk, our TRON settlement nodes transfer the USDT to your whitelisted address in 2 to 5 minutes.",
  },
  {
    q: "What should I do if my payment UTR is not approved?",
    a: "Ensure the 12-digit IMPS/UPI reference number is entered correctly. Open app.bloqex.com/support or contact our Telegram desk with the bank receipt for instant manual clearance.",
  },
];

export default function SupportSection() {
  const { user } = useUser();
  const { toast } = useToast();
  const [expandedFaq, setExpandedFaq] = useState(0);

  const toggleFaq = (idx) => {
    haptic.selection();
    setExpandedFaq((prev) => (prev === idx ? -1 : idx));
  };

  const handleOpenSupportPortal = () => {
    haptic.medium();
    Linking.openURL(PORTAL_SUPPORT_URL).catch(() => {
      toast.show({
        label: "Open Portal",
        description: "Visit https://app.bloqex.com/support in your browser.",
        variant: "warning",
      });
    });
  };

  const handleCopyPortalLink = () => {
    haptic.light();
    copyToClipboard(PORTAL_SUPPORT_URL, toast, "Link Copied", "https://app.bloqex.com/support copied.");
  };

  const handleTelegramPress = () => {
    haptic.medium();
    Linking.openURL("https://t.me/quotex_support").catch(() => {
      toast.show({
        label: "Telegram Support",
        description: "Unable to open Telegram. Contact support@quotex.io",
        variant: "warning",
      });
    });
  };

  const handleEmailPress = () => {
    haptic.light();
    copyToClipboard("support@quotex.io", toast, "Email Copied", "support@quotex.io copied to clipboard.");
  };

  return (
    <PageContainer>
      <View className="w-full pb-8">
        {/* Header Hero Banner */}
        <View className="w-full rounded-3xl overflow-hidden bg-noirCard border border-white/10 p-6 mb-5 relative">
          <LinearGradient
            colors={["rgba(150, 221, 237, 0.08)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 pointer-events-none"
          />

          <View className="flex-row items-center justify-between mb-4">
            <View className="w-12 h-12 rounded-2xl bg-noirCyan/10 border border-noirCyan/20 items-center justify-center">
              <Feather name="headphones" size={24} color="#96dded" />
            </View>
            <View className="px-3 py-1 rounded-full bg-noirMint/15 border border-noirMint/30 flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-noirMint animate-pulse" />
              <Text className="font-noir text-xs font-semibold text-noirMint">
                24/7 OTC Desk Live
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-noir-medium text-white tracking-tight mb-2">
            Help & OTC Support Desk
          </Text>
          <Text className="text-sm font-noir text-white/70 leading-relaxed">
            Support tickets and dispute resolutions are managed on our web portal at{" "}
            <Text className="text-noirCyan font-semibold">app.bloqex.com/support</Text>.
          </Text>
        </View>

        {/* Support Portal Action Card */}
        <View className="w-full rounded-2xl bg-black/40 border border-noirCyan/25 p-5 mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <Feather name="globe" size={16} color="#96dded" />
            <Text className="font-noir-medium text-white text-sm font-bold">
              Bloqex Support Portal
            </Text>
          </View>
          <Text className="font-noir text-xs text-white/60 mb-4 leading-relaxed">
            Logged in as: <Text className="text-white font-medium">{user?.email || "your account"}</Text>
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenSupportPortal}
              className="flex-1 bg-noirCyan py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-lg shadow-noirCyan/20"
            >
              <Feather name="external-link" size={15} color="#111418" />
              <Text className="font-noir font-bold text-xs text-[#111418]">
                Open app.bloqex.com/support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCopyPortalLink}
              className="px-4 bg-white/10 border border-white/15 py-3.5 rounded-xl flex-row items-center justify-center active:bg-white/20"
            >
              <Feather name="copy" size={15} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Step by Step Instructions */}
        <View className="mb-6">
          <Text className="text-xs font-noir text-white/50 font-semibold tracking-wider uppercase mb-3 px-1">
            How to Create & Track Support Requests
          </Text>

          <View className="gap-3">
            {SUPPORT_PORTAL_STEPS.map((item, idx) => (
              <View
                key={idx}
                className="w-full rounded-2xl bg-noirCard/60 border border-white/[0.08] p-4"
              >
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                    <Text className="font-noir font-bold text-xs text-noirCyan">
                      {item.step}
                    </Text>
                  </View>
                  <Text className="font-noir-medium text-white text-sm font-semibold flex-1">
                    {item.title}
                  </Text>
                </View>

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
            ))}
          </View>
        </View>

        {/* Direct Channels */}
        <View className="mb-6">
          <Text className="text-xs font-noir text-white/50 font-semibold tracking-wider uppercase mb-3 px-1">
            Direct Instant Channels
          </Text>

          <View className="flex-row gap-3">
            {/* Telegram Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleTelegramPress}
              className="flex-1 rounded-2xl bg-noirCard border border-white/10 p-4 justify-between"
            >
              <View className="w-10 h-10 rounded-xl bg-[#229ED9]/15 border border-[#229ED9]/30 items-center justify-center mb-3">
                <MaterialCommunityIcons name="send" size={18} color="#229ED9" />
              </View>
              <Text className="font-noir-medium text-white text-sm font-semibold mb-0.5">
                Telegram OTC Desk
              </Text>
              <Text className="font-noir text-[11px] text-white/50">
                Avg. response &lt; 5 mins
              </Text>
            </TouchableOpacity>

            {/* Email Support Card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleEmailPress}
              className="flex-1 rounded-2xl bg-noirCard border border-white/10 p-4 justify-between"
            >
              <View className="w-10 h-10 rounded-xl bg-noirMint/15 border border-noirMint/30 items-center justify-center mb-3">
                <Feather name="mail" size={18} color="#baffd8" />
              </View>
              <Text className="font-noir-medium text-white text-sm font-semibold mb-0.5">
                Email Desk
              </Text>
              <Text className="font-noir text-[11px] text-white/50">
                support@quotex.io
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQs Accordion */}
        <View className="mb-6">
          <Text className="text-xs font-noir text-white/50 font-semibold tracking-wider uppercase mb-3 px-1">
            Frequently Asked Questions
          </Text>

          <View className="gap-2.5">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => toggleFaq(idx)}
                  className={`w-full rounded-2xl border transition-all ${
                    isExpanded
                      ? "bg-noirCard border-noirCyan/30"
                      : "bg-noirCard/60 border-white/[0.08]"
                  } p-4`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="font-noir-medium text-white text-sm font-semibold flex-1 mr-2">
                      {faq.q}
                    </Text>
                    <Feather
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#9ca3af"
                    />
                  </View>

                  <Show>
                    <Show.If isTrue={isExpanded}>
                      <View className="mt-3 pt-3 border-t border-white/10">
                        <Text className="text-xs font-noir text-white/70 leading-relaxed">
                          {faq.a}
                        </Text>
                      </View>
                    </Show.If>
                  </Show>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </PageContainer>
  );
}
