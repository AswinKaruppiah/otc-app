import { View, Text, Pressable } from "react-native";
import { BottomSheet, Skeleton } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import { haptic } from "../../utils/haptics";
import { useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import { MY_BANK_ACCOUNTS } from "../../apollo/query";
import Show from "../../components/Show";

/**
 * SelectBank — A premium bottom sheet component that displays the user's linked bank accounts
 * and allows selecting one. Reuses the application's Noir design tokens.
 *
 * @param {boolean} isOpen - Controls visibility of the bottom sheet.
 * @param {function} onOpenChange - Callback function triggered when sheet open status changes.
 * @param {string} selectedBankId - The ID of the currently selected bank.
 * @param {function} onSelectBank - Callback function triggered when a bank is selected.
 * @param {Array} banks - List of banks to render (optional).
 */
export default function SelectBank({
  isOpen,
  onOpenChange,
  onSelectBank,
}) {
  const router = useRouter();

  const { data, loading, error } = useQuery(MY_BANK_ACCOUNTS, {
    skip: !isOpen,
  });

  const displayedBanks = data?.myBankAccounts || [];

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
            <Show>
              <Show.If isTrue={loading}>
                <View className="gap-3">
                  {[1, 2].map((i) => (
                    <View
                      key={i}
                      className="w-full py-3 pl-3 pr-5 rounded-xl flex-row items-center justify-between border bg-noirBg border-noirMint/10"
                    >
                      <View className="flex-row items-center gap-3">
                        <Skeleton className="w-14 h-14 rounded-lg" />
                        <View className="gap-1.5">
                          <Skeleton className="w-28 h-5 rounded-md" />
                          <Skeleton className="w-20 h-4 rounded-md" />
                        </View>
                      </View>
                      <Feather
                        name="chevron-right"
                        size={16}
                        color="rgba(255, 255, 255, 0.3)"
                      />
                    </View>
                  ))}
                </View>
              </Show.If>

              <Show.ElseIf isTrue={!!error}>
                <View className="items-center py-6 gap-2">
                  <Feather name="alert-circle" size={26} color="#ffb3ba" />
                  <Text className="text-red-400 font-noir text-sm text-center">
                    Failed to load bank accounts
                  </Text>
                </View>
              </Show.ElseIf>

              <Show.ElseIf isTrue={displayedBanks.length === 0}>
                <View className="items-center py-6 gap-2">
                  <Feather name="info" size={24} color="rgba(255, 255, 255, 0.4)" />
                  <Text className="text-gray-400 font-noir text-sm text-center">
                    No bank accounts linked yet
                  </Text>
                </View>
              </Show.ElseIf>

              <Show.Else>
                {displayedBanks.map((bank, index) => {
                  const colors = ["#baffd8", "#96dded", "#ffc4d6", "#e8caff"];
                  const iconColor = bank.iconColor || colors[index % colors.length];
                  const type = bank.accountType || bank.type || "Checking Account";
                  const icon = bank.icon || (type.toLowerCase().includes("saving") ? "briefcase" : "home");
                  const accountNum = bank.accountNumberMasked || bank.accountNum || (bank.accountNumber ? `•••• ${bank.accountNumber.slice(-4)}` : "");

                  return (
                    <Pressable
                      key={bank.id}
                      onPress={() => handleSelect(bank)}
                      className={`w-full py-3 pl-3 pr-5 rounded-xl flex-row items-center justify-between border active:opacity-75 bg-noirBg border-noirMint/10`}
                    >
                      <View className="flex-row items-center gap-3">
                        <View
                          className="w-14 aspect-square rounded-lg items-center justify-center"
                          style={{ backgroundColor: `${iconColor}15` }}
                        >
                          <Feather name={icon} size={22} color={iconColor} />
                        </View>
                        <View>
                          <Text className="text-white font-noir text-base leading-tight">
                            {bank.bankName}
                          </Text>
                          <Text className="text-gray-400 font-noir text-xs mt-0.5">
                            {type} • {accountNum}
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
              </Show.Else>
            </Show>

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
