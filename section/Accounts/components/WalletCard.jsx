import { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import HapticTouchableOpacity from "../../../components/HapticTouchableOpacity";
import { maskText, formatDate } from "../../../utils/helper";

const CARD_STATUS_META = {
  verified: {
    label: "Verified",
    gradientColors: ["#0E4A35", "#092F22", "#041710"],
    accentColor: "#baffd8",
    badgeBg: "bg-[#baffd8]/15 border-[#baffd8]/30 text-[#baffd8]",
    dotColor: "#baffd8",
    icon: "check-circle",
  },
  rejected: {
    label: "Rejected",
    gradientColors: ["#4A0E18", "#2F0910", "#170407"],
    accentColor: "#ff7b7b",
    badgeBg: "bg-red-500/15 border-red-500/30 text-red-400",
    dotColor: "#ff7b7b",
    icon: "alert-circle",
  },
  pending: {
    label: "Under Review",
    gradientColors: ["#4A380E", "#2F2309", "#171104"],
    accentColor: "#fbbf24",
    badgeBg: "bg-amber-400/15 border-amber-400/30 text-amber-400",
    dotColor: "#fbbf24",
    icon: "clock",
  },
};

/**
 * WalletCard — Hero Gradient Crypto Wallet Card modeled after MyTonWallet reference UI.
 */
export default function WalletCard({
  wallet = {},
  onCopy,
  onRemove,
  isRemoving = false,
}) {
  const [copied, setCopied] = useState(false);

  const statusKey = (wallet.status || "pending").toLowerCase();
  const statusMeta = CARD_STATUS_META[statusKey] || CARD_STATUS_META.pending;
  const createdDate = wallet.createdAt ? formatDate(wallet.createdAt) : null;

  const handleCopyPress = () => {
    onCopy?.(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View
      style={{ borderRadius: 24, overflow: "hidden" }}
      className="w-full mb-5 shadow-2xl border border-white/10"
    >
      {/* Hero Card Container */}
      <LinearGradient
        colors={statusMeta.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 22 }}
        className="w-full relative"
      >
        {/* Subtle Multi-Layer Background Radial Glow Circles */}
        <View
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[1%] pointer-events-none"
          style={{ backgroundColor: statusMeta.accentColor }}
        />
        <View
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-[1.5%] pointer-events-none"
          style={{ backgroundColor: statusMeta.accentColor }}
        />
        <View
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[2%] pointer-events-none"
          style={{ backgroundColor: statusMeta.accentColor }}
        />

        {/* Top Header Row: Network Tag & Status Pill */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
            <Text className="text-white font-noir-medium text-xs tracking-wider uppercase font-semibold">
              TRON (TRC-20)
            </Text>
          </View>

          {/* Status Badge */}
          <View className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusMeta.badgeBg}`}>
            <Feather name={statusMeta.icon} size={12} color={statusMeta.accentColor} />
            <Text className={`font-noir text-xs font-semibold tracking-wide ${statusMeta.badgeBg.split(" ").pop()}`}>
              {statusMeta.label}
            </Text>
          </View>
        </View>

        {/* Hero Section: Wallet Label & Big Monospaced Address */}
        <View className="mb-5 gap-1">
          <Text className="text-white/70 font-noir text-xs font-medium tracking-wide uppercase">
            {wallet.label || "Whitelisted Wallet"}
          </Text>

          <Text
            className="text-2xl text-white font-mono font-bold tracking-wider"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {maskText(wallet.address, 6)}
          </Text>

          {/* Sub-Pill Details (MyTonWallet Style) */}
          <View className="flex-row items-center gap-2 mt-1">
            <View className="bg-white/15 border border-white/20 px-3 py-1 rounded-full flex-row items-center gap-1.5">
              <Feather name="shield" size={11} color="#96dded" />
              <Text className="text-noirCyan font-noir text-[11px] font-medium">
                Payout Destination
              </Text>
            </View>
            {createdDate && (
              <Text className="text-white/50 font-noir text-[11px]">
                • Added {createdDate}
              </Text>
            )}
          </View>
        </View>

        {/* Card Footer Action Bar: Glass Copy Button & Circular Trash Button */}
        <View className="flex-row items-center justify-between border-t border-white/10 pt-4 mt-1">
          <HapticTouchableOpacity
            onPress={handleCopyPress}
            hapticType="light"
            activeOpacity={0.8}
            className="bg-white/15 border border-white/20 px-4 py-2 rounded-full flex-row items-center gap-2 active:bg-white/25"
          >
            <Feather
              name={copied ? "check" : "copy"}
              size={14}
              color={copied ? "#baffd8" : "#ffffff"}
            />
            <Text className={`font-noir text-xs font-bold ${copied ? "text-noirMint" : "text-white"}`}>
              {copied ? "Copied" : "Copy Address"}
            </Text>
          </HapticTouchableOpacity>

          <View className="flex-row items-center gap-3">
            <HapticTouchableOpacity
              disabled={isRemoving}
              onPress={() => onRemove?.(wallet.id, wallet.label)}
              hapticType="medium"
              activeOpacity={0.8}
              className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 items-center justify-center active:bg-red-500/30"
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color="#ff7b7b" />
              ) : (
                <Feather name="trash-2" size={14} color="#ff7b7b" />
              )}
            </HapticTouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
