import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const resolveNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }
  return 0;
};

export const PaymentBreakdownCard = ({ order }) => {
  const fiatAmount = resolveNumber(order?.amountRequested);
  const totalSubmitted = resolveNumber(order?.totalPaymentsSubmitted || 0);
  const verifiedAmount = (order?.payments || []).reduce((sum, p) => {
    if (p?.status === "verified") {
      return sum + resolveNumber(p.amount);
    }
    return sum;
  }, 0);

  return (
    <View className="gap-3">
      <View className="pl-1 mb-1">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Payment Stats
        </Text>
      </View>

      <View className="flex-row gap-3">
        {/* Card 1: Payments Submitted */}
        <View className="flex-1">
          <LinearGradient
            colors={["rgba(255,193,7,0.18)", "rgba(255,193,7,0.04)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderRadius: 16, padding: 1 }}
          >
            <View className="bg-[#060E0B] rounded-[15px] p-4 gap-2">
              <Text className="text-[11px] text-gray-400 font-noir uppercase tracking-wider">
                Payments Submitted
              </Text>
              <Text className="text-base text-amber-400 font-noir-medium font-bold">
                ₹{totalSubmitted.toLocaleString("en-IN")}
              </Text>
              <Text className="text-[10px] text-gray-500 font-noir">
                of ₹{fiatAmount.toLocaleString("en-IN")} requested
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Card 2: Payments Verified */}
        <View className="flex-1">
          <LinearGradient
            colors={["rgba(186, 255, 216, 0.2)", "rgba(186, 255, 216, 0.04)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ borderRadius: 16, padding: 1 }}
          >
            <View className="bg-[#060E0B] rounded-[15px] p-4 gap-2">
              <Text className="text-[11px] text-gray-400 font-noir uppercase tracking-wider">
                Payments Verified
              </Text>
              <Text className="text-base text-noirMint font-noir-medium font-bold">
                ₹{verifiedAmount.toLocaleString("en-IN")}
              </Text>
              <Text className="text-[10px] text-gray-500 font-noir">
                of ₹{totalSubmitted.toLocaleString("en-IN")} submitted
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};
