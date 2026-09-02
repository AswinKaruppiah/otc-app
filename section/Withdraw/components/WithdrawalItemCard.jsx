import { View, Text, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Popover, useToast } from "heroui-native";
import {
  truncateDecimal,
  maskText,
  formatDateTime,
  copyToClipboard,
} from "../../../utils/helper";
import { getWithdrawalStatusConfig } from "../../../utils/constants";
import { haptic } from "../../../utils/haptics";

/**
 * WithdrawalItemCard — Stock/asset card layout with solid bg-noirCard background and Popover tooltip.
 */
export default function WithdrawalItemCard({ tx }) {
  const cfg = getWithdrawalStatusConfig(tx?.status);
  const rawAmount = tx?.amount || "0";
  const { toast } = useToast();

  const handleCopy = () => {
    if (tx?.recipientAddress) {
      copyToClipboard(tx.recipientAddress, toast, "Address Copied", "Recipient address copied to clipboard.");
    }
  };

  return (
    <Popover>
      <Popover.Trigger asChild>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => haptic.light()}
          className="w-full bg-white/5 rounded-3xl p-4 flex-row items-center justify-between active:bg-white/10"
        >
          {/* Left: Circular Avatar & Asset Info */}
          <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-3">
            {/* Circular Avatar */}
            <View className="w-12 aspect-square rounded-full bg-black/20 items-center justify-center">
              <Image
                source={require("../../../assets/images/tether-usdt-logo.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </View>

            {/* Text Stack */}
            <View className="flex-1 min-w-0">
              <View className="flex-row items-center gap-1.5">
                <Text className="font-noir-medium text-[15px] text-white tracking-tight">
                  USDT
                </Text>
              </View>
              <Text
                numberOfLines={1}
                className="font-mono text-[12px] text-gray-400 mt-0.5"
              >
                {maskText(tx?.recipientAddress, 6)}
              </Text>
            </View>
          </View>

          {/* Right: Amount & Status */}
          <View className="items-end justify-center min-w-0">
            <Text className="font-noir-medium text-[15px] text-white tracking-tight text-right">
              -{truncateDecimal(rawAmount, 2)}
            </Text>
            <View className="flex-row items-center justify-end gap-1 mt-0.5">
              <Feather
                name={cfg.iconName}
                size={12}
                color={cfg.iconColor}
              />
              <Text
                style={{
                  color: cfg.iconColor,
                  includeFontPadding: false,
                  transform: [{ translateY: 1.5 }],
                }}
                className="font-noir-medium text-xs"
              >
                {cfg.label}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content presentation="popover" className="rounded-2xl p-4 w-[310px] shadow-2xl">
          {/* Popover Header */}
          <View className="flex-row items-center flex-wrap gap-2 justify-between pb-3 border-b border-white/10 mb-3">
            <View className="flex-row items-center gap-2">
              <View className="w-7 h-7 rounded-full bg-noirMint/10 items-center justify-center">
                <Feather name="arrow-up-right" size={14} color="#baffd8" />
              </View>
              <Text className="font-noir-medium text-white text-sm">
                Withdrawal Details
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Feather
                name={cfg.iconName}
                size={12}
                color={cfg.iconColor}
              />
              <Text
                style={{
                  color: cfg.iconColor,
                  includeFontPadding: false,
                  transform: [{ translateY: 1.5 }],
                }}
                className="font-noir-medium text-xs"
              >
                {cfg.label}
              </Text>
            </View>
          </View>

          {/* Details Breakdown */}
          <View className="gap-2.5">
            {/* Amount */}
            <View className="flex-row items-center justify-between">
              <Text className="font-noir text-xs text-gray-400">Amount</Text>
              <Text className="font-noir-medium text-xs text-white">
                {truncateDecimal(rawAmount, 2)} USDT
              </Text>
            </View>

            {/* Date & Time */}
            <View className="flex-row items-center justify-between">
              <Text className="font-noir text-xs text-gray-400">Created At</Text>
              <Text className="font-noir text-xs text-gray-300">
                {formatDateTime(tx?.createdAt)}
              </Text>
            </View>

            {/* Network */}
            <View className="flex-row items-center justify-between">
              <Text className="font-noir text-xs text-gray-400">Network</Text>
              <Text className="font-noir text-xs text-gray-300">
                TRON (TRC-20)
              </Text>
            </View>

            {/* Full Recipient Address */}
            <View className="pt-2 border-t border-white/5">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="font-noir text-xs text-gray-400">Recipient Address</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCopy}
                  className="flex-row items-center gap-1 px-1.5 py-0.5 rounded bg-noirMint/10"
                >
                  <Feather name="copy" size={10} color="#baffd8" />
                  <Text className="font-noir text-[10px] text-noirMint">Copy</Text>
                </TouchableOpacity>
              </View>
              <Text
                selectable
                className="font-mono text-[11px] text-gray-300 bg-white/5 p-2 rounded-lg border border-white/5"
              >
                {tx?.recipientAddress}
              </Text>
            </View>
          </View>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
