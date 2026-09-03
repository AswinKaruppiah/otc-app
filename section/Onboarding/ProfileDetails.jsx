import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "../../components/Button";
import { Select } from "heroui-native";
import { TURNOVER_OPTIONS } from "./constants";

export default function ProfileDetailsStep({
  profileType,
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const [errors, setErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  const handleNext = () => {
    const newErrors = {};
    if (!formData.fullName || !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const cleanPhone = (formData.phone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (profileType === "corporate" && (!formData.companyName || !formData.companyName.trim())) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.annualTurnover) {
      newErrors.annualTurnover = "Annual turnover range is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onNext();
    }
  };

  const selectedTurnover = TURNOVER_OPTIONS.find(
    (opt) => opt.key === formData.annualTurnover || opt.label === formData.annualTurnover
  );

  return (
    <View className="flex-1 justify-between px-5 py-4 w-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step Badge & Header */}
        <View className="flex-row items-center justify-between mb-6">
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              className="flex-row items-center bg-white/5 pl-1.5 pr-3 py-1.5 rounded-full"
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={20}
                color="rgba(255,255,255,0.4)"
              />
              <Text className="text-white/40 font-noir text-[12px] -mt-0.5 tracking-[0.5px]">
                Back
              </Text>
            </TouchableOpacity>
          )}
          <View className="bg-noirBg border border-white/[0.04] px-2.5 py-2 rounded-full">
            <Text className="text-noirCyan font-noir text-[10px] -mb-px leading-none tracking-[0.5px]">
              Personal Details
            </Text>
          </View>
        </View>

        <Text className="text-[30px] text-noirText font-noir tracking-[-0.5px] leading-[34px] mb-2">
          Profile Details
        </Text>
        <Text className="text-[13px] text-white/30 font-noir leading-[19px] mb-6">
          Provide your details to set up your profile.
        </Text>

        {/* Form Container */}
        <View className="gap-5">
          {/* Full Name */}
          <View className="gap-1.5">
            <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
              Full Name
            </Text>
            <View
              className={`w-full rounded-md border bg-noirBg flex-row items-center px-4 py-[14px] ${
                errors.fullName
                  ? "border-red-500/50"
                  : focusedInput === "fullName"
                  ? "border-noirMint"
                  : "border-white/[0.06]"
              }`}
            >
              <TextInput
                placeholder="Your full name"
                placeholderTextColor="rgba(255,255,255,0.18)"
                value={formData.fullName}
                onFocus={() => setFocusedInput("fullName")}
                onBlur={() => setFocusedInput(null)}
                onChangeText={(text) => {
                  setFormData({ ...formData, fullName: text });
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: null }));
                  }
                }}
                className="text-noirText font-noir text-[15px] flex-1"
                style={{ paddingVertical: 0 }}
              />
            </View>
            {errors.fullName && (
              <View className="flex-row items-center gap-1.5 pl-0.5">
                <Feather name="alert-circle" size={11} color="rgba(248,113,113,0.75)" />
                <Text className="text-red-400/75 font-noir text-[11px]">{errors.fullName}</Text>
              </View>
            )}
          </View>

          {/* Phone Number */}
          <View className="gap-1.5">
            <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
              Phone Number
            </Text>
            <View
              className={`w-full rounded-md border bg-noirBg flex-row items-center px-4 py-[14px] ${
                errors.phone
                  ? "border-red-500/50"
                  : focusedInput === "phone"
                  ? "border-noirMint"
                  : "border-white/[0.06]"
              }`}
            >
              <TextInput
                placeholder="Your phone number"
                placeholderTextColor="rgba(255,255,255,0.18)"
                keyboardType="phone-pad"
                maxLength={10}
                value={formData.phone}
                onFocus={() => setFocusedInput("phone")}
                onBlur={() => setFocusedInput(null)}
                onChangeText={(text) => {
                  const numericOnly = text.replace(/[^0-9]/g, "");
                  setFormData({ ...formData, phone: numericOnly });
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: null }));
                  }
                }}
                className="text-noirText font-noir text-[15px] flex-1"
                style={{ paddingVertical: 0 }}
              />
            </View>
            {errors.phone && (
              <View className="flex-row items-center gap-1.5 pl-0.5">
                <Feather name="alert-circle" size={11} color="rgba(248,113,113,0.75)" />
                <Text className="text-red-400/75 font-noir text-[11px]">{errors.phone}</Text>
              </View>
            )}
          </View>

          {/* Company Name */}
          {profileType === "corporate" && (
            <View className="gap-1.5">
              <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
                Company Name
              </Text>
              <View
                className={`w-full rounded-md border bg-noirBg flex-row items-center px-4 py-[14px] ${
                  errors.companyName
                    ? "border-red-500/50"
                    : focusedInput === "companyName"
                    ? "border-noirMint"
                    : "border-white/[0.06]"
                }`}
              >
                <TextInput
                  placeholder="Your company name"
                  placeholderTextColor="rgba(255,255,255,0.18)"
                  value={formData.companyName}
                  onFocus={() => setFocusedInput("companyName")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={(text) => {
                    setFormData({ ...formData, companyName: text });
                    if (errors.companyName) {
                      setErrors((prev) => ({ ...prev, companyName: null }));
                    }
                  }}
                  className="text-noirText font-noir text-[15px] flex-1"
                  style={{ paddingVertical: 0 }}
                />
              </View>
              {errors.companyName && (
                <View className="flex-row items-center gap-1.5 pl-0.5">
                  <Feather name="alert-circle" size={11} color="rgba(248,113,113,0.75)" />
                  <Text className="text-red-400/75 font-noir text-[11px]">{errors.companyName}</Text>
                </View>
              )}
            </View>
          )}

          {/* Annual Turnover */}
          <View className="gap-1.5">
            <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
              Annual Turnover
            </Text>
            <Select
              presentation="bottom-sheet"
              value={{ value: formData.annualTurnover }}
              onValueChange={(option) => {
                if (option && !Array.isArray(option)) {
                  setFormData((prev) => ({ ...prev, annualTurnover: option.value }));
                  if (errors.annualTurnover) {
                    setErrors((prev) => ({ ...prev, annualTurnover: null }));
                  }
                }
              }}
            >
              <Select.Trigger variant="unstyled" asChild>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => Keyboard.dismiss()}
                  className={`w-full rounded-md border bg-noirBg flex-row items-center justify-between px-4 py-[14px] ${
                    errors.annualTurnover ? "border-red-500/50" : "border-white/[0.06]"
                  }`}
                >
                  <Text
                    className={`font-noir text-[15px] ${
                      formData.annualTurnover ? "text-noirText" : "text-white/20"
                    }`}
                  >
                    {selectedTurnover?.label || "Select a range"}
                  </Text>
                  <Feather name="chevron-down" size={15} color="rgba(255,255,255,0.25)" />
                </TouchableOpacity>
              </Select.Trigger>
              <Select.Portal>
                <Select.Overlay className="bg-black/50" />
                <Select.Content
                  presentation="bottom-sheet"
                  contentContainerClassName="p-6 pb-12"
                >
                  <Select.ListLabel className="text-lg text-noirText font-noir-medium mb-4">
                    Annual Turnover Range
                  </Select.ListLabel>
                  {TURNOVER_OPTIONS.map((opt) => (
                    <Select.Item
                      key={opt.key}
                      value={opt.key}
                      label={opt.label}
                      className="flex-row items-center justify-between py-4"
                    >
                      {({ isSelected }) => (
                        <View className="flex-row items-center justify-between w-full">
                          <Text
                            className={`font-noir text-[15px] ${
                              isSelected ? "text-noirMint" : "text-noirText"
                            }`}
                          >
                            {opt.label}
                          </Text>
                          {isSelected && <Feather name="check" size={16} color="#baffd8" />}
                        </View>
                      )}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>
            {errors.annualTurnover && (
              <View className="flex-row items-center gap-1.5 pl-0.5">
                <Feather name="alert-circle" size={11} color="rgba(248,113,113,0.75)" />
                <Text className="text-red-400/75 font-noir text-[11px]">{errors.annualTurnover}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Pinned Bottom Button */}
      <View className="w-full pt-4">
        <Button className="py-5" onPress={handleNext} primary={true}>
          Next
        </Button>
      </View>
    </View>
  );
}
