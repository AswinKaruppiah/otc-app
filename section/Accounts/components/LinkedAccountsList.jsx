import { View } from "react-native";
import { Skeleton } from "heroui-native";
import Show from "../../../components/Show";
import EmptyState from "../../../components/EmptyState";
import BankCard from "./BankCard";

/**
 * LinkedAccountsList — Renders list of linked bank accounts using the standalone BankCard component.
 * Handles Loading, Error, Empty, and Data states.
 */
export default function LinkedAccountsList({
  loading = false,
  isRefreshing = false,
  error = null,
  accounts = [],
  refetch,
}) {
  return (
    <View className="w-full">
      <Show>
        {/* 1. Loading State */}
        <Show.If isTrue={loading && !isRefreshing && accounts.length === 0}>
          <View className="w-full gap-5">
            {[1, 2].map((key) => (
              <View
                key={key}
                className="w-full aspect-[1.65/1] bg-noirCard rounded-2xl p-6 border border-white/[0.06] justify-between"
              >
                <View className="flex-row justify-between items-center">
                  <Skeleton className="w-28 h-5 rounded-md" />
                  <Skeleton className="w-16 h-5 rounded-full" />
                </View>
                <Skeleton className="w-10 h-7 rounded-md my-1" />
                <Skeleton className="w-full h-7 rounded-lg mb-2" />
                <View className="flex-row justify-between items-end">
                  <View className="gap-1.5">
                    <Skeleton className="w-20 h-3 rounded-sm" />
                    <Skeleton className="w-32 h-4 rounded-md" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Show.If>

        {/* 2. Error State */}
        <Show.ElseIf isTrue={!!error && accounts.length === 0}>
          <EmptyState
            type="error"
            title="Failed to load bank accounts"
            description={error?.message || "Something went wrong while fetching details."}
            actionLabel="Retry"
            onAction={refetch}
          />
        </Show.ElseIf>

        {/* 3. Empty / No Data State */}
        <Show.ElseIf isTrue={!accounts || accounts.length === 0}>
          <EmptyState
            type="empty"
            icon="credit-card"
            title="No Bank Accounts Linked"
            description="You haven't linked any bank accounts yet. Tap the plus button above to connect your account."
          />
        </Show.ElseIf>

        {/* 4. Data State */}
        <Show.Else>
          <View className="w-full gap-5">
            {accounts.map((bank, index) => (
              <BankCard key={bank.id || index} bank={bank} index={index} />
            ))}
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}
