import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/client/react";
import { Skeleton } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { LIST_ORDERS } from "../../apollo/query";
import TransactionCard from "./TransactionCard";
import Show from "../../components/Show";

function EmptyState({ search, onRefresh }) {
  return (
    <View className="items-center justify-center py-20 px-4">
      <View className="w-14 h-14 rounded-full bg-white/5 border border-white/[0.06] items-center justify-center mb-4">
        <Feather name={search ? "search" : "inbox"} size={26} color="#baffd8" />
      </View>
      <Text className="text-base text-noirText font-noir font-semibold mb-1">
        {search ? "No results found" : "No transactions yet"}
      </Text>
      <Text className="text-[13px] text-gray-400 font-noir text-center max-w-[260px] leading-5">
        {search
          ? `We couldn't find any trades matching "${search}".`
          : "Your trade transactions history will show up here once you start."}
      </Text>
      <TouchableOpacity
        onPress={onRefresh}
        className="mt-5 bg-white/5 border border-white/[0.06] px-5 py-2.5 rounded-full flex-row items-center gap-2"
        activeOpacity={0.8}
      >
        <Feather name="refresh-cw" size={14} color="#baffd8" />
        <Text className="text-noirText font-noir font-semibold text-xs">
          Refresh List
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TransactionList({ search, status, dateFrom, dateTo, onCountChange }) {
  const { data, loading, error, refetch } = useQuery(LIST_ORDERS, {
    variables: {
      search: search || null,
      status: status || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      page: 1,
      limit: 50,
    },
    fetchPolicy: "network-only",
  });

  const ordersList = data?.listOrders?.items || [];
  const totalCount = data?.listOrders?.total || 0;

  useEffect(() => {
    if (onCountChange) {
      onCountChange(totalCount);
    }
  }, [totalCount, onCountChange]);

  return (
    <Show>
      <Show.If isTrue={loading && !data}>
        <View className="gap-2">
          {new Array(10).fill(0).map((_, i) => (
            <View key={i} className="flex-row items-center justify-between py-4">
              {/* Left side: Avatar & Info */}
              <View className="flex-row items-center gap-3.5 flex-1 mr-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <View className="flex-1 gap-1.5">
                  <Skeleton className="w-24 h-5 rounded-md" />
                  <Skeleton className="w-32 h-4 rounded-md" />
                </View>
              </View>

              {/* Right side: Amounts */}
              <View className="items-end gap-1.5 flex-shrink-0">
                <Skeleton className="w-16 h-5 rounded-md" />
                <Skeleton className="w-12 h-4 rounded-md" />
              </View>
            </View>
          ))}
        </View>
      </Show.If>

      <Show.ElseIf isTrue={error && !data}>
        <View className="flex-1 items-center justify-center py-16 px-4">
          <View className="w-14 h-14 rounded-full bg-red-500/10 items-center justify-center mb-4">
            <Feather name="alert-circle" size={28} color="#ff7b7b" />
          </View>
          <Text className="text-base text-noirText font-noir font-semibold mb-1">
            Failed to load transactions
          </Text>
          <Text className="text-[13px] text-gray-400 font-noir text-center mb-5 max-w-[280px]">
            {error?.message || "Something went wrong. Please check your connection."}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-noirMint px-5 py-2.5 rounded-full flex-row items-center gap-2"
            activeOpacity={0.8}
          >
            <Feather name="refresh-cw" size={14} color="#111418" />
            <Text className="text-[#111418] font-noir font-bold text-xs">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </Show.ElseIf>

      <Show.ElseIf isTrue={ordersList.length === 0}>
        <EmptyState search={search} onRefresh={refetch} />
      </Show.ElseIf>

      <Show.Else>
        <View style={{ paddingBottom: 24 }}>
          {ordersList.map((item) => (
            <TransactionCard key={item.id || item.orderId} item={item} />
          ))}
        </View>
      </Show.Else>
    </Show>
  );
}


