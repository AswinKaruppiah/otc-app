import { View, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMutation } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { REQUEST_FYSTACK_WITHDRAWAL } from "../../apollo/mutation";
import { GET_USER, GET_MY_WITHDRAWALS } from "../../apollo/query";
import { useScreenPadding } from "../../context/ScrollContext";
import { haptic } from "../../utils/haptics";
import WithdrawConfirmHeader from "./components/WithdrawConfirmHeader";
import WithdrawPreviewCard from "./components/WithdrawPreviewCard";
import WithdrawRecipientCard from "./components/WithdrawRecipientCard";
import WithdrawSummaryCard from "./components/WithdrawSummaryCard";
import WithdrawConfirmFooter from "./components/WithdrawConfirmFooter";

/**
 * WithdrawConfirmSection — Standalone full-screen confirmation section for USDT withdrawals.
 * Route: /withdraw/confirm
 */
export default function WithdrawConfirmSection() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { paddingBottom, paddingTop } = useScreenPadding();
  const { toast } = useToast();

  const amount = params.amount ? String(params.amount) : "";
  const address = params.address ? String(params.address) : "";
  const label = params.label ? String(params.label) : "Whitelisted Wallet";
  const network = params.network ? String(params.network) : "TRC-20";

  const [requestWithdrawal, { loading: submitting }] = useMutation(
    REQUEST_FYSTACK_WITHDRAWAL,
    {
      refetchQueries: [
        { query: GET_USER },
        { query: GET_MY_WITHDRAWALS, variables: { page: 1, limit: 10 } },
      ],
      awaitRefetchQueries: true,
      onCompleted() {
        haptic.success();
        toast?.show({
          label: "Withdrawal Submitted",
          description: "Your USDT withdrawal request has been submitted successfully.",
          variant: "success",
        });
        router.replace("/withdraw");
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
  const canConfirm = !submitting && Boolean(address) && numAmount > 0;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    haptic.medium();
    try {
      await requestWithdrawal({
        variables: {
          amount: amount.trim(),
          recipientAddress: address,
        },
      });
    } catch (e) {
      // Handled by onError
    }
  };

  const handleBack = () => {
    haptic.light();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/withdraw/send");
    }
  };


  return (
    <View
      className="flex-1 w-full justify-between px-3"
      style={{ paddingTop, paddingBottom }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* 1. Header with back navigation */}
        <WithdrawConfirmHeader onBack={handleBack} />

        {/* 2. Withdrawal Amount Preview Card */}
        <WithdrawPreviewCard amount={amount} />

        {/* 3. Recipient Crypto Address Card */}
        <WithdrawRecipientCard
          address={address}
          label={label}
          network={network}
        />

        {/* 4. Transfer Summary Breakdown */}
        <WithdrawSummaryCard
          network={network === "TRC-20" ? "TRON (TRC-20)" : network}
        />
      </ScrollView>

      {/* 5. Submit CTA Footer */}
      <WithdrawConfirmFooter
        loading={submitting}
        disabled={!canConfirm}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
