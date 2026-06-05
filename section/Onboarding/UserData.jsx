import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Button from "../../components/Button";
import { Select } from "heroui-native";
import { TURNOVER_OPTIONS, ACCOUNT_TYPE_OPTIONS } from "./constants";

function SectionHeader({ label, color = "#baffd8" }) {
  return (
    <View className="flex-row items-center gap-2 mb-1">
      <View
        className="w-1 h-3.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text
        className="font-noir text-[10px] tracking-[1.8px] uppercase"
        style={{ color: color + "99" }}
      >
        {label}
      </Text>
    </View>
  );
}

function FieldLabel({ label, optional }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-white/35 font-noir text-[11px] tracking-[0.6px] uppercase">
        {label}
      </Text>
      {optional && (
        <View className="px-2 py-[2px] rounded-full bg-white/[0.04] border border-white/[0.06]">
          <Text className="text-white/25 font-noir text-[10px] tracking-wide">optional</Text>
        </View>
      )}
    </View>
  );
}

function FieldError({ message }) {
  return (
    <View className="flex-row items-center gap-1.5 pl-0.5">
      <Feather name="alert-circle" size={11} color="rgba(248,113,113,0.75)" />
      <Text className="text-red-400/75 font-noir text-[11px]">{message}</Text>
    </View>
  );
}

