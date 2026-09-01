import { useState } from "react";
import { View, ScrollView } from "react-native";
import { useScreenPadding } from "../../context/ScrollContext";
import { useUser } from "../../hooks/useUser";

import WithdrawBalanceCard from "./components/WithdrawBalanceCard";
import WithdrawRecentHistory from "./components/WithdrawRecentHistory";
import WithdrawModal from "./components/WithdrawModal";

/**
 * WithdrawSection — Main feature container for USDT withdrawals.
 * Located in section/Withdraw/index.jsx.
 */
export default function WithdrawSection() {
  const { paddingBottom } = useScreenPadding();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // User balance profile hook
  const { user, loading: userLoading } = useUser();

  const walletBalance = user?.wallet?.walletBalance ?? 0;
  const walletHold = user?.walletHold ?? 0;

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
          onMakeWithdrawalPress={() => setIsWithdrawModalOpen(true)}
        />
      </ScrollView>

      {/* Modal Dialog for Amount Input, Address Selection & Confirmation */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        walletBalance={walletBalance}
      />
    </View>
  );
}
