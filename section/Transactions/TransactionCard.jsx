import { View, Text, Image } from "react-native";
import { formatDate, maskText } from "../../utils/helper";

export default function TransactionCard({ item }) {
  const dateStr = formatDate(item.createdAt);

  const rawOrderId = item.orderId || item.id;
  const orderIdText = maskText(rawOrderId, 4).toUpperCase();
  // Generate initials from orderId or default to "TX"
  const initials = "TX";

  const requestedAmount = Number(item.amountRequested?.$numberDecimal ?? item.amountRequested ?? 0);
  const estimatedCrypto = Number(item.cryptoAmountEstimated?.$numberDecimal ?? item.cryptoAmountEstimated ?? 0);

  return (
    <View className="flex-row items-center justify-between py-4">
      {/* Left side: Avatar & Info */}
      <View className="flex-row items-center gap-3.5 flex-1 mr-3">
        {/* Avatar container with flag badge */}
        <View className="relative">
          <View className="w-16 h-16 rounded-full bg-white/5 border border-white/[0.06] items-center justify-center">
            <Text className="text-noirText font-noir font-bold text-xl tracking-tight">
              {initials}
            </Text>
          </View>
          {/* Flag badge overlay at bottom right */}
          <View className="absolute right-0 bottom-0 w-5 h-5 rounded-full border border-[#111418] overflow-hidden bg-noirCard items-center justify-center">
            <Image
              source={require("../../assets/images/Flag_of_India.png")}
              style={{ width: 14, height: 14, borderRadius: 7 }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Text details */}
        <View className="flex-1">
          <Text numberOfLines={1} ellipsizeMode="tail" className="text-base text-noirText font-noir font-medium mb-0.5">
            {orderIdText}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm text-gray-400 font-noir">
            Cash Sent • {dateStr}
          </Text>
        </View>
      </View>

      {/* Right side: Amounts */}
      <View className="items-end gap-1 flex-shrink-0">
        <Text numberOfLines={1} ellipsizeMode="tail" className="text-base text-noirText font-noir font-semibold">
          - ₹{requestedAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm text-gray-400 font-noir">
          {estimatedCrypto.toFixed(2)} USDT
        </Text>
      </View>
    </View>
  );
}
