import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton } from "heroui-native";
import { useQuery } from "@apollo/client/react";
import Show from "../../../components/Show";
import EmptyState from "../../../components/EmptyState";
import { useScreenPadding } from "../../../context/ScrollContext";
import { GET_MY_WITHDRAWALS } from "../../../apollo/query";
import { WITHDRAWAL_STATUS_TABS as TABS } from "../../../utils/constants";
import { haptic } from "../../../utils/haptics";
import WithdrawHistoryHeader from "./WithdrawHistoryHeader";
import WithdrawalItemCard from "./WithdrawalItemCard";

/**
 * WithdrawRecentHistory — Orchestrator component for recent withdrawal transactions with API pagination.
 */
export default function WithdrawRecentHistory({
  recentWithdrawals: propWithdrawals,
  loading: propLoading,
  error: propError,
  onRefresh,
  onMakeWithdrawalPress,
}) {
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const { paddingHorizontal } = useScreenPadding();

  // Query GET_MY_WITHDRAWALS with pagination & status filter variables
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_MY_WITHDRAWALS, {
    variables: {
      page,
      limit: 10,
      ...(activeTab ? { status: activeTab } : {}),
    },
    skip: !!propWithdrawals,
    fetchPolicy: "cache-and-network",
  });

  const recentWithdrawals = propWithdrawals || queryData?.getMyWithdrawals?.items || [];
  const totalCount = queryData?.getMyWithdrawals?.total ?? recentWithdrawals.length;
  const totalPages = queryData?.getMyWithdrawals?.totalPages ?? 1;
  const hasNextPage = queryData?.getMyWithdrawals?.hasNextPage ?? (page < totalPages);
  const hasPrevPage = queryData?.getMyWithdrawals?.hasPrevPage ?? (page > 1);

  const loading = propLoading !== undefined ? propLoading : queryLoading;
  const error = propError !== undefined ? propError : queryError;
  const handleRefresh = onRefresh || refetch;

  const activeTabObj = TABS.find((t) => t.value === activeTab) || TABS[0];

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (hasPrevPage && !loading) {
      haptic.light();
      setPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !loading) {
      haptic.light();
      setPage((prev) => prev + 1);
    }
  };

  return (
    <View style={{ paddingHorizontal }} className="w-full">
      {/* Header with Title and Filter Dropdown */}
      <WithdrawHistoryHeader
        count={totalCount}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
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
        <Show.If isTrue={loading && recentWithdrawals.length === 0}>
          <View className="w-full gap-2.5">
            <Skeleton className="w-full h-16 rounded-2xl bg-white/5" />
            <Skeleton className="w-full h-16 rounded-2xl bg-white/5" />
            <Skeleton className="w-full h-16 rounded-2xl bg-white/5" />
          </View>
        </Show.If>

        {/* Empty State */}
        <Show.If isTrue={!loading && !error && recentWithdrawals.length === 0}>
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

        {/* Transaction Cards List & Pagination Controls */}
        <Show.Else>
          <View className="w-full gap-2.5">
            {recentWithdrawals.map((tx) => (
              <WithdrawalItemCard key={tx._id || tx.id} tx={tx} />
            ))}
          </View>

          {/* Bottom Left and Right Edge Pagination Bar */}
          <Show>
            <Show.If isTrue={totalPages > 1}>
              <View className="flex-row items-center justify-between mt-5 pt-1 mb-2">
                {/* Previous Button (Left Edge) */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={!hasPrevPage || loading}
                  onPress={handlePrevPage}
                  className={`flex-row items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/5 border border-white/10 ${
                    hasPrevPage && !loading ? "opacity-100 active:bg-white/10" : "opacity-35"
                  }`}
                >
                  <Feather name="chevron-left" size={16} color="#FFFFFF" />
                  <Text className="text-xs font-noir font-medium text-white">
                    Previous
                  </Text>
                </TouchableOpacity>

                {/* Page Indicator (Center) */}
                <View className="px-3 py-1.5 rounded-full bg-white/[0.03]">
                  <Text className="text-xs font-noir text-gray-400">
                    Page <Text className="text-white font-bold">{page}</Text> of{" "}
                    <Text className="text-white font-bold">{totalPages}</Text>
                  </Text>
                </View>

                {/* Next Button (Right Edge) */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={!hasNextPage || loading}
                  onPress={handleNextPage}
                  className={`flex-row items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/5 border border-white/10 ${
                    hasNextPage && !loading ? "opacity-100 active:bg-white/10" : "opacity-35"
                  }`}
                >
                  <Text className="text-xs font-noir font-medium text-white">
                    Next
                  </Text>
                  <Feather name="chevron-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Show.If>
          </Show>
        </Show.Else>
      </Show>
    </View>
  );
}
