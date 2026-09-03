import { useState, useRef } from "react";
import { View, Animated, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../hooks/useUser";
import { useScreenPadding, useScrollY, useScrollViewRef } from "../../context/ScrollContext";
import { useWithdraw } from "../../context/WithdrawContext";
import { haptic } from "../../utils/haptics";
import WithdrawBalanceCard from "./components/WithdrawBalanceCard";
import WithdrawRecentHistory from "./components/WithdrawRecentHistory";

/**
 * WithdrawSection — Main feature overview for USDT withdrawals.
 * Route: /withdraw
 */
export default function WithdrawSection() {
  const router = useRouter();
  const { paddingTop, paddingBottom } = useScreenPadding();
  const scrollY = useScrollY();
  const scrollViewRef = useScrollViewRef();
  const { user, loading: userLoading, refetch: refetchUser } = useUser();
  const { resetWithdraw } = useWithdraw();
  const historyRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const walletBalance = user?.wallet?.walletBalance ?? 0;
  const walletHold = user?.walletHold ?? 0;

  const handleOpenWithdrawForm = () => {
    haptic.medium();
    resetWithdraw();
    router.push("/withdraw/send");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        refetchUser?.(),
        historyRef.current?.refetch?.(),
      ]);
    } catch (e) {
      console.error("Error refreshing withdraw section:", e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View className="w-full flex-1">
      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#baffd8"
            colors={["#baffd8"]}
            progressBackgroundColor="#181e25"
            progressViewOffset={paddingTop + 10}
          />
        }
        contentContainerStyle={{ paddingBottom }}
        className="w-full"
      >
        {/* Balance Card with Withdraw CTA */}
        <WithdrawBalanceCard
          walletBalance={walletBalance}
          walletHold={walletHold}
          loading={userLoading || refreshing}
          onWithdrawPress={handleOpenWithdrawForm}
        />

        {/* Recent Withdrawal History */}
        <WithdrawRecentHistory
          ref={historyRef}
          refreshing={refreshing}
          onMakeWithdrawalPress={handleOpenWithdrawForm}
        />
      </Animated.ScrollView>
    </View>
  );
}

