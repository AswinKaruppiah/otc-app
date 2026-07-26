import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import { GET_ORDER } from "../../apollo/query";
import { getOrderStatusStyle } from "../../utils/constants";
import { maskText } from "../../utils/helper";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { Skeleton } from "heroui-native";
import { TransactionHeroCard } from "./details/TransactionHeroCard";
import { PaymentBreakdownCard } from "./details/PaymentBreakdownCard";
import { UserBankCard } from "./details/UserBankCard";
import { OrderTimelineCard } from "./details/OrderTimelineCard";
import { BlockchainMetadataCard } from "./details/BlockchainMetadataCard";

export default function TransactionDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const orderId = params?.id || params?.orderId;

  const { data: orderData, loading: orderLoading, error: orderError } = useQuery(GET_ORDER, {
    variables: { orderId: orderId || "" },
    skip: !orderId,
  });

  const order = orderData?.getOrder;

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
  const rawOrderId = order.orderId || order.id;
  const orderIdText = maskText(rawOrderId, 4).toUpperCase();

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
      <TransactionHeroCard order={order} />

      {/* Payment Breakdown Card */}
      <PaymentBreakdownCard order={order} />

      {/* User Bank Section */}
      <UserBankCard userBank={order.userBank} />

      {/* Order Timeline Progress Card */}
      <OrderTimelineCard history={order.history} payments={order.payments} />

      {/* Blockchain Metadata Card */}
      <BlockchainMetadataCard blockchainTx={order.blockchainTx} />
    </View>
  );
}
