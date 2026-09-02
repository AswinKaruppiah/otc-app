import { forwardRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { truncateDecimal } from "../../../utils/helper";
import Show from "../../../components/Show";

/**
 * WithdrawAmountHero — Hero amount input display with available balance helper and validation.
 */
const WithdrawAmountHero = forwardRef(function WithdrawAmountHero(
  { amount, onChangeAmount, walletBalance, isExceeding, onQuickPercent },
  ref
) {
  return (
    <View className="items-center justify-center my-auto py-4">
      <View className="flex-row items-center justify-center">
        <TextInput
          ref={ref}
          value={amount}
          onChangeText={onChangeAmount}
          placeholder="0"
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          keyboardType="decimal-pad"
          autoFocus
          cursorColor="#baffd8"
          selectionColor="rgba(186, 255, 216, 0.35)"
          className="text-[52px] leading-tight font-noir font-light text-white tracking-tight text-center bg-transparent min-w-[80px] max-w-[320px] p-0"
        />
      </View>

      {/* Available Balance Subtext */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onQuickPercent(1.0)}
        className="flex-row items-center gap-1.5 mt-2.5"
      >
        <Text className="text-[13px] font-noir text-gray-400">
          Available for withdraw: {truncateDecimal(walletBalance, 2)} USDT
        </Text>
      </TouchableOpacity>

      {/* Validation Alert */}
      <Show>
        <Show.If isTrue={isExceeding}>
          <Text className="text-xs font-noir text-red-400 mt-2">
            Exceeds available balance ({truncateDecimal(walletBalance, 2)} USDT)
          </Text>
        </Show.If>
      </Show>
    </View>
  );
});

export default WithdrawAmountHero;
