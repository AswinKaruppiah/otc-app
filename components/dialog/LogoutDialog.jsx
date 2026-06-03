import { View } from "react-native";
import { Dialog, Button } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";

export default function LogoutDialog({ isOpen, onOpenChange, onConfirm }) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="bg-noirBg border border-white/[0.06] p-6 rounded-3xl max-w-[340px] self-center">
          {/* Danger icon badge */}
          <View className="items-center mt-2 mb-5">
            <View className="p-5 rounded-full bg-red-500/10 border border-red-500/[0.22] items-center justify-center">
              <Feather name="log-out" size={36} color="#ef4444" className="shrink-0" />
            </View>
          </View>

          {/* Text */}
          <View className="mb-5 gap-2">
            <Dialog.Title className="text-white font-noir-medium text-2xl text-center">
              Sign Out?
            </Dialog.Title>
            <Dialog.Description className="text-white/50 font-noir text-sm text-center leading-relaxed px-3">
              You'll need to sign back in with Google to access your wallets.
            </Dialog.Description>
          </View>

          {/* Actions — stacked, destructive first */}
          <View className="gap-2.5 mt-6">
            <Button
              variant="danger"
              onPress={onConfirm}
              className="h-13 rounded-full"
            >
              Sign Out
            </Button>
            <Button
              variant="ghost"
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
