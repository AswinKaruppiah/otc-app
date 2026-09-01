import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton, Select } from "heroui-native";
import { useQuery } from "@apollo/client/react";
import Show from "../../../components/Show";
import EmptyState from "../../../components/EmptyState";
import { useScreenPadding } from "../../../context/ScrollContext";
import { GET_MY_WITHDRAWALS } from "../../../apollo/query";
import {
  truncateDecimal,
  maskText,
  formatDateTime,
} from "../../../utils/helper";

const TABS = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    textClass: "text-noirMint",
    bgClass: "bg-noirMint/10 border-noirMint/25",
    iconName: "check-circle",
    iconColor: "#baffd8",
  },
  processing: {
    label: "Processing",
    textClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10 border-cyan-500/25",
    iconName: "refresh-cw",
    iconColor: "#22d3ee",
  },
  pending: {
    label: "Pending",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/25",
    iconName: "clock",
    iconColor: "#fbbf24",
  },
  failed: {
    label: "Failed",
    textClass: "text-red-400",
    bgClass: "bg-red-500/10 border-red-500/25",
    iconName: "alert-circle",
    iconColor: "#f87171",
  },
};

/**
 * WithdrawRecentHistory — Self-contained transaction history component with HeroUI Select.
 */
export default function WithdrawRecentHistory({
  recentWithdrawals: propWithdrawals,
  loading: propLoading,
  error: propError,
  onRefresh,
  onMakeWithdrawalPress,
}) {
  const [activeTab, setActiveTab] = useState("");
  const { paddingHorizontal } = useScreenPadding();

  // Internal query for GET_MY_WITHDRAWALS if not passed from parent
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_MY_WITHDRAWALS, {
    variables: { page: 1, limit: 10 },
    skip: !!propWithdrawals,
  });

  const recentWithdrawals = propWithdrawals || queryData?.getMyWithdrawals?.items || [];
  const loading = propLoading !== undefined ? propLoading : queryLoading;
  const error = propError !== undefined ? propError : queryError;
  const handleRefresh = onRefresh || refetch;

  const activeTabObj = TABS.find((t) => t.value === activeTab) || TABS[0];

  const filteredWithdrawals = recentWithdrawals.filter((tx) => {
    if (!activeTab) return true;
    return (tx.status || "").toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <View style={{ paddingHorizontal }} className="w-full">
      {/* Header with Title and HeroUI Select Dropdown opposite */}
      <View className="flex-row items-center justify-between mb-4 pl-1">
        <View className="flex-row items-center gap-2">
          <Text className="font-noir font-semibold text-sm text-white">
            Transaction History
          </Text>
          {recentWithdrawals.length > 0 && (
            <View className="bg-white/10 border border-white/10 rounded-full px-2 py-0.5">
              <Text className="font-noir text-[10px] text-gray-300">
                {recentWithdrawals.length}
              </Text>
            </View>
          )}
        </View>

        {/* HeroUI Native Select Component */}
        <Select
          presentation="bottom-sheet"
          value={{ value: activeTab, label: activeTabObj.label }}
          onValueChange={(option) => {
            if (option && !Array.isArray(option)) {
              setActiveTab(option.value || "");
            }
          }}
        >
          <Select.Trigger variant="unstyled" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
            >
              <Text className="font-noir text-xs font-medium text-noirMint">
                {activeTabObj.label}
              </Text>
              <Feather name="chevron-down" size={13} color="#baffd8" />
            </TouchableOpacity>
          </Select.Trigger>
          <Select.Portal>
            <Select.Overlay className="bg-black/80" />
            <Select.Content
              presentation="bottom-sheet"
              contentContainerClassName="p-6 pb-10"
            >
              <Select.ListLabel className="text-base text-white font-noir-bold mb-4">
                Filter Transactions
              </Select.ListLabel>
              {TABS.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  className="flex-row items-center justify-between py-3.5"
                >
                  {({ isSelected }) => (
                    <View className="flex-row items-center justify-between w-full">
                      <Text
                        className={`font-noir text-sm ${isSelected ? "text-noirMint font-bold" : "text-gray-300 font-medium"
                          }`}
                      >
                        {opt.label}
                      </Text>
                      {isSelected && <Feather name="check" size={16} color="#baffd8" />}
                    </View>
                  )}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Portal>
        </Select>
      </View>

      {/* Transaction List / Loading / Error / Empty State */}
      <Show>
        {/* Error State */}
        <Show.If isTrue={!loading && !!error}>
          <EmptyState
            type="error"
            title="Failed to load withdrawals"
            description={error?.message || "Something went wrong while fetching your withdrawal history."}
            actionLabel="Try Again"
            onAction={handleRefresh}
          />
        </Show.If>

        {/* Loading Skeletons */}
        <Show.If isTrue={loading}>
          <View className="w-full gap-2.5">
            <Skeleton className="w-full h-16 rounded-2xl bg-white/5" />
            <Skeleton className="w-full h-16 rounded-2xl bg-white/5" />
            <Skeleton className="w-full h-16 rounded-2xl bg-white/5" />
          </View>
        </Show.If>

        {/* Empty State */}
        <Show.If isTrue={!loading && !error && filteredWithdrawals.length === 0}>
          <EmptyState
            type={activeTab ? "search" : "empty"}
            icon="trending-down"
            iconSize={96}
            title={activeTab ? `No ${activeTabObj.label} withdrawals` : "No withdrawals yet"}
            description={
              activeTab
                ? "Try selecting a different filter status option."
                : "When you withdraw USDT, your transactions will appear here."
            }
            actionLabel={!activeTab && onMakeWithdrawalPress ? "Make your first withdrawal" : null}
            onAction={!activeTab && onMakeWithdrawalPress ? onMakeWithdrawalPress : null}
          />
        </Show.If>

        {/* Transaction Rows */}
        <Show.Else>
          <View className="w-full gap-2.5">
            {filteredWithdrawals.map((tx) => {
              const statusKey = (tx.status || "pending").toLowerCase();
              const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const rawAmount = tx.amount || "0";

              return (
                <View
                  key={tx.id || tx._id}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 flex-row items-center justify-between"
                >
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
                            TRC-20
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
            })}
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}
