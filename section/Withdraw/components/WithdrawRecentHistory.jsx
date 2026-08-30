import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * Truncate address: TQp8LmN2...6zU1
 */
function elideAddress(addr) {
  if (!addr) return "";
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}····${addr.slice(-6)}`;
}

/**
 * Format timestamp to readable date/time
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Status meta for withdrawal history pills
 */
const STATUS_CHIPS = {
  completed: {
    label: "Completed",
    textClass: "text-noirMint",
    bgClass: "bg-noirMint/10 border-noirMint/25",
    icon: "check-circle",
  },
  processing: {
    label: "Processing",
    textClass: "text-noirCyan",
    bgClass: "bg-noirCyan/10 border-noirCyan/25",
    icon: "refresh-cw",
  },
  pending: {
    label: "Pending",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/25",
    icon: "clock",
  },
  failed: {
    label: "Failed",
    textClass: "text-red-400",
    bgClass: "bg-red-500/10 border-red-500/25",
    icon: "alert-circle",
  },
};

/**
 * WithdrawRecentHistory — Section listing recent USDT withdrawal transactions with status pills.
 */
export default function WithdrawRecentHistory({
  recentWithdrawals = [],
  onRefresh,
}) {
  if (!recentWithdrawals || recentWithdrawals.length === 0) return null;

  return (
    <View className="w-full">
      <View className="flex-row items-center justify-between mb-3 pl-1">
        <Text className="font-noir font-semibold text-sm text-gray-200">
          Recent Withdrawals
        </Text>
        <TouchableOpacity onPress={onRefresh}>
          <Feather name="refresh-cw" size={13} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View className="w-full gap-2.5">
        {recentWithdrawals.map((tx) => {
          const statusKey = (tx.status || "pending").toLowerCase();
          const chip = STATUS_CHIPS[statusKey] || STATUS_CHIPS.pending;
          return (
            <View
              key={tx.id}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                  <Feather name="upload" size={16} color="#baffd8" />
                </View>
                <View>
                  <Text className="font-noir font-semibold text-sm text-white">
                    {tx.amount} USDT
                  </Text>
                  <Text className="font-mono text-[11px] text-gray-400 mt-0.5">
                    {elideAddress(tx.recipientAddress)}
                  </Text>
                </View>
              </View>

              <View className="items-end gap-1">
                <View
                  className={`px-2 py-0.5 rounded-full border flex-row items-center gap-1 ${chip.bgClass}`}
                >
                  <Feather
                    name={chip.icon}
                    size={10}
                    color={
                      chip.textClass.includes("Mint")
                        ? "#baffd8"
                        : chip.textClass.includes("Cyan")
                        ? "#96dded"
                        : "#fbbf24"
                    }
                  />
                  <Text className={`text-[10px] font-noir-medium ${chip.textClass}`}>
                    {chip.label}
                  </Text>
                </View>
                <Text className="font-noir text-[10px] text-gray-500">
                  {formatDate(tx.createdAt)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
