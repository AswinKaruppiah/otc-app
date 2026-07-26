import { View, Text, Image } from "react-native";
import { formatDate, maskText } from "../../utils/helper";
import { getOrderStatusStyle } from "../../utils/constants";
import Feather from "@expo/vector-icons/Feather";

export default function TransactionCard({ item }) {
  const dateStr = formatDate(item.createdAt);
  const rawOrderId = item.orderId || item.id;
  const orderIdText = maskText(rawOrderId, 4).toUpperCase();

  const statusStyle = getOrderStatusStyle(item.status);

  const requestedAmount = Number(
    item.amountRequested?.$numberDecimal ?? item.amountRequested ?? 0
  );
  const estimatedCrypto = Number(
    item.cryptoAmountEstimated?.$numberDecimal ?? item.cryptoAmountEstimated ?? 0
  );

  return (
    <View className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 mb-3 gap-3">
      {/* Top Row: Icon + Order ID & Status Badge */}
      <View className="flex-row flex-wrap items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          {/* Avatar container with flag badge */}
          <View className="relative">
            <View className="w-11 h-11 rounded-xl bg-white/5 border border-white/[0.06] items-center justify-center">
              <Feather name="arrow-down-left" size={20} color="#baffd8" />
            </View>
            <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-[#111418] overflow-hidden bg-noirCard items-center justify-center">
              <Image
                source={require("../../assets/images/Flag_of_India.png")}
                style={{ width: 12, height: 12, borderRadius: 6 }}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Order ID & Date */}
          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="text-base text-noirText font-noir-medium font-semibold"
            >
              {orderIdText}
            </Text>
            <Text className="text-xs text-gray-400 font-noir mt-0.5">
              {dateStr}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <View
          className="rounded-full px-2.5 py-1"
          style={{ backgroundColor: statusStyle.bg }}
        >
          <Text
            numberOfLines={1}
            className="text-xs font-noir-medium font-medium"
            style={{ color: statusStyle.color }}
          >
            {statusStyle.label}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px w-full bg-white/[0.04]" />

      {/* Bottom Row: INR Amount & USDT Amount */}
      <View className="flex-row items-center justify-between">
        <View className="gap-0.5">
          <Text className="text-[11px] text-gray-500 font-noir uppercase tracking-wider">
            Fiat Amount
          </Text>
          <Text className="text-base text-white font-noir-medium font-semibold">
            ₹
            {requestedAmount.toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View className="items-end gap-0.5">
          <Text className="text-[11px] text-gray-500 font-noir uppercase tracking-wider">
            Crypto Estimated
          </Text>
          <Text className="text-base text-noirMint font-noir-medium font-semibold">
            {estimatedCrypto.toFixed(2)} USDT
          </Text>
        </View>
      </View>
    </View>
  );
}
