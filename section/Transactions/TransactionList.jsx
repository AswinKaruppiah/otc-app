import { useEffect } from "react";
import { View, Text } from "react-native";
import { useQuery } from "@apollo/client/react";
import { Skeleton } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { LIST_ORDERS } from "../../apollo/query";
import TransactionCard from "./TransactionCard";
import Show from "../../components/Show";

function EmptyState({ hasActiveFilters }) {
  return (
    <View className="items-center justify-center py-16 px-6">
      <View className="mb-6 items-center justify-center">
        <Feather
          name={hasActiveFilters ? "search" : "inbox"}
          size={156}
          color="rgba(186, 255, 216, 0.2)"
        />
      </View>
      <Text className="text-lg text-noirText font-noir font-bold mb-2 text-center">
        {hasActiveFilters ? "No results found" : "No transactions yet"}
      </Text>
      <Text className="text-sm text-gray-400 font-noir text-center max-w-[280px] leading-5">
        {hasActiveFilters
          ? "We couldn't find any trades matching your filter criteria."
          : "Your trade transactions history will show up here once you start."}
      </Text>
    </View>
  );
}

export default function TransactionList({ search, status, dateFrom, dateTo, onCountChange }) {
  const { data, loading, error, refetch } = useQuery(LIST_ORDERS, {
    variables: {
      search: search || null,
      status: status ? [status] : null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      page: 1,
      limit: 10,
    },
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
        <View className="items-center justify-center py-16 px-6">
          <View className="mb-6 items-center justify-center">
            <Feather
              name="alert-circle"
              size={156}
              color="rgba(255, 123, 123, 0.2)"
            />
          </View>
          <Text className="text-lg text-noirText font-noir font-bold mb-2 text-center">
            Failed to load transactions
          </Text>
          <Text className="text-sm text-gray-400 font-noir text-center max-w-[280px] leading-5">
            {error?.message || "Something went wrong. Please try again later."}
          </Text>
        </View>
      </Show.ElseIf>

      <Show.ElseIf isTrue={ordersList.length === 0}>
        <EmptyState
          hasActiveFilters={!!search || !!status || !!dateFrom || !!dateTo}
        />
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


