import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { truncateDecimal, maskText, formatDateTime } from "../../../utils/helper";
import { WITHDRAWAL_STATUS_CONFIG as STATUS_CONFIG } from "../../../utils/constants";

/**
 * WithdrawalItemCard — Renders a single withdrawal transaction row.
 */
export default function WithdrawalItemCard({ tx }) {
  const statusKey = (tx.status || "pending").toLowerCase();
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const rawAmount = tx.amount || "0";

  return (
    <View className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 flex-row items-center justify-between">
      {/* Left: Icon & Details */}
      <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-2">
        <View className="w-10 h-10 rounded-xl bg-noirMint/10 border border-noirMint/20 items-center justify-center">
          <Feather name="arrow-up-right" size={18} color="#baffd8" />
        </View>
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <Text className="font-noir font-bold text-sm text-white leading-tight">
              -{truncateDecimal(rawAmount, 2)}
            </Text>
            <Text className="font-noir text-xs text-gray-400">
              USDT
            </Text>
            <View className="px-1.5 py-0.2 rounded bg-red-500/15 border border-red-500/30">
              <Text className="text-[9px] font-noir-medium text-red-400">
                {tx.network || "TRC-20"}
              </Text>
            </View>
          </View>
          <Text className="font-mono text-[11px] text-gray-400">
            {maskText(tx.recipientAddress, 6)}
          </Text>
        </View>
      </View>

      {/* Right: Status Pill & Date */}
      <View className="items-end gap-1.5">
        <View
          className={`px-2.5 py-1 rounded-full border flex-row items-center gap-1.5 ${cfg.bgClass}`}
        >
          <Feather name={cfg.iconName} size={11} color={cfg.iconColor} />
          <Text className={`text-[10px] font-noir-bold uppercase tracking-wider ${cfg.textClass}`}>
            {cfg.label}
          </Text>
        </View>
        <Text className="font-noir text-[10px] text-gray-500">
          {formatDateTime(tx.createdAt)}
        </Text>
      </View>
    </View>
  );
}
