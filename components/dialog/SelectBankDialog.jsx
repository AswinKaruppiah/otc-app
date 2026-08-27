import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Dialog } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { BANK_OPTIONS } from "../../constants/banks";

/**
 * SelectBankDialog — Dialog modal for selecting an Indian Bank with live search filtering.
 */
export default function SelectBankDialog({ isOpen, onOpenChange, value, onSelect }) {
  const [search, setSearch] = useState("");

  const filteredBanks = BANK_OPTIONS.filter((b) =>
    b.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (bankKey) => {
    onSelect?.(bankKey);
    onOpenChange?.(false);
    setSearch("");
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
              Select Bank
            </Dialog.Title>
            <TouchableOpacity onPress={() => onOpenChange?.(false)}>
              <Feather name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Dialog.Description className="hidden">
            Choose your bank from the list
          </Dialog.Description>

          {/* Search Input */}
          <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 h-10 mb-3">
            <Feather name="search" size={16} color="#9CA3AF" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search bank..."
              placeholderTextColor="#6B7280"
              className="flex-1 font-noir text-sm text-white h-full ml-2"
            />
            {!!search && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Feather name="x" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            style={{ maxHeight: 350 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {filteredBanks.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="font-noir text-sm text-gray-400">
                  No banks found
                </Text>
              </View>
            ) : (
              filteredBanks.map((opt) => {
                const isSelected = value === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => handleSelect(opt.key)}
                    className={`flex-row items-center justify-between py-3 px-2 rounded-xl mb-1 ${
                      isSelected ? "bg-noirMint/15" : "active:bg-white/5"
                    }`}
                  >
                    <Text
                      className={`font-noir text-sm ${
                        isSelected ? "text-noirMint font-semibold" : "text-gray-200"
                      }`}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={16} color="#baffd8" />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
