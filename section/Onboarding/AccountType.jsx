import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";
import { ACCOUNT_TYPE_OPTIONS } from "./constants";
import { haptic } from "../../utils/haptics";

export default function AccountTypeStep({
  profileType,
  onChangeProfileType,
  onNext,
  onBack,
}) {
  return (
    <View className="flex-1 justify-between px-5 py-4 w-full">
      <View className="flex-1">
        {/* Header Tag */}
        <View className="flex-row items-center justify-end mb-6">
          <View className="bg-noirMint/10 border border-noirMint/20 px-3 py-1.5 rounded-full">
            <Text className="text-noirMint font-noir text-[11px] font-semibold tracking-[0.5px]">
              Account Type
            </Text>
          </View>
        </View>

        <Text className="text-[30px] text-noirText font-noir-medium tracking-[-0.5px] leading-[36px] mb-2">
          Select Account Type
        </Text>
        <Text className="text-[13px] text-white/50 font-noir leading-[20px] mb-8">
          Choose the profile that matches your trading operations. Both personal and corporate OTC profiles are fully supported.
        </Text>

        {/* Option Cards */}
        <View className="gap-4">
          {ACCOUNT_TYPE_OPTIONS.map((opt) => {
            const isSelected = profileType === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  haptic.selection();
                  onChangeProfileType(opt.key);
                }}
                activeOpacity={0.85}
                className={`w-full rounded-3xl overflow-hidden border transition-all ${isSelected
                  ? "border-noirMint/50"
                  : "border-white/[0.08]"
                  }`}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? ["#0d3d2a", "#072418", "#03120c"]
                      : ["#081d15", "#05140f", "#020a07"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full p-5 relative overflow-hidden"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start gap-4 flex-1 pr-3">
                      {/* Icon Container */}
                      <View
                        className={`w-12 h-12 rounded-2xl items-center justify-center ${isSelected
                          ? "bg-black/15"
                          : "bg-black/5"
                          }`}
                      >
                        <Feather
                          name={opt.icon}
                          size={22}
                          color={isSelected ? "#baffd8" : "rgba(255,255,255,0.55)"}
                        />
                      </View>

                      {/* Text Details */}
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Text className="text-white font-noir-medium text-[16px] font-semibold">
                            {opt.label}
                          </Text>
                        </View>
                        <Text
                          className={`font-noir text-[12px] leading-[18px] ${isSelected ? "text-gray-300" : "text-gray-400"
                            }`}
                        >
                          {opt.description}
                        </Text>
                      </View>
                    </View>

                    {/* Radio Indicator */}
                    <View
                      className={`w-6 h-6 rounded-full border items-center justify-center mt-1 ${isSelected
                        ? "border-noirMint bg-noirMint"
                        : "border-white/20 bg-transparent"
                        }`}
                    >
                      {isSelected && (
                        <Feather name="check" size={13} color="#111418" />
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Pinned Bottom Button */}
      <View className="w-full pt-4">
        <Button className="py-5" onPress={onNext} primary={true}>
          Continue
        </Button>
      </View>
    </View>
  );
}
