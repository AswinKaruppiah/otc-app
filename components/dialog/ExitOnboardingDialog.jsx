import { View } from "react-native";
import { Dialog, Button } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../utils/haptics";

export default function ExitOnboardingDialog({ isOpen, onOpenChange, onConfirm }) {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="bg-noirBg border border-white/[0.06] p-6 rounded-3xl max-w-[340px] self-center">
          {/* Amber warning icon badge */}
          <View className="items-center mt-2 mb-5">
            <View className="p-5 rounded-full bg-amber-500/10 border border-amber-500/[0.22] items-center justify-center">
              <Feather name="alert-circle" size={36} color="#f59e0b" className="shrink-0" />
            </View>
          </View>

          {/* Text */}
          <View className="mb-5 gap-2">
            <Dialog.Title className="text-white font-noir-medium text-2xl text-center">
              Exit Onboarding?
            </Dialog.Title>
            <Dialog.Description className="text-white/50 font-noir text-sm text-center leading-relaxed px-3">
              Are you sure you want to exit onboarding? Your progress will be lost.
            </Dialog.Description>
          </View>

          {/* Actions */}
          <View className="gap-2.5 mt-6">
            <Button
              variant="danger"
              onPress={() => {
                haptic.heavy();
                onConfirm();
              }}
              className="h-13 rounded-full"
            >
              Exit
            </Button>
            <Button
              variant="ghost"
              onPress={() => onOpenChange(false)}
              className="h-11 rounded-full"
            >
              Stay
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
