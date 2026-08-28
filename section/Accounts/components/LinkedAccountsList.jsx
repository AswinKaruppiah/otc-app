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
  error = null,
  accounts = [],
  refetch,
}) {
  return (
    <View className="w-full">
      <Show>
        {/* 1. Loading State — Single Minimal Card Skeleton */}
        <Show.If isTrue={loading}>
          <View className="w-full gap-5">
            <Skeleton className="w-full aspect-[1.65/1] rounded-2xl" />
            <Skeleton className="w-full aspect-[1.65/1] rounded-2xl" />
            <Skeleton className="w-full aspect-[1.65/1] rounded-2xl" />
          </View>
        </Show.If>

        {/* 2. Error State */}
        <Show.ElseIf isTrue={!!error}>
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
            {accounts.map((bank, index) => {
              // Backend returns newest first (.sort({ createdAt: -1 })).
              // Reversing the index ensures existing cards keep their colors when new cards arrive.
              const colorIndex = accounts.length - 1 - index;
              return (
                <BankCard
                  key={bank.id || bank.accountNumber || index}
                  bank={bank}
                  index={colorIndex}
                />
              );
            })}
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}
