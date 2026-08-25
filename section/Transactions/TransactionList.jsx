import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Skeleton } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import TransactionCard from "./TransactionCard";
import Show from "../../components/Show";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { ThinArrowDown, DesertDuneSVG } from "../../utils/icons";

function EndState() {
  return (
    <View className="items-center justify-center gap-2">
      <DesertDuneSVG size={320} />
      <Text className="text-xs font-noir text-gray-400 font-medium tracking-wide">
        You've reached the bottom
      </Text>
    </View>
  );
}

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

function TransactionSkeletonCard() {
  return (
    <View className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 mb-3 gap-3">
      {/* Top Row: Icon + Order ID & Status Badge */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          <Skeleton className="w-11 h-11 rounded-xl" />
          <View className="flex-1 gap-1.5">
            <Skeleton className="w-24 h-5 rounded-md" />
            <Skeleton className="w-32 h-3.5 rounded-md" />
          </View>
        </View>

        {/* Status Badge */}
        <Skeleton className="w-20 h-6 rounded-full" />
      </View>

      {/* Divider */}
      <View className="h-px w-full bg-white/[0.04]" />

      {/* Bottom Row: INR Amount & USDT Amount */}
      <View className="flex-row items-center justify-between">
        <View className="gap-1.5">
          <Skeleton className="w-16 h-3 rounded-md" />
          <Skeleton className="w-24 h-5 rounded-md" />
        </View>

        <View className="items-end gap-1.5">
          <Skeleton className="w-20 h-3 rounded-md" />
          <Skeleton className="w-24 h-5 rounded-md" />
        </View>
      </View>
    </View>
  );
}

export default function TransactionList({
  ordersList = [],
  loading,
  error,
  hasActiveFilters,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}) {
  return (
    <Show>
      <Show.If isTrue={loading && ordersList.length === 0}>
        <View className="w-full">
          {new Array(10).fill(0).map((_, i) => (
            <TransactionSkeletonCard key={`init-${i}`} />
          ))}
        </View>
      </Show.If>

      <Show.ElseIf isTrue={error && ordersList.length === 0}>
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
        <EmptyState hasActiveFilters={hasActiveFilters} />
      </Show.ElseIf>

      <Show.Else>
        <FlatList
          data={ordersList}
          keyExtractor={(item) => item.id || item.orderId}
          renderItem={({ item }) => <TransactionCard item={item} />}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          ListFooterComponent={
            <View className="items-center justify-center min-h-[100px] -mb-3">
              <Show>
                <Show.If isTrue={hasMore}>
                  <HapticTouchableOpacity
                    onPress={onLoadMore}
                    disabled={loadingMore}
                    activeOpacity={0.7}
                    hapticType="light"
                    className="w-16 aspect-square rounded-full bg-white/[0.06] border border-white/10 items-center justify-center active:bg-white/[0.12]"
                  >
                    <Show>
                      <Show.If isTrue={loadingMore}>
                        <ActivityIndicator size="small" color="#baffd8" />
                      </Show.If>
                      <Show.Else>
                        <ThinArrowDown size={28} color="#baffd8" strokeWidth={1.2} />
                      </Show.Else>
                    </Show>
                  </HapticTouchableOpacity>
                </Show.If>
                <Show.Else>
                  <EndState />
                </Show.Else>
              </Show>
            </View>
          }
        />
      </Show.Else>
    </Show>
  );
}
