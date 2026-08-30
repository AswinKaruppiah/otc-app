import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Dialog } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

/**
 * Address elided in middle: TQp8...6zU1
 */
function elideAddress(addr) {
  if (!addr) return "";
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}····${addr.slice(-6)}`;
}

/**
 * SelectAddressDialog — Dialog modal for picking a whitelisted crypto destination wallet.
 */
export default function SelectAddressDialog({
  isOpen,
  onOpenChange,
  addresses = [],
  selectedId,
  onSelect,
}) {
  const router = useRouter();

  const handleSelect = (addrObj) => {
    onSelect?.(addrObj);
    onOpenChange?.(false);
  };

  const handleAddNew = () => {
    onOpenChange?.(false);
    router.push({ pathname: "/accounts/add-wallet", params: { tab: "wallets" } });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70" />
        <Dialog.Content
          isSwipeable={false}
          className="rounded-3xl p-5 w-[90vw] self-center max-h-[75vh]"
        >
          <View className="flex-row justify-between items-center mb-3">
            <Dialog.Title className="text-lg text-white font-noir-medium">
              Select Payout Address
            </Dialog.Title>
            <TouchableOpacity onPress={() => onOpenChange?.(false)}>
              <Feather name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Dialog.Description className="hidden">
            Choose a whitelisted crypto destination address
          </Dialog.Description>

          <ScrollView
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            style={{ maxHeight: 320 }}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {addresses.length === 0 ? (
              <View className="py-6 items-center">
                <Feather name="shield-off" size={28} color="#6B7280" className="mb-2" />
                <Text className="font-noir text-sm text-gray-400 text-center">
                  No whitelisted addresses found
                </Text>
              </View>
            ) : (
              addresses.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleSelect(item)}
                    className={`p-3.5 rounded-2xl mb-2.5 border ${
                      isSelected
                        ? "bg-noirMint/15 border-noirMint/40"
                        : "bg-white/5 border-white/10 active:bg-white/10"
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-noir font-semibold text-sm text-white">
                        {item.label || "Whitelisted Wallet"}
                      </Text>
                      <View className="px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/30">
                        <Text className="text-[10px] font-noir-medium text-red-400">
                          TRC-20
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="font-mono text-xs text-gray-400">
                        {elideAddress(item.address)}
                      </Text>
                      {isSelected && (
                        <Feather name="check-circle" size={16} color="#baffd8" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Add New Address Action */}
          <TouchableOpacity
            onPress={handleAddNew}
            className="mt-2 w-full py-3 bg-white/5 border border-white/10 rounded-xl flex-row items-center justify-center gap-2 active:bg-white/10"
          >
            <Feather name="plus" size={16} color="#baffd8" />
            <Text className="font-noir font-semibold text-xs text-noirMint">
              Add New Address
            </Text>
          </TouchableOpacity>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
