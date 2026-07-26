import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatDate } from "../../../utils/helper";
import { getOrderStatusStyle } from "../../../utils/constants";

export const OrderTimelineCard = ({ history = [] }) => {
  if (!history || history.length === 0) return null;

  return (
    <View>
      <View className="pl-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Order Timeline
        </Text>
      </View>

      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View className="bg-[#060E0B] rounded-[15px] p-5 gap-3.5">
          {history.map((step, idx) => {
            const stepStyle = getOrderStatusStyle(step.toStatus);
            return (
              <View key={idx} className="flex-row items-start gap-3">
                <View className="w-3 h-3 rounded-full bg-noirMint mt-1" />
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-white font-noir-medium text-xs font-semibold capitalize">
                      {step.toStatus?.replace(/_/g, " ")}
                    </Text>
                    <Text className="text-gray-500 font-noir text-[11px]">
                      {formatDate(step.createdAt)}
                    </Text>
                  </View>
                  {step.reason && (
                    <Text className="text-gray-400 font-noir text-xs mt-0.5">
                      {step.reason}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};
