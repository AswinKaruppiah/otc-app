import { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation } from "@apollo/client/react";
import { useToast } from "heroui-native";
import PageContainer from "../../components/PageContainer";
import {
  GET_USER,
  GET_USER_WHITELISTED_ADDRESSES,
  GET_MY_WITHDRAWALS,
} from "../../apollo/query";
import { REQUEST_FYSTACK_WITHDRAWAL } from "../../apollo/mutation";
import SelectAddressDialog from "../../components/dialog/SelectAddressDialog";

import WithdrawHeader from "./components/WithdrawHeader";
import WithdrawBalanceCard from "./components/WithdrawBalanceCard";
import WithdrawAmountForm from "./components/WithdrawAmountForm";
import WithdrawRecentHistory from "./components/WithdrawRecentHistory";

/**
 * WithdrawSection — Dedicated feature container for USDT withdrawals.
 * Located in section/Withdraw/index.jsx.
 */
export default function WithdrawSection() {
  const router = useRouter();
  const { toast } = useToast();

  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // 1. Fetch User Balance
  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useQuery(GET_USER);

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
    fetchPolicy: "cache-and-network",
  });

  // 4. Request Withdrawal Mutation
  const [requestWithdrawal, { loading: submitting }] = useMutation(
    REQUEST_FYSTACK_WITHDRAWAL,
    {
      onCompleted() {
        toast?.show({
          label: "Withdrawal Requested",
          description: "Your USDT withdrawal request has been submitted successfully.",
          variant: "success",
        });
        setAmount("");
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

  const me = userData?.userMe;
  const walletBalance = me?.wallet?.walletBalance ?? 0;
  const walletHold = me?.walletHold ?? 0;

  const whitelistedAddresses = walletData?.getUserWhitelistedAddresses || [];
  const recentWithdrawals = withdrawalData?.getMyWithdrawals?.items || [];

  // Pre-select default or first whitelisted address
  useEffect(() => {
    if (whitelistedAddresses.length > 0 && !selectedAddress) {
      const defaultAddr =
        whitelistedAddresses.find((a) => a.isDefault) || whitelistedAddresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [whitelistedAddresses]);

  const handleQuickPercent = (percent) => {
    const calc = (walletBalance * percent).toFixed(2);
    setAmount(calc > 0 ? calc.toString() : "");
  };

  const numAmount = parseFloat(amount) || 0;
  const isExceeding = numAmount > walletBalance;
  const canSubmit =
    numAmount > 0 &&
    !isExceeding &&
    Boolean(selectedAddress?.address) &&
    !submitting;

  const handleConfirmWithdraw = async () => {
    if (!selectedAddress?.address) {
      toast?.show({
        label: "Missing Address",
        description: "Please select a whitelisted destination address.",
        variant: "danger",
      });
      return;
    }

    if (numAmount <= 0) {
      toast?.show({
        label: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "danger",
      });
      return;
    }

    if (isExceeding) {
      toast?.show({
        label: "Insufficient Balance",
        description: `Your available balance is ${walletBalance.toFixed(2)} USDT.`,
        variant: "danger",
      });
      return;
    }

    try {
      await requestWithdrawal({
        variables: {
          amount: amount.trim(),
          recipientAddress: selectedAddress.address,
        },
      });
    } catch (e) {
      // Handled in onError
    }
  };

  const handleAddAddressPress = () => {
    router.push({ pathname: "/accounts/add-wallet", params: { tab: "wallets" } });
  };

  return (
    <PageContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="w-full"
      >
        {/* Header */}
        <WithdrawHeader />

        {/* Balance Card */}
        <WithdrawBalanceCard
          walletBalance={walletBalance}
          walletHold={walletHold}
          loading={userLoading}
        />

        {/* Amount Input & Destination Selector Form */}
        <WithdrawAmountForm
          amount={amount}
          setAmount={setAmount}
          walletBalance={walletBalance}
          selectedAddress={selectedAddress}
          whitelistedAddresses={whitelistedAddresses}
          walletLoading={walletLoading}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          onAddAddressPress={handleAddAddressPress}
          onQuickPercent={handleQuickPercent}
          isExceeding={isExceeding}
          canSubmit={canSubmit}
          submitting={submitting}
          onSubmit={handleConfirmWithdraw}
          onCancel={() => router.back()}
        />

        {/* Recent Withdrawal History */}
        <WithdrawRecentHistory
          recentWithdrawals={recentWithdrawals}
          onRefresh={refetchWithdrawals}
        />
      </ScrollView>

      {/* Select Address Dialog Modal */}
      <SelectAddressDialog
        isOpen={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        addresses={whitelistedAddresses}
        selectedId={selectedAddress?.id}
        onSelect={setSelectedAddress}
      />
    </PageContainer>
  );
}
