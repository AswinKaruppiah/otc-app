import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { useScreenPadding } from "../../context/ScrollContext";
import { useUser } from "../../hooks/useUser";
import {
  GET_USER_WHITELISTED_ADDRESSES,
  GET_MY_WITHDRAWALS,
} from "../../apollo/query";
import { REQUEST_FYSTACK_WITHDRAWAL } from "../../apollo/mutation";

import WithdrawBalanceCard from "./components/WithdrawBalanceCard";
import WithdrawRecentHistory from "./components/WithdrawRecentHistory";
import WithdrawModal from "./components/WithdrawModal";

/**
 * WithdrawSection — Main feature container for USDT withdrawals.
 * Located in section/Withdraw/index.jsx.
 */
export default function WithdrawSection() {
  const router = useRouter();
  const { toast } = useToast();
  const { paddingBottom } = useScreenPadding();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // 1. Fetch User Profile & Balance using useUser hook
  const {
    user,
    loading: userLoading,
    refetch: refetchUser,
  } = useUser();

  // 2. Fetch Whitelisted Destination Addresses
  const {
    data: walletData,
    loading: walletLoading,
  } = useQuery(GET_USER_WHITELISTED_ADDRESSES);

  // 3. Fetch Recent Withdrawals
  const {
    data: withdrawalData,
    refetch: refetchWithdrawals,
  } = useQuery(GET_MY_WITHDRAWALS, {
    variables: { page: 1, limit: 10 },
  });

  // 4. Request Withdrawal Mutation
  const [requestWithdrawal, { loading: submitting }] = useMutation(
    REQUEST_FYSTACK_WITHDRAWAL,
    {
      onCompleted() {
        toast?.show({
          label: "Withdrawal Submitted",
          description: "Your USDT withdrawal request has been submitted successfully.",
          variant: "success",
        });
        refetchUser?.();
        refetchWithdrawals?.();
      },
      onError(err) {
        toast?.show({
          label: "Withdrawal Failed",
          description: err?.message || "Could not process withdrawal request.",
          variant: "danger",
        });
      },
    }
  );

  const walletBalance = user?.wallet?.walletBalance ?? 0;
  const walletHold = user?.walletHold ?? 0;

  const whitelistedAddresses = walletData?.getUserWhitelistedAddresses || [];
  const recentWithdrawals = withdrawalData?.getMyWithdrawals?.items || [];

  const handleSubmitWithdrawal = async ({ amount, recipientAddress, onSuccess }) => {
    try {
      await requestWithdrawal({
        variables: {
          amount,
          recipientAddress,
        },
      });
      onSuccess?.();
    } catch (e) {
      // Error handled in mutation onError
    }
  };

  const handleAddAddressPress = () => {
    router.push({ pathname: "/accounts/add-wallet", params: { tab: "wallets" } });
  };

  return (
    <View className="w-full flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom }}
        className="w-full"
      >
        {/* Balance Card with Withdraw CTA */}
        <WithdrawBalanceCard
          walletBalance={walletBalance}
          walletHold={walletHold}
          loading={userLoading}
          onWithdrawPress={() => setIsWithdrawModalOpen(true)}
        />

        {/* Recent Withdrawal History */}
        <WithdrawRecentHistory
          recentWithdrawals={recentWithdrawals}
          onRefresh={refetchWithdrawals}
        />
      </ScrollView>

      {/* Modal Dialog for Amount Input, Address Selection & Confirmation */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        walletBalance={walletBalance}
        whitelistedAddresses={whitelistedAddresses}
        walletLoading={walletLoading}
        submitting={submitting}
        onSubmit={handleSubmitWithdrawal}
        onAddAddress={handleAddAddressPress}
      />
    </View>
  );
}
