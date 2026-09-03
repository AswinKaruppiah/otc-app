import { useState, forwardRef, useImperativeHandle } from "react";
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
const WithdrawRecentHistory = forwardRef(function WithdrawRecentHistory(
  {
    recentWithdrawals: propWithdrawals,
    loading: propLoading,
    error: propError,
    refreshing = false,
    onRefresh,
    onMakeWithdrawalPress,
  },
  ref
) {
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const { paddingHorizontal } = useScreenPadding();

  // Query GET_MY_WITHDRAWALS with pagination & status filter variables
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
    refetch,
    networkStatus,
  } = useQuery(GET_MY_WITHDRAWALS, {
    variables: {
      page,
      limit: 10,
      ...(activeTab ? { status: activeTab } : {}),
    },
    skip: !!propWithdrawals,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const recentWithdrawals = propWithdrawals || queryData?.getMyWithdrawals?.items || [];
  const totalCount = queryData?.getMyWithdrawals?.total ?? recentWithdrawals.length;
  const totalPages = queryData?.getMyWithdrawals?.totalPages ?? 1;
  const hasNextPage = queryData?.getMyWithdrawals?.hasNextPage ?? (page < totalPages);
  const hasPrevPage = queryData?.getMyWithdrawals?.hasPrevPage ?? (page > 1);

  const loading = propLoading !== undefined ? propLoading : (queryLoading || refreshing);
  const error = propError !== undefined ? propError : queryError;
  const handleRefresh = onRefresh || refetch;

  useImperativeHandle(ref, () => ({
    refetch: async () => {
      setPage(1);
      return refetch({
        page: 1,
        limit: 10,
        ...(activeTab ? { status: activeTab } : {}),
      });
    },
  }));

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
        <Show.If isTrue={!loading && !refreshing && !!error}>
          <EmptyState
            type="error"
            title="Failed to load withdrawals"
            description={error?.message || "Something went wrong while fetching your withdrawal history."}
            actionLabel="Try Again"
            onAction={handleRefresh}
          />
        </Show.If>

        {/* Loading Skeletons */}
        <Show.If isTrue={loading || refreshing}>
          <View className="w-full gap-2.5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="w-full h-[76px] rounded-3xl bg-white/5"
              />
            ))}
          </View>
        </Show.If>

        {/* Empty State */}
        <Show.If isTrue={!loading && !refreshing && !error && recentWithdrawals.length === 0}>
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
          />
        </Show.If>

        {/* Transaction Cards List & Pagination Controls */}
        <Show.Else>
          <View className="w-full gap-2.5 min-h-[280px]">
            {recentWithdrawals.map((tx) => (
              <WithdrawalItemCard key={tx._id || tx.id} tx={tx} />
            ))}
          </View>

          {/* Compact Clean Pagination Bar */}
          {totalPages > 1 && (
            <View className="flex-row items-center justify-between mt-4 px-1">
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!hasPrevPage || loading}
                onPress={handlePrevPage}
                className={`flex-row items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 ${hasPrevPage && !loading ? "active:bg-white/10" : "opacity-30"
                  }`}
              >
                <Feather name="chevron-left" size={15} color="#fff" />
                <Text className="text-xs font-noir font-medium text-white">Prev</Text>
              </TouchableOpacity>

              <Text className="text-xs font-noir text-gray-400">
                <Text className="text-white font-medium">{page}</Text> of {totalPages}
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!hasNextPage || loading}
                onPress={handleNextPage}
                className={`flex-row items-center gap-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 ${hasNextPage && !loading ? "active:bg-white/10" : "opacity-30"
                  }`}
              >
                <Text className="text-xs font-noir font-medium text-white">Next</Text>
                <Feather name="chevron-right" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </Show.Else>
      </Show>
    </View>
  );
});

export default WithdrawRecentHistory;
