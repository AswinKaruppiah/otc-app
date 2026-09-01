import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useMutation } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { REQUEST_FYSTACK_WITHDRAWAL } from "../../../apollo/mutation";
import { GET_USER, GET_MY_WITHDRAWALS } from "../../../apollo/query";
import { maskText, truncateDecimal } from "../../../utils/helper";
import { haptic } from "../../../utils/haptics";

/**
 * WithdrawConfirmView — Confirmation screen for withdrawal flow.
 */
export default function WithdrawConfirmView({
  amount,
  selectedAddress,
  onBack,
  onSuccess,
}) {
  const { toast } = useToast();

  const [requestWithdrawal, { loading: submitting }] = useMutation(
    REQUEST_FYSTACK_WITHDRAWAL,
    {
      refetchQueries: [
        { query: GET_USER },
        { query: GET_MY_WITHDRAWALS, variables: { page: 1, limit: 10 } },
      ],
      onCompleted() {
        haptic.success();
        toast?.show({
          label: "Withdrawal Submitted",
          description: "Your USDT withdrawal request has been submitted successfully.",
          variant: "success",
        });
        onSuccess?.();
      },
      onError(err) {
        haptic.error();
        toast?.show({
          label: "Withdrawal Failed",
          description: err?.message || "Could not process withdrawal request.",
          variant: "danger",
        });
      },
    }
  );

  const numAmount = parseFloat(amount) || 0;
  const formattedAmount = `${truncateDecimal(numAmount, 2)} USDT`;

  const handleConfirm = async () => {
    if (submitting || !selectedAddress?.address || numAmount <= 0) return;
    haptic.medium();
    try {
      await requestWithdrawal({
        variables: {
          amount: amount.trim(),
          recipientAddress: selectedAddress.address,
        },
      });
    } catch (e) {
      // Handled by onError
    }
  };

  return (
    <View className="w-full flex-1 justify-between">
      <View className="w-full">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="w-11 h-11 rounded-full bg-[#13171a] border border-white/10 items-center justify-center active:bg-[#1e252a]"
          >
            <Feather name="chevron-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="text-lg font-noir font-bold text-white tracking-wide">
            Confirmation
          </Text>

          <View className="w-11 h-11" />
        </View>

        {/* Destination Card */}
        <View className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 rounded-xl bg-noirMint/10 border border-noirMint/25 items-center justify-center">
              <Feather name="shield" size={18} color="#baffd8" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-noir font-semibold text-sm text-white">
                  {selectedAddress?.label || "Whitelisted Wallet"}
                </Text>
                <View className="px-1.5 py-0.2 rounded bg-red-500/15 border border-red-500/30">
                  <Text className="text-[9px] font-noir-medium text-red-400">
                    TRC-20
                  </Text>
                </View>
              </View>
              <Text className="font-mono text-xs text-gray-400 mt-0.5">
                {maskText(selectedAddress?.address, 6)}
              </Text>
            </View>
          </View>
          <Feather name="check" size={16} color="#baffd8" />
        </View>

        {/* Withdraw Details Card */}
        <View className="w-full bg-white/[0.03] border border-white/[0.06] rounded-3xl p-5 gap-3.5">
          <Text className="text-xs font-noir font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Withdraw Details
          </Text>

          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">From:</Text>
            <Text className="font-noir text-xs font-medium text-white">
              Available Balance
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">Method:</Text>
            <Text className="font-noir text-xs font-medium text-white">
              USDT (TRC-20 Transfer)
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">Estimated Arrival:</Text>
            <Text className="font-noir text-xs font-medium text-noirMint">
              Instant (1–3 Mins)
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">Amount:</Text>
            <Text className="font-noir text-xs font-semibold text-white">
              {formattedAmount}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">Fee:</Text>
            <Text className="font-noir text-xs font-semibold text-noirMint">
              0.00 USDT (Free)
            </Text>
          </View>

          <View className="h-px bg-white/10 my-1" />

          <View className="flex-row justify-between items-center">
            <Text className="font-noir font-semibold text-sm text-white">Total:</Text>
            <Text className="font-noir font-bold text-base text-noirMint">
              {formattedAmount}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View className="w-full pt-6 pb-2">
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={submitting}
          onPress={handleConfirm}
          className={`w-full py-4 rounded-2xl bg-noirMint flex-row items-center justify-center gap-2.5 shadow-lg shadow-noirMint/25 ${
            submitting ? "opacity-60" : ""
          }`}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#060E0B" />
          ) : (
            <>
              <Text className="font-noir font-bold text-base text-noirBg">
                Confirm & Withdraw
              </Text>
              <Feather name="arrow-right" size={18} color="#060E0B" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
