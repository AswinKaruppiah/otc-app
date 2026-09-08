import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton, useToast } from "heroui-native";
import Show from "../../../components/Show";
import { useScreenPadding } from "../../../context/ScrollContext";
import { truncateDecimal, maskText, copyToClipboard } from "../../../utils/helper";

/**
 * WithdrawBalanceCard — Hero card displaying wallet balance, wallet address, and Withdraw CTA button.
 */
export default function WithdrawBalanceCard({
  walletBalance = 0,
  walletAddress = "",
  loading = false,
  symbol = "USDT",
  onWithdrawPress,
}) {
  const { paddingTop, paddingHorizontal } = useScreenPadding();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (!walletAddress) return;
    const success = await copyToClipboard(
      walletAddress,
      toast,
      "Address Copied",
      "Wallet address copied to clipboard."
    );
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View
      style={{
        borderRadius: 44,
        overflow: "hidden",
      }}
      className="mb-6"
    >
      <LinearGradient
        colors={["#020a06", "#0c3624", "#166648"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: paddingTop + 30,
          paddingHorizontal: paddingHorizontal,
          paddingBottom: 8,
        }}
        className="w-full relative"
      >
        {/* 1. WALLET BALANCE Label */}
        <Text className="text-xs font-noir font-light uppercase text-white/40 mb-2 text-center tracking-wider">
          Wallet Balance
        </Text>

        {/* 2. Main Balance Display */}
        <Show>
          <Show.If isTrue={loading}>
            <Skeleton className="h-[43px] w-48 rounded-xl bg-white/10 mb-1 self-center" />
          </Show.If>
          <Show.Else>
            <View className="flex-row items-baseline justify-center gap-2 mb-1">
              <Text className="text-4xl sm:text-5xl font-noir font-normal text-white tracking-tight">
                {truncateDecimal(walletBalance, 2)}
              </Text>
              <Text className="text-4xl sm:text-5xl font-noir font-normal text-white/50">
                {symbol}
              </Text>
            </View>
          </Show.Else>
        </Show>

        <Text className="text-xs font-noir font-normal text-gray-400 text-center mb-4">
          {symbol === "USDT" ? "TRC-20 Transfer" : "Tron Network"}
        </Text>

        {/* 3. Wallet Address Box */}
        <Show>
          <Show.If isTrue={Boolean(walletAddress)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCopyAddress}
              className="w-full bg-black/25 border border-white/10 rounded-3xl pl-5 pr-3 py-3 flex-row items-center justify-between mb-4 active:bg-black/40"
            >
              <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-3">
                <View className="flex-1 min-w-0">
                  <Text className="text-[10px] font-noir font-medium text-gray-400 uppercase tracking-wider">
                    App Wallet • {symbol === "USDT" ? "TRC-20" : "TRON"}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-[13px] font-mono font-bold text-white tracking-wide mt-0.5"
                  >
                    {maskText(walletAddress, 6)}
                  </Text>
                </View>
              </View>
              <View
                className={`px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border ${
                  copied
                    ? "bg-noirMint/20 border-noirMint/40"
                    : "bg-white/10 border-white/15"
                }`}
              >
                <Feather
                  name={copied ? "check" : "copy"}
                  size={12}
                  color={copied ? "#baffd8" : "rgba(255, 255, 255, 0.7)"}
                />
                <Text
                  className={`text-[11px] font-noir font-medium ${
                    copied ? "text-noirMint font-bold" : "text-white/80"
                  }`}
                >
                  {copied ? "Copied" : "Copy"}
                </Text>
              </View>
            </TouchableOpacity>
          </Show.If>
        </Show>

        {/* 4. Bottom Section: Withdraw CTA */}
        <View className="w-full">
          <View style={{ marginHorizontal: -paddingHorizontal + 12 }}>
            <TouchableOpacity
              onPress={onWithdrawPress}
              disabled={loading}
              activeOpacity={0.85}
              className={`w-full py-5 rounded-full flex-row items-center justify-center gap-2 ${loading ? "bg-noirMint/40 opacity-50" : "bg-noirMint"
                }`}
            >
              <Feather name="upload" size={20} color={loading ? "#11141880" : "#111418"} />
              <Text className={`font-noir font-bold text-sm ${loading ? "text-noirBg/60" : "text-noirBg"}`}>
                Withdraw {symbol}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
