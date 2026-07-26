import { View, Text, Pressable, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { getOrderStatusStyle } from "../../../../utils/constants";

const resolveNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }
  return 0;
};

export const PaymentProofCardItem = ({ item, index, onPreviewImage }) => {
  const pStatusStyle = getOrderStatusStyle(item.status);
  const pAmount = resolveNumber(item.amount);

  return (
    <View className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 gap-2">
      <View className="flex-row items-center gap-3">
        {/* Payment Proof Thumbnail */}
        {item.screenshotUrl ? (
          <Pressable
            onPress={() => onPreviewImage(item.screenshotUrl)}
            className="relative rounded-lg overflow-hidden border border-white/10 shrink-0 active:opacity-80"
          >
            <Image
              source={{ uri: item.screenshotUrl }}
              style={{ width: 48, height: 48, borderRadius: 8 }}
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/30 items-center justify-center">
              <Feather name="maximize-2" size={12} color="#ffffff" />
            </View>
          </Pressable>
        ) : (
          <View className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 items-center justify-center shrink-0">
            <Feather name="file-text" size={20} color="rgba(255, 255, 255, 0.4)" />
          </View>
        )}

        {/* Title, Status & Amount */}
        <View className="flex-1 min-w-0 gap-0.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-noir-medium text-xs font-semibold flex-1 mr-2" numberOfLines={1}>
              {item.title || `Payment #${(item.paymentIndex ?? index) + 1}`}
            </Text>
            <View
              className="rounded-full px-2 py-0.5 shrink-0"
              style={{ backgroundColor: pStatusStyle.bg }}
            >
              <Text
                className="text-[10px] font-noir-medium font-semibold"
                style={{ color: pStatusStyle.color }}
              >
                {pStatusStyle.label}
              </Text>
            </View>
          </View>

          <Text className="text-white font-noir-medium text-xs font-bold mt-0.5">
            ₹{pAmount.toLocaleString("en-IN")}
          </Text>
          <Text className="text-gray-400 font-noir text-[11px]" numberOfLines={1}>
            UTR: {item.utr || "N/A"}
          </Text>
        </View>
      </View>

      {/* Rejection Reason Banner */}
      {item.rejectionReason && (
        <View className="mt-1 flex-row items-center gap-1.5 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
          <Feather name="info" size={12} color="#ef4444" />
          <Text className="text-red-400 font-noir text-[11px] flex-1">
            {item.rejectionReason}
          </Text>
        </View>
      )}
    </View>
  );
};
