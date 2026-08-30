import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, findNodeHandle } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import Show from "../../../components/Show";
import { ACCOUNT_TYPE_OPTIONS } from "../../../constants/banks";
import { useScrollViewRef } from "../../../context/ScrollContext";

/**
 * AddBankForm — Modular form fields and action buttons for adding a bank account.
 * Implements auto-scrolling to active inputs when soft keyboard appears.
 */
export default function AddBankForm({
  bankName,
  selectedBankObj,
  onOpenBankDialog,
  accountType,
  setAccountType,
  accountHolderName,
  setAccountHolderName,
  accountNumber,
  setAccountNumber,
  ifscCode,
  setIfscCode,
  loading,
  onSubmit,
  onCancel,
}) {
  const scrollViewRef = useScrollViewRef();

  const handleInputFocus = (e) => {
    const targetHandle = findNodeHandle(e.target);
    setTimeout(() => {
      if (scrollViewRef?.current) {
        if (targetHandle) {
          scrollViewRef.current?.getScrollResponder()?.scrollResponderScrollNativeHandleToKeyboard(
            targetHandle,
            120, // offset above soft keyboard
            true
          );
        } else {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }
    }, 150);
  };

  const canSubmit =
    Boolean(selectedBankObj) &&
    Boolean(accountType) &&
    accountHolderName.trim().length > 0 &&
    accountNumber.trim().length > 0 &&
    ifscCode.trim().length > 0 &&
    !loading;

  return (
    <View className="w-full flex-1 justify-between">
      {/* Form Inputs Group */}
      <View className="gap-5 w-full">
        {/* 1. Bank Selector */}
        <View className="gap-2">
          <Text className="text-xs font-noir font-semibold text-gray-300">
            Bank Name *
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onOpenBankDialog}
            className="w-full h-13 bg-white/5 border border-white/10 rounded-xl px-4 flex-row items-center justify-between"
          >
            <Text
              className={`font-noir text-sm ${
                selectedBankObj ? "text-white" : "text-gray-500"
              }`}
            >
              {selectedBankObj?.label || "Select your bank"}
            </Text>
            <Feather name="chevron-down" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* 2. Account Type Selector */}
        <View className="gap-2">
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
                  className={`rounded-xl overflow-hidden border ${
                    isSelected ? "border-transparent" : "border-white/10 bg-white/5"
                  }`}
                >
                  <Show>
                    <Show.If isTrue={isSelected}>
                      <LinearGradient
                        colors={["#baffd8", "#6df0a3"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="px-4 py-2.5 items-center justify-center"
                      >
                        <Text className="font-noir-medium text-xs text-[#0b0e11]">
                          {opt.label}
                        </Text>
                      </LinearGradient>
                    </Show.If>
                    <Show.Else>
                      <View className="px-4 py-2.5 items-center justify-center active:bg-white/[0.04]">
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
        <View className="gap-2">
          <Text className="text-xs font-noir font-semibold text-gray-300">
            Account Holder Name *
          </Text>
          <TextInput
            value={accountHolderName}
            onChangeText={setAccountHolderName}
            onFocus={handleInputFocus}
            placeholder="Enter full name as per bank records"
            placeholderTextColor="#6B7280"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-noir text-sm text-white"
          />
        </View>

        {/* 4. Account Number */}
        <View className="gap-2">
          <Text className="text-xs font-noir font-semibold text-gray-300">
            Account Number *
          </Text>
          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            onFocus={handleInputFocus}
            keyboardType="number-pad"
            placeholder="Enter account number"
            placeholderTextColor="#6B7280"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-noir text-sm text-white"
          />
        </View>

        {/* 5. IFSC Code */}
        <View className="gap-2">
          <Text className="text-xs font-noir font-semibold text-gray-300">
            IFSC Code *
          </Text>
          <TextInput
            value={ifscCode}
            onChangeText={setIfscCode}
            onFocus={handleInputFocus}
            autoCapitalize="characters"
            maxLength={11}
            placeholder="e.g. SBIN0001234"
            placeholderTextColor="#6B7280"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-noir text-sm text-white"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3 mt-auto pt-6">
        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-full items-center justify-center active:bg-white/10"
        >
          <Text className="font-noir font-semibold text-sm text-gray-300">
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          className={`flex-1 py-4 rounded-full flex-row items-center justify-center gap-2 ${
            canSubmit
              ? "bg-noirMint shadow-lg shadow-noirMint/20 active:opacity-80"
              : "bg-noirMint/20 opacity-40"
          }`}
        >
          <Show>
            <Show.If isTrue={loading}>
              <ActivityIndicator color="#111418" size="small" />
            </Show.If>
            <Show.Else>
              <Feather name="plus-circle" size={18} color="#111418" />
              <Text className="font-noir font-bold text-sm text-[#111418]">
                Add Account
              </Text>
            </Show.Else>
          </Show>
        </TouchableOpacity>
      </View>
    </View>
  );
}
