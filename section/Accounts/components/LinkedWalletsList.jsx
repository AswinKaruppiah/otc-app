import { useState } from "react";
import { View } from "react-native";
import { Skeleton, useToast } from "heroui-native";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "expo-router";
import Show from "../../../components/Show";
import EmptyState from "../../../components/EmptyState";
import { REMOVE_WHITELISTED_ADDRESS } from "../../../apollo/mutation";
import { copyToClipboard } from "../../../utils/helper";
import WalletCard from "./WalletCard";
import DeleteWalletDialog from "../../../components/dialog/DeleteWalletDialog";

/**
 * LinkedWalletsList — Renders whitelisted crypto wallet addresses list using WalletCard.
 * Uses HeroUI DeleteWalletDialog for deletion confirmation.
 */
export default function LinkedWalletsList({
  loading = false,
  error = null,
  wallets = [],
  refetch,
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const [removeWalletAddress] = useMutation(REMOVE_WHITELISTED_ADDRESS);

  const handleCopy = (address) => {
    copyToClipboard(address);
  };

  const handleRemovePress = (id, label) => {
    setDeleteTarget({ id, label });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    const targetId = deleteTarget.id;
    setRemovingId(targetId);
    try {
      await removeWalletAddress({ variables: { addressId: targetId } });
      toast?.show({
        label: "Wallet Removed",
        description: "Whitelisted address removed successfully.",
        variant: "success",
      });
      setDeleteTarget(null);
    } catch (err) {
      toast?.show({
        label: "Failed to Remove",
        description: err?.message || "Could not remove wallet address.",
        variant: "danger",
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <View className="w-full">
      <Show>
        {/* 1. Loading State */}
        <Show.If isTrue={loading}>
          <View className="w-full gap-4">
            <Skeleton className="w-full h-56 rounded-3xl" />
            <Skeleton className="w-full h-56 rounded-3xl" />
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
                onRemove={handleRemovePress}
                isRemoving={removingId === wallet.id}
              />
            ))}
          </View>
        </Show.Else>
      </Show>

      {/* HeroUI Delete Confirmation Dialog */}
      <DeleteWalletDialog
        isOpen={!!deleteTarget}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        walletLabel={deleteTarget?.label}
        loading={!!removingId}
      />
    </View>
  );
}
