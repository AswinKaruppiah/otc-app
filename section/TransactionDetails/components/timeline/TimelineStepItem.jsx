import { View, Text, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { formatDate } from "../../../../utils/helper";
import { haptic } from "../../../../utils/haptics";
import { TIMELINE_STEP_CONFIG } from "../../../../utils/constants";
import { PaymentProofCardItem } from "./PaymentProofCardItem";

export const TimelineStepItem = ({
  step,
  isLast,
  state,
  historyItem,
  payments,
  totalTransactions,
  checkedTransactions,
  dropdownOpen,
  onToggleDropdown,
  onPreviewImage,
}) => {
  const stepConfig = TIMELINE_STEP_CONFIG[state] || TIMELINE_STEP_CONFIG.pending;
  const { iconName, circleBg, iconColor, titleColor, lineColor } = stepConfig;

  return (
    <View className="relative flex-row items-start gap-4">
      {/* Connecting Line */}
      {!isLast && (
        <View
          className={`absolute left-[15px] top-8 bottom-[-24px] w-px ${lineColor}`}
        />
      )}

      {/* Circle Icon Indicator */}
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${circleBg} z-10`}
      >
        <Feather name={iconName} size={15} color={iconColor} />
      </View>

      {/* Right Content */}
      <View className="flex-1">
        <Pressable
          disabled={!step.isVerifyStage}
          onPress={() => {
            if (step.isVerifyStage) {
              haptic.light();
              onToggleDropdown();
            }
          }}
        >
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text className={`font-noir-medium text-sm font-semibold ${titleColor}`}>
                {step.title}
              </Text>
              <Text className="text-xs text-gray-400 font-noir mt-0.5 leading-normal">
                {step.subtitle}
              </Text>
            </View>

            <View className="items-end gap-1">
              {historyItem?.createdAt && (
                <Text className="text-[10px] text-gray-500 font-noir">
                  {formatDate(historyItem.createdAt)}
                </Text>
              )}

              {step.isVerifyStage && totalTransactions > 0 && (
                <View className="flex-row items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md mt-1">
                  <Text className="text-[10px] font-noir-medium text-noirMint font-bold">
                    {checkedTransactions} / {totalTransactions} completed
                  </Text>
                  <Feather
                    name={dropdownOpen ? "chevron-up" : "chevron-down"}
                    size={12}
                    color="#baffd8"
                  />
                </View>
              )}
            </View>
          </View>
        </Pressable>

        {/* Dropdown Content */}
        {step.isVerifyStage && dropdownOpen && payments.length > 0 && (
          <View className="mt-3 gap-2">
            {payments.map((p, pIdx) => (
              <PaymentProofCardItem
                key={p.id || pIdx}
                item={p}
                index={pIdx}
                onPreviewImage={onPreviewImage}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
