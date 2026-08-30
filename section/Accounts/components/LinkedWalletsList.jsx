import { useState } from "react";
import { View, Alert } from "react-native";
import { Skeleton, useToast } from "heroui-native";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import Show from "../../../components/Show";
import EmptyState from "../../../components/EmptyState";
import { REMOVE_WHITELISTED_ADDRESS } from "../../../apollo/mutation";
import { GET_USER_WHITELISTED_ADDRESSES } from "../../../apollo/query";
import { copyToClipboard } from "../../../utils/helper";
import WalletCard from "./WalletCard";

/**
 * LinkedWalletsList — Renders whitelisted crypto wallet addresses list using WalletCard.
 * Handles Loading, Error, Empty, and Data states.
 */
export default function LinkedWalletsList({
  loading = false,
  error = null,
  wallets = [],
  refetch,
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [removingId, setRemovingId] = useState(null);

  const [removeWalletAddress] = useMutation(REMOVE_WHITELISTED_ADDRESS, {
    refetchQueries: [{ query: GET_USER_WHITELISTED_ADDRESSES }],
  });

  const handleCopy = (address) => {
    copyToClipboard(address);
  };

  const handleRemove = (id, label) => {
    Alert.alert(
      "Remove Wallet",
      `Are you sure you want to remove "${label || "this wallet"}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setRemovingId(id);
            try {
              await removeWalletAddress({ variables: { addressId: id } });
              toast?.show({
                label: "Wallet Removed",
                description: "Whitelisted address removed successfully.",
                variant: "success",
              });
              refetch?.();
            } catch (err) {
              toast?.show({
                label: "Failed to Remove",
                description: err?.message || "Could not remove wallet address.",
                variant: "danger",
              });
            } finally {
              setRemovingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="w-full">
      <Show>
        {/* 1. Loading State */}
        <Show.If isTrue={loading}>
          <View className="w-full gap-4">
            <Skeleton className="w-full h-32 rounded-2xl" />
            <Skeleton className="w-full h-32 rounded-2xl" />
          </View>
        </Show.If>

        {/* 2. Error State */}
        <Show.ElseIf isTrue={!!error}>
          <EmptyState
            type="error"
            title="Failed to load crypto wallets"
            description={error?.message || "Something went wrong while fetching details."}
            actionLabel="Retry"
            onAction={refetch}
          />
        </Show.ElseIf>

        {/* 3. Empty State */}
        <Show.ElseIf isTrue={!wallets || wallets.length === 0}>
          <EmptyState
            type="empty"
            icon="shield"
            title="No Whitelisted Wallets"
            description="You haven't added any whitelisted crypto payout addresses yet. Tap the button below or plus icon above to add one."
            actionLabel="Add Wallet Address"
            onAction={() => router.push("/accounts/add-wallet")}
          />
        </Show.ElseIf>

        {/* 4. Data State */}
        <Show.Else>
          <View className="w-full gap-4">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id || wallet.address}
                wallet={wallet}
                onCopy={handleCopy}
                onRemove={handleRemove}
                isRemoving={removingId === wallet.id}
              />
            ))}
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}
