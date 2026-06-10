import { View, Text, Pressable } from "react-native";
import { BottomSheet } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../utils/haptics";
import { useRouter } from "expo-router";

/**
 * SelectBank — A premium bottom sheet component that displays the user's linked bank accounts
 * and allows selecting one. Reuses the application's Noir design tokens.
 *
 * @param {boolean} isOpen - Controls visibility of the bottom sheet.
 * @param {function} onOpenChange - Callback function triggered when sheet open status changes.
 * @param {string} selectedBankId - The ID of the currently selected bank.
 * @param {function} onSelectBank - Callback function triggered when a bank is selected.
 * @param {Array} banks - List of banks to render (optional, defaults to mock banks).
 */
export default function SelectBank({
  isOpen,
  onOpenChange,
  onSelectBank,
  banks = [
    {
      id: "1",
      bankName: "Chase Bank",
      type: "Checking Account",
      accountNum: "•••• 8821",
      routingNum: "021000021",
      status: "Primary",
      icon: "home",
      iconColor: "#baffd8",
    },
    {
      id: "2",
      bankName: "Wells Fargo",
      type: "Savings Account",
      accountNum: "•••• 4302",
      routingNum: "121000248",
      status: "Secondary",
      icon: "briefcase",
      iconColor: "#96dded",
    },
  ],
}) {
  const router = useRouter();

  const handleSelect = (bank) => {
    haptic.light();
    onSelectBank?.(bank);
    onOpenChange?.(false);
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          {/* Header */}
          <View className="mb-6 gap-1.5 items-center">
            <BottomSheet.Title className="text-center font-noir-medium text-white text-lg">
              Select Bank Account
            </BottomSheet.Title>
            <BottomSheet.Description className="text-center font-noir text-sm text-gray-400">
              Choose an account for your transfer
            </BottomSheet.Description>
          </View>

          {/* Banks List */}
          <View className="w-full gap-3 mb-6">
            {banks.map((bank) => {
              return (
                <Pressable
                  key={bank.id}
                  onPress={() => handleSelect(bank)}
                  className={`w-full py-3 pl-3 pr-5 rounded-xl flex-row items-center justify-between border active:opacity-75 bg-noirBg border-noirMint/10`}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-14 aspect-square rounded-lg items-center justify-center"
                      style={{ backgroundColor: `${bank.iconColor}15` }}
                    >
                      <Feather name={bank.icon} size={22} color={bank.iconColor} />
                    </View>
                    <View>
                      <Text className="text-white font-noir text-base leading-tight">
                        {bank.bankName}
                      </Text>
                      <Text className="text-gray-400 font-noir text-xs mt-0.5">
                        {bank.type} • {bank.accountNum}
                      </Text>
                    </View>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color="rgba(255, 255, 255, 0.3)"
                  />
                </Pressable>
              );
            })}

            {/* Add Bank Action */}
            <Pressable
              onPress={() => {
                haptic.light();
                onOpenChange?.(false);
                router.push("/bank");
              }}
              className="w-full bg-white/5 border border-dashed border-white/10 py-3 pl-3 pr-5 rounded-xl flex-row items-center justify-between active:opacity-75 mt-1"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-white/5 items-center justify-center">
                  <Feather name="plus" size={18} color="#baffd8" />
                </View>
                <Text className="text-white font-noir text-base -mb-0.5">
                  Link New Bank Account
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
