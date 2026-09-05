import { forwardRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { truncateDecimal } from "../../../utils/helper";

/**
 * WithdrawAmountHero — Hero amount input display with available balance helper and validation.
 */
const WithdrawAmountHero = forwardRef(function WithdrawAmountHero(
  { amount, onChangeAmount, walletBalance, isExceeding, onQuickPercent },
  ref
) {

  return (
    <View className="flex-1 items-center justify-center py-2">
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
          textAlign="center"
          style={{
            textAlign: "center",
            textAlignVertical: "center",
            includeFontPadding: false,
            paddingVertical: 0,
            height: 64,
            minWidth: 100,
          }}
          className="text-[52px] font-noir font-light text-white tracking-tight text-center bg-transparent p-0"
        />
      </View>

      {/* Available Balance Subtext */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onQuickPercent(1.0)}
        className="flex-row items-center justify-center gap-1.5 mt-2"
      >
        <Text
          style={{ includeFontPadding: false }}
          className="text-[13px] font-noir text-gray-400 text-center"
        >
          Available for withdraw: {truncateDecimal(walletBalance, 2)} USDT
        </Text>
      </TouchableOpacity>

      {/* Validation Alert with fixed reserved height to prevent layout shift */}
      <View className="h-6 items-center justify-center mt-1.5">
        {isExceeding && (
          <Text
            style={{ includeFontPadding: false }}
            className="text-xs font-noir text-red-400 text-center"
          >
            Exceeds available balance ({truncateDecimal(walletBalance, 2)} USDT)
          </Text>
        )}
      </View>
    </View>
  );
});

export default WithdrawAmountHero;

