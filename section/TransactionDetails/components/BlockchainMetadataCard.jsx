import { useState } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useToast } from "heroui-native";
import { copyToClipboard, formatDateTime, maskText } from "../../../utils/helper";

const TRON_EXPLORER_URL = process.env.EXPO_PUBLIC_TRON_EXPLORER_URL;
const IS_PROD = process.env.EXPO_PUBLIC_APP_ENV === "prod";
const CRYPTO_SYMBOL = IS_PROD ? "USDT" : "TRX";

export const BlockchainMetadataCard = ({ blockchainTx }) => {
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);

  if (!blockchainTx) return null;

  const handleCopy = async (key, value, label) => {
    if (!value) return;
    const success = await copyToClipboard(
      value,
      toast,
      `${label} Copied`,
      `Copied to clipboard.`
    );
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleOpenExplorer = () => {
    if (!blockchainTx?.hash) return;
    Linking.openURL(`${TRON_EXPLORER_URL}${blockchainTx.hash}`).catch(() => { });
  };

  return (
    <View className="w-full gap-3">
      {/* Section Title & Network Badge */}
      <View className="flex-row items-center justify-between pl-1">
        <View className="flex-row items-center gap-1.5">
          <Feather name="shield" size={13} color="#34d399" />
          <Text className="text-gray-400 font-noir-medium text-xs tracking-wider uppercase">
            On-Chain Settlement
          </Text>
        </View>
      </View>

      {/* Main Glassmorphic Card */}
      <LinearGradient
        colors={[
          "rgba(52, 211, 153, 0.2)",
          "rgba(255, 255, 255, 0.04)",
          "rgba(52, 211, 153, 0.08)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 24, padding: 1 }}
      >
        <View className="bg-[#050D0A] rounded-[23px] p-5 gap-4">
          {/* 1. Crypto Released Banner */}
          {blockchainTx.amount != null && (
            <LinearGradient
              colors={["rgba(52, 211, 153, 0.12)", "rgba(52, 211, 153, 0.03)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl overflow-hidden p-4 border border-emerald-500/20"
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-400 font-noir text-xs uppercase tracking-wider">
                  Crypto Released
                </Text>
                <View className="flex-row items-center gap-1">
                  <Feather name="check-circle" size={12} color="#34d399" />
                  <Text className="text-[11px] font-noir text-emerald-400">
                    Finalized
                  </Text>
                </View>
              </View>
              <View className="flex-row items-baseline gap-1.5">
                <Text className="text-white font-noir text-3xl font-bold tracking-tight">
                  {blockchainTx.amount}
                </Text>
                <Text className="text-emerald-400 font-noir-medium text-lg font-bold">
                  {CRYPTO_SYMBOL}
                </Text>
              </View>
            </LinearGradient>
          )}

          {/* 2. Address Routing (From -> To) */}
          <View className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3.5 gap-2.5">
            {/* From Address */}
            {blockchainTx.from && (
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3 min-w-0">
                  <View className="flex-row items-center gap-1.5 mb-0.5">
                    <Feather name="arrow-up-right" size={12} color="#94a3b8" />
                    <Text className="text-[11px] font-noir text-gray-400">
                      From (Treasury)
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-[13px] font-mono font-medium text-white/90"
                  >
                    {maskText(blockchainTx.from, 7)}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCopy("from", blockchainTx.from, "From Address")}
                  className={`p-2 rounded-lg border ${copiedKey === "from"
                    ? "bg-emerald-500/20 border-emerald-500/40"
                    : "bg-white/5 border-white/10 active:bg-white/10"
                    }`}
                >
                  <Feather
                    name={copiedKey === "from" ? "check" : "copy"}
                    size={13}
                    color={copiedKey === "from" ? "#34d399" : "rgba(255, 255, 255, 0.7)"}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Separator / Connector */}
            {blockchainTx.from && blockchainTx.to && (
              <View className="flex-row items-center my-3">
                <View className="flex-1 h-[1px] bg-white/[0.06]" />
              </View>
            )}

            {/* To Address */}
            {blockchainTx.to && (
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3 min-w-0">
                  <View className="flex-row items-center gap-1.5 mb-0.5">
                    <Feather name="arrow-down-left" size={12} color="#34d399" />
                    <Text className="text-[11px] font-noir text-emerald-400">
                      To (Your Wallet)
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-[13px] font-mono font-bold text-white"
                  >
                    {maskText(blockchainTx.to, 7)}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCopy("to", blockchainTx.to, "To Address")}
                  className={`p-2 rounded-lg border ${copiedKey === "to"
                    ? "bg-emerald-500/20 border-emerald-500/40"
                    : "bg-white/5 border-white/10 active:bg-white/10"
                    }`}
                >
                  <Feather
                    name={copiedKey === "to" ? "check" : "copy"}
                    size={13}
                    color={copiedKey === "to" ? "#34d399" : "rgba(255, 255, 255, 0.7)"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 3. Tx Hash Card with Copy & Explorer Link */}
          {blockchainTx.hash && (
            <View className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3.5 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-[11px] font-noir text-gray-400 uppercase tracking-wider">
                  Transaction Hash (TxID)
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleOpenExplorer}
                  className="flex-row items-center gap-1 bg-white/[0.06] px-2 py-1 rounded-md border border-white/[0.08]"
                >
                  <Text className="text-[10px] font-noir-medium text-emerald-400">
                    TronScan
                  </Text>
                  <Feather name="external-link" size={10} color="#34d399" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center justify-between">
                <Text
                  numberOfLines={1}
                  className="text-[13px] font-mono text-white/90 flex-1 mr-3"
                >
                  {maskText(blockchainTx.hash, 10)}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCopy("hash", blockchainTx.hash, "Tx Hash")}
                  className={`p-2 rounded-lg border ${copiedKey === "hash"
                    ? "bg-emerald-500/20 border-emerald-500/40"
                    : "bg-white/5 border-white/10 active:bg-white/10"
                    }`}
                >
                  <Feather
                    name={copiedKey === "hash" ? "check" : "copy"}
                    size={13}
                    color={copiedKey === "hash" ? "#34d399" : "rgba(255, 255, 255, 0.7)"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 4. Timestamp Footer */}
          {blockchainTx.confirmedAt && (
            <View className="flex-row items-center justify-between pt-1 px-1">
              <Text className="text-[11px] font-noir text-gray-400">
                Confirmed At
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Feather name="clock" size={11} color="#94a3b8" />
                <Text className="text-[12px] font-noir text-gray-300">
                  {formatDateTime(blockchainTx.confirmedAt)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};
