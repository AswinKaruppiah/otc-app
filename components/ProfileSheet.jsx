import { Animated, Text, Pressable, View } from "react-native";
import { Skeleton, BottomSheet, Button } from "heroui-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../utils/haptics";
import { getInitials } from "../utils/helper";
import { useRouter, usePathname } from "expo-router";
import Show from "./Show";

// Routes where the profile bottom sheet is disabled
const HIDE_PROFILE_SHEET_ROUTES = ["/order"];

/**
 * ProfileSheet — Premium profile/account management bottom sheet that allows users
 * to view their details, navigate to their linked accounts, and trigger signout.
 */
export default function ProfileSheet({
  isOpen,
  onOpenChange,
  user,
  loading,
  rightScale,
  rightTranslateY,
  onLogoutPress,
  disabled,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isProfileDisabled = disabled || HIDE_PROFILE_SHEET_ROUTES.includes(pathname);

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Trigger asChild>
        <Animated.View
          style={{
            transform: [
              { scale: rightScale },
              { translateY: rightTranslateY },
            ],
          }}
        >
          <Pressable
            onPress={() => {
              if (isProfileDisabled) return;
              onOpenChange(true);
            }}
            disabled={isProfileDisabled}
            className={isProfileDisabled ? "" : "active:opacity-75"}
          >
            <Show>
              <Show.If isTrue={loading}>
                <Skeleton className="w-10 h-10 rounded-full" />
              </Show.If>
              <Show.ElseIf isTrue={user}>
                <View
                  className="w-11 aspect-square rounded-full overflow-hidden"
                  style={{
                    borderRadius: 9999,
                    shadowColor: "#10b981",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.35,
                    shadowRadius: 5,
                    elevation: 3,
                  }}
                >
                  <LinearGradient
                    colors={["#052e16", "#065f38", "#10b981", "#6ee7b7", "#baffd8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="w-full h-full rounded-full items-center justify-center border border-white/25"
                    style={{ borderRadius: 9999 }}
                  >
                    <Text
                      style={{
                        includeFontPadding: false,
                        textAlign: "center",
                        textAlignVertical: "center",
                        lineHeight: 14,
                      }}
                      className="text-white font-noir-medium font-bold text-lg"
                    >
                      {getInitials(user?.fullName)}
                    </Text>
                  </LinearGradient>
                </View>
              </Show.ElseIf>
            </Show>
          </Pressable>
        </Animated.View>
      </BottomSheet.Trigger>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="items-center mb-5">
            <View
              className="w-24 h-24 aspect-square rounded-full overflow-hidden"
              style={{
                borderRadius: 9999,
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <LinearGradient
                colors={["#052e16", "#065f38", "#10b981", "#6ee7b7", "#baffd8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-full rounded-full items-center justify-center border-2 border-white/25"
                style={{ borderRadius: 9999 }}
              >
                <Text
                  style={{
                    includeFontPadding: false,
                    textAlign: "center",
                    textAlignVertical: "center",
                    lineHeight: 28,
                  }}
                  className="text-white font-noir-medium font-bold text-4xl"
                >
                  {getInitials(user?.fullName)}
                </Text>
              </LinearGradient>
            </View>
          </View>
          <View className="mb-8 gap-2 items-center">
            <BottomSheet.Title className="text-center font-noir-medium">
              {user?.fullName ?? "My Account"}
            </BottomSheet.Title>
            <BottomSheet.Description className="text-center font-noir">
              {user?.email ?? ""}
            </BottomSheet.Description>
          </View>
          <View className="w-full gap-3 mb-6">
            <Pressable
              onPress={() => {
                onOpenChange(false);
                router.push("/accounts");
              }}
              className="w-full bg-white/5 border border-white/[0.04] py-4 px-5 rounded-full flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3">
                <Feather name="plus-circle" size={24} color="#baffd8" />
                <Text className="text-white font-noir text-base -mb-0.5">
                  Accounts & Wallets
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>

            <Pressable
              onPress={() => {
                onOpenChange(false);
                router.push("/kyc-guide");
              }}
              className="w-full bg-white/5 border border-white/[0.04] py-4 px-5 rounded-full flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3">
                <Feather name="shield" size={24} color="#baffd8" />
                <Text className="text-white font-noir text-base -mb-0.5">
                  KYC Guide
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>

            <Pressable
              onPress={() => {
                onOpenChange(false);
                router.push("/support");
              }}
              className="w-full bg-white/5 border border-white/[0.04] py-4 px-5 rounded-full flex-row items-center justify-between active:opacity-75"
            >
              <View className="flex-row items-center gap-3">
                <Feather name="help-circle" size={24} color="#96dded" />
                <Text className="text-white font-noir text-base -mb-0.5">
                  Support
                </Text>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>
          </View>
          <View className="h-px bg-white/5 mb-8" />

          <Button
            variant="danger-soft"
            onPress={() => {
              haptic.warning();
              onOpenChange(false);
              setTimeout(() => onLogoutPress(), 200);
            }}
            className="h-14 rounded-full"
          >
            Log Out
          </Button>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
