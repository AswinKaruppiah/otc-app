import { View } from "react-native";
import { Dialog, Button } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../utils/haptics";

/**
 * DeleteWalletDialog — HeroUI Dialog for confirming removal of a whitelisted crypto wallet address.
 */
export default function DeleteWalletDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  walletLabel = "this wallet",
  loading = false,
}) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="bg-noirBg border border-white/[0.06] p-6 rounded-3xl max-w-[340px] self-center">
          {/* Danger Icon Badge */}
          <View className="items-center mt-2 mb-5">
            <View className="p-5 rounded-full bg-red-500/10 border border-red-500/[0.22] items-center justify-center">
              <Feather name="trash-2" size={34} color="#ef4444" className="shrink-0" />
            </View>
          </View>

          {/* Text */}
          <View className="mb-2 gap-2">
            <Dialog.Title className="text-white font-noir-medium text-2xl text-center">
              Remove Wallet?
            </Dialog.Title>
            <Dialog.Description className="text-white/50 font-noir text-sm text-center leading-relaxed px-2">
              Are you sure you want to remove "{walletLabel}"? This whitelisted address will no longer be available for payouts.
            </Dialog.Description>
          </View>

          {/* Actions */}
          <View className="gap-2.5 mt-6">
            <Button
              variant="danger"
              isDisabled={loading}
              onPress={() => {
                haptic.heavy();
                onConfirm();
              }}
              className="h-13 rounded-full"
            >
              {loading ? "Removing..." : "Remove Wallet"}
            </Button>
            <Button
              variant="ghost"
              isDisabled={loading}
              onPress={() => onOpenChange(false)}
              className="h-11 rounded-full"
            >
              Cancel
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
