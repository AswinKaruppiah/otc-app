import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";
import { useToast } from "heroui-native";
import { ACCOUNT_TYPE_OPTIONS } from "./constants";

export default function AccountTypeStep({ profileType, onChangeProfileType, onNext, onBack }) {
  const { toast } = useToast();

  return (
    <View className="flex-1 justify-between px-5 py-4 w-full">
      <View className="flex-1">
        {/* Step Badge & Header */}
        <View className="flex-row items-center justify-end mb-6">
          <View className="bg-noirBg border border-white/[0.04] px-2.5 py-2 rounded-full">
            <Text className="text-noirMint font-noir text-[10px] -mb-px leading-none tracking-[0.5px]">
              Account Type
            </Text>
          </View>
        </View>

        <Text className="text-[30px] text-noirText font-noir tracking-[-0.5px] leading-[34px] mb-2">
          Account Type
        </Text>
        <Text className="text-[13px] text-white/30 font-noir leading-[19px] mb-8">
          Choose the profile that matches your trading needs.
        </Text>

        {/* Option Cards */}
        <View className="gap-4">
          {ACCOUNT_TYPE_OPTIONS.map((opt) => {
            const isSelected = profileType === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  if (opt.disabled) {
                    toast?.show({
                      label: "Coming Soon",
                      description: "Individual accounts are coming soon!",
                      variant: "warning",
                    });
                  } else {
                    onChangeProfileType(opt.key);
                  }
                }}
                activeOpacity={0.8}
                className={`w-full p-4 rounded-2xl border flex-row items-center justify-between ${opt.disabled
                    ? "bg-noirCard border-white/[0.04] opacity-40"
                    : isSelected
                      ? "bg-noirCyan/10 border-noirCyan/50"
                      : "bg-white/[0.03] border-white/[0.06]"
                  }`}
              >
                <View className="flex-row items-start gap-4 flex-1 pr-4">
                  <View
                    className={`w-12 h-12 rounded-2xl items-center justify-center ${!opt.disabled && isSelected ? "bg-noirCard" : "bg-white/5"
                      }`}
                  >
                    <Feather
                      name={opt.icon}
                      size={22}
                      color={!opt.disabled && isSelected ? "#baffd8" : "rgba(255,255,255,0.55)"}
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-noirText font-noir-medium text-[16px]">
                        {opt.label}
                      </Text>
                      {opt.soon && (
                        <View className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                          <Text className="text-yellow-400 font-noir text-[10px] tracking-wide">
                            SOON
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-400 font-noir text-[12px] leading-[17px]">
                      {opt.description}
                    </Text>
                  </View>
                </View>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${!opt.disabled && isSelected ? "border-noirCyan bg-noirCyan" : "border-white/20"
                    }`}
                >
                  {!opt.disabled && isSelected && (
                    <View className="w-2 h-2 rounded-full bg-noirBg" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Pinned Bottom Button */}
      <View className="w-full pt-4">
        <Button className="py-5" onPress={onNext} primary={true}>
          Next
        </Button>
      </View>
    </View>
  );
}
