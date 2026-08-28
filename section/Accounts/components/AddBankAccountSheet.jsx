import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
  TextInput,
} from "react-native";
import { BottomSheet, useToast } from "heroui-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import Show from "../../../components/Show";
import { ADD_BANK_ACCOUNT } from "../../../apollo/mutation";
import { MY_BANK_ACCOUNTS } from "../../../apollo/query";
import { BANK_OPTIONS, ACCOUNT_TYPE_OPTIONS } from "../../../constants/banks";
import SelectBankDialog from "../../../components/dialog/SelectBankDialog";



/**
 * AddBankAccountSheet — Bottom sheet form to collect new bank account details from user.
 * Uses heroui-native Select component for Bank selection.
 */
export default function AddBankAccountSheet({
  isOpen,
  onOpenChange,
}) {
  const { toast } = useToast();
  const [addBankAccount, { loading }] = useMutation(ADD_BANK_ACCOUNT);

  // Individual Form Field States (Optimized to prevent re-render glitches during rapid typing/deleting)
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("savings");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const resetForm = () => {
    Keyboard.dismiss();
    setBankName("");
    setAccountType("savings");
    setAccountHolderName("");
    setAccountNumber("");
    setIfscCode("");
  };

  const handleClose = () => {
    Keyboard.dismiss();
    resetForm();
    onOpenChange?.(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (!bankName) {
      toast?.show({
        label: "Missing Bank Name",
        description: "Please select your bank.",
        variant: "danger",
      });
      return;
    }

    if (!accountHolderName.trim()) {
      toast?.show({
        label: "Missing Holder Name",
        description: "Please enter the account holder name.",
        variant: "danger",
      });
      return;
    }

    if (!accountNumber || accountNumber.length < 6 || accountNumber.length > 18) {
      toast?.show({
        label: "Invalid Account Number",
        description: "Account number must be between 6 and 18 digits.",
        variant: "danger",
      });
      return;
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const cleanIfsc = ifscCode.trim().toUpperCase();
    if (!ifscRegex.test(cleanIfsc)) {
      toast?.show({
        label: "Invalid IFSC Code",
        description: "Please enter a valid 11-digit IFSC code (e.g. SBIN0001234).",
        variant: "danger",
      });
      return;
    }

    try {
      const selectedBankObj = BANK_OPTIONS.find((b) => b.key === bankName);
      const selectedBankLabel = selectedBankObj?.label || bankName;

      await addBankAccount({
        variables: {
          input: {
            bankName: selectedBankLabel,
            accountType,
            accountHolderName: accountHolderName.trim(),
            accountNumber: accountNumber.trim(),
            ifscCode: cleanIfsc,
          },
        },
        update(cache, { data }) {
          const newBankAccount = data?.addBankAccount;
          if (!newBankAccount) return;

          try {
            const existingData = cache.readQuery({
              query: MY_BANK_ACCOUNTS,
            });

            if (existingData?.myBankAccounts) {
              cache.writeQuery({
                query: MY_BANK_ACCOUNTS,
                data: {
                  myBankAccounts: [newBankAccount, ...existingData.myBankAccounts],
                },
              });
            }
          } catch (err) {
            // Safe fallback if query not in cache yet
          }
        },
      });

      toast?.show({
        label: "Success",
        description: "Bank account added successfully!",
        variant: "success",
      });

      handleClose();
    } catch (error) {
      toast?.show({
        label: "Error",
        description: error?.message || "Failed to add bank account.",
        variant: "danger",
      });
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onOpenChange={(openState) => {
        if (!openState) {
          Keyboard.dismiss();
        }
        onOpenChange?.(openState);
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={["75%"]}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full"
          keyboardBehavior="extend"
        >
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="mb-6 gap-1 items-center">
              <BottomSheet.Title className="text-center font-noir-medium text-white text-xl">
                Add Bank Account
              </BottomSheet.Title>
              <BottomSheet.Description className="text-center font-noir text-xs text-gray-400">
                Enter bank details for verified fiat settlements (Max 3 accounts)
              </BottomSheet.Description>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View className="gap-4 w-full">
                {/* 1. Bank Name Selection via heroui-native Select */}
                <View className="gap-1.5">
                  <Text className="text-xs font-noir font-semibold text-gray-300">
                    Bank Name *
                  </Text>
                  <BankSelect
                    value={bankName}
                    onValueChange={setBankName}
                  />
                </View>

                {/* 2. Account Type Selector */}
                <View className="gap-1.5">
                  <Text className="text-xs font-noir font-semibold text-gray-300">
                    Account Type *
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {ACCOUNT_TYPE_OPTIONS.map((opt) => {
                      const isSelected = accountType === opt.key;
                      return (
                        <TouchableOpacity
                          key={opt.key}
                          onPress={() => setAccountType(opt.key)}
                          activeOpacity={0.8}
                          className={`rounded-lg overflow-hidden border ${isSelected ? "border-transparent" : "border-white/10 bg-white/5"
                            }`}
                        >
                          <Show>
                            <Show.If isTrue={isSelected}>
                              <LinearGradient
                                colors={["#baffd8", "#6df0a3"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="px-3.5 py-2 items-center justify-center"
                              >
                                <Text className="font-noir-medium text-xs text-[#0b0e11]">
                                  {opt.label}
                                </Text>
                              </LinearGradient>
                            </Show.If>
                            <Show.Else>
                              <View className="px-3.5 py-2 items-center justify-center active:bg-white/[0.04]">
                                <Text className="font-noir text-xs text-gray-400">
                                  {opt.label}
                                </Text>
                              </View>
                            </Show.Else>
                          </Show>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Account Holder Name */}
                <View className="gap-1.5">
                  <Text className="text-xs font-noir font-semibold text-gray-300">
                    Account Holder Name *
                  </Text>
                  <TextInput
                    value={accountHolderName}
                    onChangeText={setAccountHolderName}
                    placeholder="Enter full name as per bank records"
                    placeholderTextColor="#6B7280"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-noir text-sm text-white"
                  />
                </View>

                {/* 4. Account Number */}
                <View className="gap-1.5">
                  <Text className="text-xs font-noir font-semibold text-gray-300">
                    Account Number *
                  </Text>
                  <TextInput
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="number-pad"
                    placeholder="Enter account number"
                    placeholderTextColor="#6B7280"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-noir text-sm text-white"
                  />
                </View>

                {/* 5. IFSC Code */}
                <View className="gap-1.5">
                  <Text className="text-xs font-noir font-semibold text-gray-300">
                    IFSC Code *
                  </Text>
                  <TextInput
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    autoCapitalize="characters"
                    maxLength={11}
                    placeholder="e.g. SBIN0001234"
                    placeholderTextColor="#6B7280"
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-noir text-sm text-white"
                  />
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={handleClose}
                    disabled={loading}
                    className="flex-1 h-12 bg-white/10 rounded-xl items-center justify-center border border-white/10"
                  >
                    <Text className="font-noir font-semibold text-sm text-gray-300">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="flex-1 h-12 bg-noirMint rounded-xl items-center justify-center shadow-lg shadow-noirMint/20 active:opacity-80"
                  >
                    {loading ? (
                      <ActivityIndicator color="#111418" size="small" />
                    ) : (
                      <Text className="font-noir font-bold text-sm text-[#111418]">
                        Add Account
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </BottomSheetScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

/**
 * BankSelect — Helper component rendering bank select trigger button and delegating dialog to SelectBankDialog.
 */
function BankSelect({ value, onValueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedBankObj = BANK_OPTIONS.find((b) => b.key === value);

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(true);
        }}
        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 flex-row items-center justify-between"
      >
        <Text
          className={`font-noir text-sm ${selectedBankObj ? "text-white" : "text-gray-500"
            }`}
        >
          {selectedBankObj?.label || "Select your bank"}
        </Text>
        <Feather name="chevron-down" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      {/* Standalone SelectBankDialog Component */}
      <SelectBankDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        value={value}
        onSelect={onValueChange}
      />
    </>
  );
}
