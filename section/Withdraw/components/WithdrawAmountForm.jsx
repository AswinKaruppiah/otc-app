import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton } from "heroui-native";
import Show from "../../../components/Show";

/**
 * Truncate address: TQp8LmN2...6zU1
 */
function elideAddress(addr) {
  if (!addr) return "";
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}····${addr.slice(-6)}`;
}

/**
 * WithdrawAmountForm — Input fields, quick percentage buttons, address selector, security notice, and submit button.
 */
export default function WithdrawAmountForm({
  amount,
  setAmount,
  walletBalance,
  selectedAddress,
  whitelistedAddresses = [],
  walletLoading = false,
  onOpenAddressModal,
  onAddAddressPress,
  onQuickPercent,
  isExceeding,
  canSubmit,
  submitting,
  onSubmit,
  onCancel,
}) {
  return (
    <View className="w-full">
      {/* Amount Input Card */}
      <View className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 items-center mb-6">
        <Text className="text-xs font-noir font-semibold text-noirCyan uppercase tracking-widest mb-3">
          Enter Amount (USDT)
        </Text>

        <View className="flex-row items-center justify-center mb-2">
          <Text className="text-3xl font-noir text-gray-400 mr-2">$</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="rgba(255, 255, 255, 0.25)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="text-4xl font-noir font-bold text-white text-center min-w-[140px] max-w-[240px]"
          />
        </View>

        {/* Validation Warning */}
        {isExceeding && (
          <Text className="text-xs font-noir text-red-400 mb-3">
            Exceeds available balance ({walletBalance.toFixed(2)} USDT)
          </Text>
        )}

        {/* Quick Percent Selector Pills */}
        <View className="flex-row gap-2.5 mt-2">
          {[0.25, 0.5, 1.0].map((val, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => onQuickPercent(val)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl active:bg-white/15"
            >
              <Text className="text-xs font-noir font-medium text-gray-200">
                {val === 1.0 ? "MAX" : `${val * 100}%`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Destination Whitelisted Address Selector */}
      <Text className="text-sm font-noir font-semibold text-gray-300 mb-2 pl-1">
        Destination Whitelisted Address *
      </Text>

      <Show>
        <Show.If isTrue={walletLoading}>
          <Skeleton className="h-16 w-full rounded-2xl bg-white/5 mb-6" />
        </Show.If>
        <Show.ElseIf isTrue={whitelistedAddresses.length === 0}>
          {/* Warning Callout when no whitelisted addresses exist */}
          <View className="w-full bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center gap-2.5 mb-2">
              <Feather name="alert-triangle" size={16} color="#fbbf24" />
              <Text className="font-noir font-semibold text-sm text-amber-400">
                No Whitelisted Address
              </Text>
            </View>
            <Text className="font-noir text-xs text-gray-300 mb-3 leading-4">
              You must link a whitelisted TRON address before withdrawing USDT.
            </Text>
            <TouchableOpacity
              onPress={onAddAddressPress}
              className="w-full py-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl items-center"
            >
              <Text className="font-noir font-semibold text-xs text-amber-300">
                + Add Whitelisted Address
              </Text>
            </TouchableOpacity>
          </View>
        </Show.ElseIf>
        <Show.Else>
          <TouchableOpacity
            onPress={onOpenAddressModal}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex-row justify-between items-center mb-6 active:bg-white/10"
          >
            {selectedAddress ? (
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 items-center justify-center">
                  <Feather name="shield" size={18} color="#f87171" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-noir font-semibold text-sm text-white">
                      {selectedAddress.label || "Whitelisted Address"}
                    </Text>
                    <Text className="text-[10px] font-noir-medium text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded">
                      TRC-20
                    </Text>
                  </View>
                  <Text className="font-mono text-xs text-gray-400 mt-0.5">
                    {elideAddress(selectedAddress.address)}
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="font-noir text-sm text-gray-400">
                Select whitelisted address...
              </Text>
            )}
            <Feather name="chevron-down" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </Show.Else>
      </Show>

      {/* Security Footer Notice */}
      <View className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex-row items-center gap-3 mb-6">
        <Feather name="lock" size={14} color="#baffd8" />
        <Text className="text-xs font-noir text-gray-400 flex-1 leading-4">
          Payouts are processed directly to your verified whitelisted address.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mb-8">
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-xl flex-row items-center justify-center gap-2 ${
            canSubmit
              ? "bg-noirMint shadow-lg shadow-noirMint/20 active:opacity-90"
              : "bg-noirMint/20 opacity-40"
          }`}
        >
          {submitting ? (
            <ActivityIndicator color="#111418" size="small" />
          ) : (
            <>
              <Feather name="arrow-up-right" size={18} color="#111418" />
              <Text className="text-noirBg font-noir font-bold text-base">
                Confirm Withdrawal
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          className="w-full bg-white/5 border border-white/10 py-3.5 rounded-xl flex-row items-center justify-center active:bg-white/10"
        >
          <Text className="text-gray-300 font-noir font-medium text-sm">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
