import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import { GET_ORDER, GET_ORDER_PAYMENT_STATS } from "../../apollo/query";
import { getOrderStatusStyle } from "../../utils/constants";
import { maskText } from "../../utils/helper";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { Skeleton } from "heroui-native";

import { TransactionHeroCard } from "./details/TransactionHeroCard";
import { PaymentBreakdownCard } from "./details/PaymentBreakdownCard";
import { DepositBankCard } from "./details/DepositBankCard";
import { UserBankCard } from "./details/UserBankCard";
import { RecipientWalletCard } from "./details/RecipientWalletCard";
import { OrderTimelineCard } from "./details/OrderTimelineCard";
import { BlockchainMetadataCard } from "./details/BlockchainMetadataCard";

const resolveNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }
  return 0;
};

export default function TransactionDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const orderId = params?.id || params?.orderId;

  const { data: orderData, loading: orderLoading, error: orderError } = useQuery(GET_ORDER, {
    variables: { orderId: orderId || "" },
    skip: !orderId,
  });

  const { data: statsData } = useQuery(GET_ORDER_PAYMENT_STATS, {
    variables: { orderId: orderId || "" },
    skip: !orderId,
  });

  const order = orderData?.getOrder;
  const paymentStats = statsData?.getOrderPaymentStats;

  if (orderLoading) {
    return (
      <View className="w-full gap-6 py-4">
        <Skeleton className="w-full h-14 rounded-2xl" />
        <Skeleton className="w-full h-56 rounded-3xl" />
        <Skeleton className="w-full h-36 rounded-2xl" />
        <Skeleton className="w-full h-44 rounded-2xl" />
      </View>
    );
  }

  if (orderError || !order) {
    return (
      <View className="w-full items-center justify-center py-20 px-6 gap-3">
        <Feather name="alert-circle" size={56} color="#ff7b7b" />
        <Text className="text-white font-noir-medium text-lg text-center">
          Transaction Not Found
        </Text>
        <Text className="text-gray-400 font-noir text-xs text-center">
          {orderError?.message || "Could not retrieve order details."}
        </Text>
        <HapticTouchableOpacity
          onPress={() => router.back()}
          className="mt-4 px-6 py-3 rounded-full bg-white/10 border border-white/10"
        >
          <Text className="text-white font-noir-medium text-sm">Go Back</Text>
        </HapticTouchableOpacity>
      </View>
    );
  }

  const statusStyle = getOrderStatusStyle(order.status);
  const fiatAmount = resolveNumber(order.amountRequested);
  const cryptoAmount = resolveNumber(order.cryptoAmountEstimated);
  const rate = resolveNumber(order.rate);
  const rawOrderId = order.orderId || order.id;
  const orderIdText = maskText(rawOrderId, 4).toUpperCase();

  const totalSubmitted = resolveNumber(order.totalPaymentsSubmitted || 0);
  const verifiedAmount = resolveNumber(paymentStats?.verifiedAmount || 0);

  return (
    <View className="w-full gap-8 pb-12">
      {/* Page Header Bar */}
      <View className="flex-row items-center justify-between pl-1">
        <View className="gap-0.5">
          <Text className="text-gray-400 font-noir-medium text-xs tracking-wider uppercase">
            Transaction Details
          </Text>
          <Text className="text-white font-noir-medium text-xl font-bold tracking-tight">
            Order #{orderIdText}
          </Text>
        </View>

        <View
          className="rounded-full px-3.5 py-1.5 border border-white/10"
          style={{ backgroundColor: statusStyle.bg }}
        >
          <Text
            className="text-xs font-noir-medium font-semibold"
            style={{ color: statusStyle.color }}
          >
            {statusStyle.label}
          </Text>
        </View>
      </View>

      {/* Hero Exchange Card */}
      <TransactionHeroCard
        fiatAmount={fiatAmount}
        cryptoAmount={cryptoAmount}
        rate={rate}
      />

      {/* Payment Breakdown Card */}
      <PaymentBreakdownCard
        fiatAmount={fiatAmount}
        totalSubmitted={totalSubmitted}
        verifiedAmount={verifiedAmount}
      />

      {/* Recipient Wallet Section */}
      <RecipientWalletCard walletAddress={order.user?.walletAddress} />

      {/* Deposit Admin Bank Section */}
      <DepositBankCard bank={order.adminBank} />

      {/* User Bank Section */}
      <UserBankCard userBank={order.userBank} />

      {/* Order Timeline Progress Card */}
      <OrderTimelineCard history={order.history} payments={order.payments} />

      {/* Blockchain Metadata Card */}
      <BlockchainMetadataCard blockchainTx={order.blockchainTx} />
    </View>
  );
}