export default function UserDataScreen({
  profileType,
  onChangeProfileType,
  formData,
  setFormData,
  onSubmit,
  submitting,
}) {
  const [activeInput, setActiveInput] = useState(null);
  const [errors, setErrors] = useState({});

  const fullNameInputRef = useRef(null);
  const companyNameInputRef = useRef(null);
  const referralCodeInputRef = useRef(null);

  const selectedAccountTypeOption = ACCOUNT_TYPE_OPTIONS.map((opt) => ({
    value: opt.key,
    label: opt.label,
  })).find((opt) => opt.value === profileType);

  const handleAccountTypeChange = (option) => {
    if (option && !Array.isArray(option)) {
      onChangeProfileType(option.value);
    }
  };

  const displayAccountTypeLabel = () => {
    const found = ACCOUNT_TYPE_OPTIONS.find((opt) => opt.key === profileType);
    return found ? found.label : "Corporate Account";
  };

  const validate = () => {
    const err = {};
    if (!formData.fullName?.trim()) err.fullName = "Full name is required";
    if (profileType === "corporate" && !formData.companyName?.trim())
      err.companyName = "Company name is required";
    if (!formData.annualTurnover) err.annualTurnover = "Please select your annual turnover";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validate()) onSubmit();
  };

  const selectedTurnoverOption = TURNOVER_OPTIONS.map((opt) => ({
    value: opt.key,
    label: opt.label,
  })).find(
    (opt) => opt.label === formData.annualTurnover || opt.value === formData.annualTurnover
  );

  const handleTurnoverChange = (option) => {
    if (option && !Array.isArray(option)) {
      setFormData((prev) => ({ ...prev, annualTurnover: option.value }));
      if (errors.annualTurnover) setErrors((prev) => ({ ...prev, annualTurnover: null }));
    }
  };

  const displayTurnoverLabel = () => {
    if (!formData.annualTurnover) return "Select a range";
    const found = TURNOVER_OPTIONS.find(
      (opt) => opt.key === formData.annualTurnover || opt.label === formData.annualTurnover
    );
    return found ? found.label : formData.annualTurnover;
  };

  const inputContainerStyle = (fieldName) => ({
    ...(activeInput === fieldName
      ? {
        shadowColor: "#baffd8",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
      }
      : {}),
  });

  const inputBorderClass = (fieldName, errorKey) =>
    activeInput === fieldName
      ? "border-noirMint/50"
      : errors[errorKey]
        ? "border-red-500/50"
        : "border-white/[0.06]";

  return (
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
          <SectionHeader label="Identity" color="#baffd8" />

          {/* Account Type */}
          <View className="gap-1.5">
            <FieldLabel label="Account Type" />
            <Select
              presentation="bottom-sheet"
              value={selectedAccountTypeOption}
              onValueChange={handleAccountTypeChange}
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
                      {displayAccountTypeLabel()}
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
            <FieldLabel label="Full Name" />
            <Pressable
              onPress={() => fullNameInputRef.current?.focus()}
              className={`w-full rounded-2xl border bg-white/[0.03] flex-row items-center px-4 py-[14px] ${inputBorderClass("fullName", "fullName")}`}
              style={inputContainerStyle("fullName", "fullName")}
            >
              <Feather
                name="user"
                size={15}
                color={activeInput === "fullName" ? "#baffd8" : "rgba(255,255,255,0.28)"}
                style={{ marginRight: 10 }}
              />
              <TextInput
                ref={fullNameInputRef}
                placeholder="Your full name"
                placeholderTextColor="rgba(255,255,255,0.18)"
                value={formData.fullName}
                onChangeText={(text) => {
                  setFormData({ ...formData, fullName: text });
                  if (errors.fullName) setErrors({ ...errors, fullName: null });
                }}
                onFocus={() => setActiveInput("fullName")}
                onBlur={() => setActiveInput(null)}
                className="text-noirText font-noir text-[15px] flex-1"
                style={{ paddingVertical: 0 }}
                autoComplete="name"
                textContentType="name"
              />
            </Pressable>
            {errors.fullName && <FieldError message={errors.fullName} />}
          </View>

          {/* Company Name — animated conditional reveal */}
          {profileType === "corporate" && (
            <View className="gap-1.5">
              <FieldLabel label="Company Name" />
              <Pressable
                onPress={() => companyNameInputRef.current?.focus()}
                className={`w-full rounded-2xl border bg-white/[0.03] flex-row items-center px-4 py-[14px] ${inputBorderClass("companyName", "companyName")}`}
                style={inputContainerStyle("companyName", "companyName")}
              >
                <Feather
                  name="briefcase"
                  size={15}
                  color={activeInput === "companyName" ? "#baffd8" : "rgba(255,255,255,0.28)"}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  ref={companyNameInputRef}
                  placeholder="Your company name"
                  placeholderTextColor="rgba(255,255,255,0.18)"
                  value={formData.companyName}
                  onChangeText={(text) => {
                    setFormData({ ...formData, companyName: text });
                    if (errors.companyName) setErrors({ ...errors, companyName: null });
                  }}
                  onFocus={() => setActiveInput("companyName")}
                  onBlur={() => setActiveInput(null)}
                  className="text-noirText font-noir text-[15px] flex-1"
                  style={{ paddingVertical: 0 }}
                  autoComplete="organization-name"
                  textContentType="organizationName"
                />
              </Pressable>
              {errors.companyName && <FieldError message={errors.companyName} />}
            </View>
          )}
        </View>

        {/* ── Financials Section ── */}
        <View className="py-4 gap-4">
          <SectionHeader label="Financials" color="#96dded" />

          {/* Annual Turnover */}
          <View className="gap-1.5">
            <FieldLabel label="Annual Turnover" />
            <Select
              presentation="bottom-sheet"
              value={selectedTurnoverOption}
              onValueChange={handleTurnoverChange}
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
                      {displayTurnoverLabel()}
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
            {errors.annualTurnover && <FieldError message={errors.annualTurnover} />}
          </View>
        </View>

        {/* ── Referral Section ── */}
        <View className="pt-4 pb-12 gap-3">
          <View className="flex-row items-center justify-between">
            <SectionHeader label="Referral" color="#facc15" />
            <View className="px-2 py-[2px] rounded-full bg-yellow-500/[0.08] border border-yellow-500/20">
              <Text className="text-yellow-400/55 font-noir text-[10px] tracking-wide">optional</Text>
            </View>
          </View>

          <Pressable
            onPress={() => referralCodeInputRef.current?.focus()}
            className={`w-full rounded-2xl border bg-white/[0.03] flex-row items-center px-4 py-[14px] ${activeInput === "referralCode" ? "border-yellow-400/35" : "border-white/[0.06]"
              }`}
            style={
              activeInput === "referralCode"
                ? {
                  shadowColor: "#facc15",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.14,
                  shadowRadius: 10,
                }
                : {}
            }
          >
            <Feather
              name="gift"
              size={15}
              color={
                activeInput === "referralCode"
                  ? "rgba(250,204,21,0.65)"
                  : "rgba(255,255,255,0.28)"
              }
              style={{ marginRight: 10 }}
            />
            <TextInput
              ref={referralCodeInputRef}
              placeholder="e.g. WELCOME50"
              placeholderTextColor="rgba(255,255,255,0.18)"
              autoCapitalize="characters"
              value={formData.referralCode}
              onChangeText={(text) =>
                setFormData({ ...formData, referralCode: text.toUpperCase() })
              }
              onFocus={() => setActiveInput("referralCode")}
              onBlur={() => setActiveInput(null)}
              className="text-noirText font-noir text-[15px] flex-1"
              style={{ paddingVertical: 0 }}
              autoComplete="off"
              textContentType="none"
            />
          </Pressable>
        </View>
      </View>

      {/* CTA */}
      <Button onPress={handleNext} disabled={submitting} primary={true} className="py-5">
        {submitting ? "Saving..." : "Complete Setup"}
      </Button>
    </View>
  );
}
