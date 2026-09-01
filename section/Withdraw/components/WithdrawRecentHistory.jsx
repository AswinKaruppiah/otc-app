import { useState } from "react";
import { View } from "react-native";
import { Skeleton } from "heroui-native";
import { useQuery } from "@apollo/client/react";
import Show from "../../../components/Show";
import EmptyState from "../../../components/EmptyState";
import { useScreenPadding } from "../../../context/ScrollContext";
import { GET_MY_WITHDRAWALS } from "../../../apollo/query";
import { WITHDRAWAL_STATUS_TABS as TABS } from "../../../utils/constants";
import WithdrawHistoryHeader from "./WithdrawHistoryHeader";
import WithdrawalItemCard from "./WithdrawalItemCard";

/**
 * WithdrawRecentHistory — Orchestrator component for recent withdrawal transactions.
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
      {/* Header with Title and Filter Dropdown */}
      <WithdrawHistoryHeader
        count={recentWithdrawals.length}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Content States */}
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

        {/* Transaction Cards List */}
        <Show.Else>
          <View className="w-full gap-2.5">
            {filteredWithdrawals.map((tx) => (
              <WithdrawalItemCard key={tx._id || tx.id} tx={tx} />
            ))}
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}
