import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { useScreenPadding } from "../../context/ScrollContext";
import { haptic } from "../../utils/haptics";
import WithdrawBalanceCard from "./components/WithdrawBalanceCard";
import WithdrawRecentHistory from "./components/WithdrawRecentHistory";

/**
 * WithdrawSection — Main feature overview for USDT withdrawals.
 * Route: /withdraw
 */
export default function WithdrawSection() {
  const router = useRouter();
  const { paddingBottom } = useScreenPadding();
  const { user, loading: userLoading } = useUser();

  const walletBalance = user?.wallet?.walletBalance ?? 0;
  const walletHold = user?.walletHold ?? 0;

  const handleOpenWithdrawForm = () => {
    haptic.medium();
    router.push("/withdraw/send");
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
          onWithdrawPress={handleOpenWithdrawForm}
        />

        {/* Recent Withdrawal History */}
        <WithdrawRecentHistory
          onMakeWithdrawalPress={handleOpenWithdrawForm}
        />
      </ScrollView>
    </View>
  );
}
