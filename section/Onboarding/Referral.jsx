import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "../../components/Button";

export default function ReferralStep({
  formData,
  setFormData,
  onSubmit,
  onBack,
  submitting,
}) {
  return (
    <View className="flex-1 justify-between px-5 py-4 w-full">
      <View className="flex-1">
        {/* Step Badge & Header */}
        <View className="flex-row items-center justify-between mb-6">
          {onBack && (
            <TouchableOpacity onPress={onBack} className="flex-row items-center bg-white/5 pl-1.5 pr-3 py-1.5 rounded-full">
              <MaterialIcons name="keyboard-arrow-left" size={20} color="rgba(255,255,255,0.4)" />
              <Text className="text-white/40 font-noir text-[12px] -mt-0.5 tracking-[0.5px]">
                Back
              </Text>
            </TouchableOpacity>
          )}
          <View className="bg-noirBg border border-white/[0.04] px-2.5 py-2 rounded-full">
            <Text className="text-yellow-400 font-noir text-[10px] -mb-px leading-none tracking-[0.5px]">
              Referral
            </Text>
          </View>
        </View>

        <Text className="text-[30px] text-noirText font-noir tracking-[-0.5px] leading-[34px] mb-2">
          Referral Code
        </Text>
        <Text className="text-[13px] text-white/30 font-noir leading-[19px] mb-8">
          If you were referred by someone, enter their code below.
        </Text>

        {/* Referral Code Input */}
        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
              Referral Code
            </Text>
            <View className="px-2 py-[2px] rounded-full bg-yellow-500/[0.08] border border-yellow-500/20">
              <Text className="text-yellow-400/55 font-noir -mt-px text-[10px] tracking-wide">optional</Text>
            </View>
          </View>

          <View className="w-full rounded-md border bg-noirBg border-white/[0.06] flex-row items-center px-4 py-[14px]">
            <TextInput
              placeholder="e.g. WELCOME50"
              placeholderTextColor="rgba(255,255,255,0.18)"
              autoCapitalize="characters"
              value={formData.referralCode}
              onChangeText={(text) => {
                setFormData({ ...formData, referralCode: text.toUpperCase() });
              }}
              className="text-noirText font-noir text-[15px] flex-1"
              style={{ paddingVertical: 0 }}
            />
          </View>
        </View>
      </View>

      {/* Pinned Bottom Button */}
      <View className="w-full pt-4">
        <Button className="py-5" onPress={onSubmit} disabled={submitting} primary={true}>
          {submitting ? "Saving..." : "Complete Setup"}
        </Button>
      </View>
    </View>
  );
}
