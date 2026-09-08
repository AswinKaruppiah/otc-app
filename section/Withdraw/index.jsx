import { useState, useRef, useCallback } from "react";
import { View, Animated, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useScreenPadding, useScrollY, useScrollViewRef } from "../../context/ScrollContext";
import { useWithdraw } from "../../context/WithdrawContext";
import { haptic } from "../../utils/haptics";
import WithdrawBalanceCard from "./components/WithdrawBalanceCard";
import WithdrawRecentHistory from "./components/WithdrawRecentHistory";

/**
 * WithdrawSection — Main feature overview for withdrawals.
 * Route: /withdraw
 */
export default function WithdrawSection() {
  const router = useRouter();
  const { paddingTop, paddingBottom } = useScreenPadding();
  const scrollY = useScrollY();
  const scrollViewRef = useScrollViewRef();
  const {
    walletBalance,
    balanceSymbol,
    balanceLoading,
    refetchBalance,
    resetWithdraw,
    user,
  } = useWithdraw();
  const historyRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [focusLoading, setFocusLoading] = useState(true);

  // Refetch live balance every time user navigates / focuses this screen
  useFocusEffect(
    useCallback(() => {
      setFocusLoading(true);
      refetchBalance?.().finally(() => {
        setFocusLoading(false);
      });

      return () => {
        // Reset to true on blur so re-entering always starts in loading state immediately
        setFocusLoading(true);
      };
    }, [refetchBalance])
  );

  const isCardLoading = balanceLoading || focusLoading || refreshing;

  const handleOpenWithdrawForm = () => {
    if (isCardLoading) return;
    haptic.medium();
    resetWithdraw();
    router.push("/withdraw/send");
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        refetchBalance?.(),
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
          walletAddress={user?.walletAddress}
          symbol={balanceSymbol}
          loading={isCardLoading}
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

