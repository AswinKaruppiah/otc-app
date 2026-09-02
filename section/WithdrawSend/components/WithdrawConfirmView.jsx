import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { REQUEST_FYSTACK_WITHDRAWAL } from "../../../apollo/mutation";
import { GET_USER, GET_MY_WITHDRAWALS } from "../../../apollo/query";
import { formatNumber } from "../../../utils/helper";
import { haptic } from "../../../utils/haptics";
import Button from "../../../components/Button";
import WithdrawSendHeader from "./WithdrawSendHeader";

/**
 * WithdrawConfirmView — Confirmation screen for withdrawal flow.
 * Styled matching the Order placement page design system.
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
        const msg =
          err?.graphQLErrors?.[0]?.message ||
          err?.message ||
          "Could not process withdrawal request.";
        toast?.show({
          label: "Withdrawal Failed",
          description: msg,
          variant: "danger",
        });
      },
    }
  );

  const numAmount = parseFloat(amount) || 0;

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* 1. Header (Centered title with Back button on left) */}
        <WithdrawSendHeader title="Confirmation" onBack={onBack} />

        {/* 2. Withdrawal Preview Card (Order Details Card Theme) */}
        <View className="w-full mb-6">
          <View className="pl-1 mb-2.5">
            <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
              Withdrawal Preview
            </Text>
          </View>

          <LinearGradient
            colors={[
              "rgba(255,255,255,0.09)",
              "rgba(255,255,255,0.04)",
              "rgba(52,211,153,0.22)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderRadius: 28, padding: 1 }}
          >
            <View style={{ borderRadius: 27, overflow: "hidden" }}>
              <LinearGradient
                colors={["#060C0A", "#091310", "#0D2018"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 pt-6 pb-7"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center bg-white/5 py-1.5 pl-1.5 pr-3.5 rounded-full gap-2 border border-white/[0.06]">
                    <Image
                      source={require("../../../assets/images/tether-usdt-logo.png")}
                      style={{ width: 24, height: 24, borderRadius: 12 }}
                      resizeMode="cover"
                    />
                    <Text className="text-white -mb-0.5 font-noir text-base">
                      USDT
                    </Text>
                  </View>

                  <View className="bg-noirMint/10 px-2.5 py-1 rounded-full border border-noirMint/[0.12]">
                    <Text className="text-noirMint font-noir-medium text-[10px] uppercase tracking-wider">
                      You Withdraw
                    </Text>
                  </View>
                </View>

                <View className="mt-5 mb-1">
                  <Text className="text-noirMint font-noir text-[44px] leading-none">
                    {formatNumber(amount || "0")}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>

        {/* 3. Recipient Crypto Address Card (Ref: CryptoAddressCard) */}
        <View className="w-full mb-6">
          <View className="pl-1 gap-1 mb-2.5">
            <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
              Recipient Crypto Address
            </Text>
            <Text className="text-gray-500 font-noir text-xs leading-normal">
              USDT will be transferred to this whitelisted TRC-20 wallet.
            </Text>
          </View>

          <View className="flex-row items-center justify-between bg-black/35 rounded-2xl p-4 border border-white/5 gap-3">
            <View className="flex-1 min-w-0">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="font-noir font-semibold text-sm text-white">
                  {selectedAddress?.label || "Whitelisted Wallet"}
                </Text>
                <View className="px-1.5 py-0.2 rounded bg-red-500/15 border border-red-500/30">
                  <Text className="text-[9px] font-noir-medium text-red-400">
                    TRC-20
                  </Text>
                </View>
              </View>
              <Text
                className="font-mono text-xs text-gray-300 tracking-wide"
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {selectedAddress?.address}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
              <Image
                source={require("../../../assets/images/tether-usdt-logo.png")}
                style={{ width: 22, height: 22, borderRadius: 11 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* 4. Transfer Summary Breakdown (No fees) */}
        <View className="w-full bg-[#111417] border border-white/10 rounded-2xl p-4 gap-3">
          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">From</Text>
            <Text className="font-noir text-xs font-medium text-white">
              Available Balance
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">Network</Text>
            <Text className="font-noir text-xs font-medium text-white">
              TRON (TRC-20)
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="font-noir text-xs text-gray-400">Estimated Arrival</Text>
            <Text className="font-noir text-xs font-medium text-noirMint">
              Instant (1–3 Mins)
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 5. Confirm Action Button */}
      <View className="w-full pt-4 pb-2">
        <Button
          onPress={handleConfirm}
          primary={true}
          disabled={submitting || !selectedAddress?.address || numAmount <= 0}
        >
          {submitting ? (
            <ActivityIndicator color="#111418" />
          ) : (
            "Confirm"
          )}
        </Button>
      </View>
    </View>
  );
}
