import { useEffect } from "react";
import { View, Text, Pressable, ScrollView, Keyboard } from "react-native";
import { BottomSheet } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { haptic } from "../../../utils/haptics";
import { maskText } from "../../../utils/helper";
import Show from "../../../components/Show";

/**
 * SelectAddressSheet — BottomSheet component for selecting a whitelisted crypto destination wallet.
 * Co-located in section/WithdrawSend/components/SelectAddressSheet.jsx.
 */
export default function SelectAddressSheet({
  isOpen,
  onOpenChange,
  addresses = [],
  selectedId,
  onSelect,
}) {
  const router = useRouter();

  // Dismiss keyboard when sheet opens so sheet is fully visible
  useEffect(() => {
    if (isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  const handleSelect = (addrObj) => {
    haptic.light();
    onSelect?.(addrObj);
    onOpenChange?.(false);
  };

  const handleAddNew = () => {
    haptic.light();
    onOpenChange?.(false);
    router.push({ pathname: "/accounts", params: { tab: "wallets" } });
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          {/* Header */}
          <View className="mb-6 gap-1.5 items-center">
            <BottomSheet.Title className="text-center font-noir-medium text-white text-lg">
              Select Payout Address
            </BottomSheet.Title>
            <BottomSheet.Description className="text-center font-noir text-sm text-gray-400">
              Choose a whitelisted TRC-20 destination address
            </BottomSheet.Description>
          </View>

          {/* Addresses List */}
          <View className="w-full gap-3 mb-6">
            <Show>
              <Show.If isTrue={addresses.length === 0}>
                <View className="items-center py-6 gap-2">
                  <Feather name="shield-off" size={26} color="rgba(255, 255, 255, 0.4)" />
                  <Text className="text-gray-400 font-noir text-sm text-center">
                    No whitelisted addresses found
                  </Text>
                </View>
              </Show.If>

              <Show.Else>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  className="max-h-[340px]"
                >
                  <View className="gap-2.5">
                    {addresses.map((item) => {
                      const isSelected = selectedId === item.id;
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => handleSelect(item)}
                          className={`w-full py-3.5 pl-3.5 pr-4 rounded-2xl flex-row items-center justify-between border active:opacity-75 ${
                            isSelected
                              ? "bg-[#13171a] border-noirMint/35"
                              : "bg-[#13171a]/60 border-white/[0.06]"
                          }`}
                        >
                          <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-2">
                            <View
                              className={`w-11 h-11 rounded-xl items-center justify-center ${
                                isSelected
                                  ? "bg-noirMint/10 border border-noirMint/25"
                                  : "bg-white/[0.04] border border-white/[0.06]"
                              }`}
                            >
                              <Feather
                                name="shield"
                                size={18}
                                color={isSelected ? "#baffd8" : "#9CA3AF"}
                              />
                            </View>
                            <View className="flex-1 min-w-0">
                              <View className="flex-row items-center gap-2 mb-0.5">
                                <Text className="font-noir font-semibold text-sm text-white">
                                  {item.label || "Whitelisted Wallet"}
                                </Text>
                                <View className="px-1.5 py-0.2 rounded bg-red-500/15 border border-red-500/30">
                                  <Text className="text-[9px] font-noir-medium text-red-400">
                                    TRC-20
                                  </Text>
                                </View>
                              </View>
                              <Text className="font-mono text-xs text-gray-400">
                                {maskText(item.address, 6)}
                              </Text>
                            </View>
                          </View>
                          {isSelected && (
                            <View className="w-6 h-6 rounded-full bg-noirMint/15 border border-noirMint/30 items-center justify-center">
                              <Feather name="check" size={13} color="#baffd8" />
                            </View>
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              </Show.Else>
            </Show>

            {/* Add New Address Action */}
            <Pressable
              onPress={handleAddNew}
              className="w-full bg-white/5 border border-dashed border-white/10 py-3 pl-3.5 pr-4 rounded-xl flex-row items-center justify-between active:opacity-75 mt-1"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-white/5 items-center justify-center">
                  <Feather name="plus" size={18} color="#baffd8" />
                </View>
                <Text className="text-white font-noir text-base -mb-0.5">
                  Add Whitelisted Address
                </Text>
              </View>
              <Feather
                name="arrow-up-right"
                size={16}
                color="rgba(255, 255, 255, 0.3)"
              />
            </Pressable>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
