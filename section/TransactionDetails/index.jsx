import { View, Text, RefreshControl } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import { GET_ORDER } from "../../apollo/query";
import { getOrderStatusStyle } from "../../utils/constants";
import { maskText } from "../../utils/helper";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
import { Skeleton } from "heroui-native";
import PageContainer from "../../components/PageContainer";
import { useScreenPadding } from "../../context/ScrollContext";
import Show from "../../components/Show";

import { TransactionHeroCard } from "./components/TransactionHeroCard";
import { PaymentBreakdownCard } from "./components/PaymentBreakdownCard";
import { UserBankCard } from "./components/UserBankCard";
import { OrderTimelineCard } from "./components/OrderTimelineCard";
import { BlockchainMetadataCard } from "./components/BlockchainMetadataCard";

export default function TransactionDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { paddingTop } = useScreenPadding();
  const orderId = params?.id || params?.orderId;

  const { data: orderData, loading: orderLoading, error: orderError, refetch, networkStatus } = useQuery(GET_ORDER, {
    variables: { orderId: orderId || "" },
    skip: !orderId,
    notifyOnNetworkStatusChange: true,
  });

  const isRefreshing = networkStatus === 4;

  const handleRefresh = async () => {
    try {
      await refetch({ orderId: orderId || "" });
    } catch (e) {
      console.error("Error refreshing transaction details:", e);
    }
  };

  const order = orderData?.getOrder;

  const statusStyle = order ? getOrderStatusStyle(order.status) : null;
  const rawOrderId = order ? (order.orderId || order.id) : "";
  const orderIdText = rawOrderId ? maskText(rawOrderId, 4).toUpperCase() : "";

  return (
    <PageContainer
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#baffd8"
          colors={["#baffd8"]}
          progressBackgroundColor="#181e25"
          progressViewOffset={paddingTop - 10}
        />
      }
    >
      <Show>
        <Show.If isTrue={orderLoading}>
          <View className="w-full gap-6">
            {/* Header Bar Skeleton */}
            <View className="flex-row items-center justify-between pl-1">
              <View className="gap-1.5">
                <Skeleton className="w-28 h-3.5 rounded-md" />
                <Skeleton className="w-36 h-6 rounded-md" />
              </View>
              <Skeleton className="w-20 h-7 rounded-full" />
            </View>

            <Skeleton className="w-full h-56 rounded-3xl" />
            <Skeleton className="w-full h-36 rounded-2xl" />
            <Skeleton className="w-full h-44 rounded-2xl" />
          </View>
        </Show.If>

        <Show.ElseIf isTrue={orderError || !order}>
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
        </Show.ElseIf>

        <Show.Else>
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

              {statusStyle && (
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
              )}
            </View>

            {/* Hero Exchange Card */}
            {order && <TransactionHeroCard order={order} />}

            {/* Payment Breakdown Card */}
            {order && <PaymentBreakdownCard order={order} />}

            {/* User Bank Section */}
            {order && <UserBankCard userBank={order.userBank} />}

            {/* Order Timeline Progress Card */}
            {order && <OrderTimelineCard history={order.history} payments={order.payments} />}

            {/* Blockchain Metadata Card */}
            {order && <BlockchainMetadataCard blockchainTx={order.blockchainTx} />}
          </View>
        </Show.Else>
      </Show>
    </PageContainer>
  );
}
