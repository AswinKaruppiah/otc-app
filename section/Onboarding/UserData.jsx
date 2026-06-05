import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";
import { Select } from "heroui-native";
import { TURNOVER_OPTIONS, ACCOUNT_TYPE_OPTIONS } from "./constants";

export default function UserDataScreen({
  profileType,
  onChangeProfileType,
  formData,
  setFormData,
  onSubmit,
  submitting,
}) {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    onSubmit();
  };

  const selectedAccountType = ACCOUNT_TYPE_OPTIONS.find((opt) => opt.key === profileType) || ACCOUNT_TYPE_OPTIONS[0];
  const selectedTurnover = TURNOVER_OPTIONS.find((opt) => opt.key === formData.annualTurnover || opt.label === formData.annualTurnover);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="w-full flex-col">
        {/* Header */}
        <View className="mb-7">
          <Text className="text-[30px] text-noirText font-noir tracking-[-0.5px] leading-[34px] mb-2.5">
            Set up your{"\n"}profile
          </Text>
          <Text className="text-[13px] text-white/30 font-noir leading-[19px]">
            Tell us a bit about yourself to get started.
          </Text>
        </View>

        {/* Form Card */}
        <View className="w-full mb-6">
          {/* ── Identity Section ── */}
          <View className="pt-5 pb-4 gap-4">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-1 h-3.5 rounded-full bg-noirMint/60" />
              <Text className="font-noir text-[10px] tracking-[1.8px] uppercase text-noirMint/60">
                Identity
              </Text>
            </View>

            {/* Account Type */}
            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
                  Account Type
                </Text>
              </View>
              <Select
                presentation="bottom-sheet"
                value={{ value: profileType }}
                onValueChange={(option) => {
                  if (option && !Array.isArray(option)) {
                    onChangeProfileType(option.value);
                  }
                }}
              >
                <Select.Trigger variant="unstyled" asChild>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-full rounded-2xl border bg-white/[0.03] border-white/[0.06] flex-row items-center justify-between px-4 py-[14px]"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 rounded-xl bg-noirMint/10 items-center justify-center">
                        <Feather name="briefcase" size={14} color="#baffd8" />
                      </View>
                      <Text className="font-noir text-[15px] text-noirText">
                        {selectedAccountType?.label || "Business Account"}
                      </Text>
                    </View>
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
                      Select Account Type
                    </Select.ListLabel>
                    {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                      <Select.Item
                        key={opt.key}
                        value={opt.key}
                        label={opt.label}
                        disabled={opt.disabled}
                        className="w-full mb-3 rounded-xl overflow-hidden p-0 border border-transparent"
                      >
                        {({ isSelected }) => (
                          <View
                            className={`w-full p-4 rounded-xl border flex-row items-center justify-between ${opt.disabled
                              ? "bg-noirCard border-white/[0.04] opacity-50"
                              : isSelected
                                ? "bg-noirCyan/10 border-noirCyan/50"
                                : "bg-noirCard border-white/[0.04]"
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
                                  color={
                                    !opt.disabled && isSelected
                                      ? "#baffd8"
                                      : "rgba(255,255,255,0.55)"
                                  }
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
                              className={`w-5 h-5 rounded-full border items-center justify-center ${!opt.disabled && isSelected
                                ? "border-noirCyan bg-noirCyan"
                                : "border-white/20"
                                }`}
                            >
                              {!opt.disabled && isSelected && (
                                <View className="w-2 h-2 rounded-full bg-noirBg" />
                              )}
                            </View>
                          </View>
                        )}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Portal>
              </Select>
            </View>

            {/* Full Name */}
            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
                  Full Name
                </Text>
              </View>
              <View
                className={`w-full rounded-2xl border bg-white/[0.03] flex-row items-center px-4 py-[14px] ${errors.fullName ? "border-red-500/50" : "border-white/[0.06]"}`}
              >
                <Feather
                  name="user"
                  size={15}
                  color="rgba(255,255,255,0.28)"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="Your full name"
                  placeholderTextColor="rgba(255,255,255,0.18)"
                  value={formData.fullName}
                  onChangeText={(text) => {
                    setFormData({ ...formData, fullName: text });
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

            {/* Company Name */}
            {profileType === "corporate" && (
              <View className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
                    Company Name
                  </Text>
                </View>
                <View
                  className={`w-full rounded-2xl border bg-white/[0.03] flex-row items-center px-4 py-[14px] ${errors.companyName ? "border-red-500/50" : "border-white/[0.06]"}`}
                >
                  <Feather
                    name="briefcase"
                    size={15}
                    color="rgba(255,255,255,0.28)"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    placeholder="Your company name"
                    placeholderTextColor="rgba(255,255,255,0.18)"
                    value={formData.companyName}
                    onChangeText={(text) => {
                      setFormData({ ...formData, companyName: text });
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
          </View>

          {/* ── Financials Section ── */}
          <View className="py-4 gap-4">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-1 h-3.5 rounded-full bg-noirCyan/60" />
              <Text className="font-noir text-[10px] tracking-[1.8px] uppercase text-noirCyan/60">
                Financials
              </Text>
            </View>

            {/* Annual Turnover */}
            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
                  Annual Turnover
                </Text>
              </View>
              <Select
                presentation="bottom-sheet"
                value={{ value: formData.annualTurnover }}
                onValueChange={(option) => {
                  if (option && !Array.isArray(option)) {
                    setFormData((prev) => ({ ...prev, annualTurnover: option.value }));
                  }
                }}
              >
                <Select.Trigger variant="unstyled" asChild>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className={`w-full rounded-2xl border bg-white/[0.03] flex-row items-center justify-between px-4 py-[14px] ${errors.annualTurnover ? "border-red-500/50" : "border-white/[0.06]"
                      }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`w-8 h-8 rounded-xl items-center justify-center ${formData.annualTurnover ? "bg-noirCyan/10" : "bg-white/[0.03]"
                          }`}
                      >
                        <Feather
                          name="trending-up"
                          size={14}
                          color={formData.annualTurnover ? "#96dded" : "rgba(255,255,255,0.28)"}
                        />
                      </View>
                      <Text
                        className={`font-noir text-[15px] ${formData.annualTurnover ? "text-noirText" : "text-white/20"
                          }`}
                      >
                        {selectedTurnover?.label || "Select a range"}
                      </Text>
                    </View>
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
                              className={`font-noir text-[15px] ${isSelected ? "text-noirMint" : "text-noirText"
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

          {/* ── Referral Section ── */}
          <View className="pt-4 pb-12 gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="w-1 h-3.5 rounded-full bg-yellow-400/60" />
                <Text className="font-noir text-[10px] tracking-[1.8px] uppercase text-yellow-400/60">
                  Referral
                </Text>
              </View>
              <View className="px-2 py-[2px] rounded-full bg-yellow-500/[0.08] border border-yellow-500/20">
                <Text className="text-yellow-400/55 font-noir text-[10px] tracking-wide">optional</Text>
              </View>
            </View>

            <View
              className="w-full rounded-2xl border bg-white/[0.03] border-white/[0.06] flex-row items-center px-4 py-[14px]"
            >
              <Feather
                name="gift"
                size={15}
                color="rgba(255,255,255,0.28)"
                style={{ marginRight: 10 }}
              />
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

        {/* CTA */}
        <Button onPress={handleNext} disabled={submitting} primary={true} className="py-5">
          {submitting ? "Saving..." : "Complete Setup"}
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
