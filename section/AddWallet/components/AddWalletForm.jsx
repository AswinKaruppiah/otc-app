import { useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, findNodeHandle } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import Show from "../../../components/Show";
import { useScrollViewRef } from "../../../context/ScrollContext";

function detectNetwork(address) {
  if (!address) return null;
  const clean = address.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (/^T[a-zA-Z0-9]{30,34}$/.test(clean)) return "tron";
  return null;
}

const NETWORK_META = {
  tron: {
    label: "TRON Network",
    short: "TRC-20",
    chipBg: "bg-red-500/15 border border-red-500/30",
    textClass: "text-red-400",
    dotClass: "bg-red-400",
    hint: "Valid TRON (TRC-20) address detected",
  },
};

/**
 * AddWalletForm — Form fields and action buttons for adding a whitelisted TRON (TRC-20) crypto wallet address.
 */
export default function AddWalletForm({
  label,
  setLabel,
  address,
  setAddress,
  loading,
  onSubmit,
  onCancel,
}) {
  const scrollViewRef = useScrollViewRef();

  const handleInputFocus = (e) => {
    const targetHandle = findNodeHandle(e.target);
    setTimeout(() => {
      if (scrollViewRef?.current) {
        if (targetHandle) {
          scrollViewRef.current?.getScrollResponder()?.scrollResponderScrollNativeHandleToKeyboard(
            targetHandle,
            120,
            true
          );
        } else {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }
    }, 150);
  };

  const handleAddressChange = (val) => {
    // Strip invisible formatting characters, spaces, and linebreaks from paste
    setAddress(val.replace(/[\s\u200B-\u200D\uFEFF]/g, ""));
  };

  const cleanAddress = address.replace(/[^a-zA-Z0-9]/g, "").trim();
  const network = useMemo(() => detectNetwork(cleanAddress), [cleanAddress]);
  const netMeta = network ? NETWORK_META[network] : null;
  const isInvalidFormat = cleanAddress.length >= 33 && !network;
  const canSubmit = label.trim().length > 0 && network !== null && !loading;

  return (
    <View className="w-full flex-1 justify-between">
      {/* Form Inputs Group */}
      <View className="gap-5 w-full">
        {/* 1. Label / Nickname Field */}
        <View className="gap-2">
          <Text className="text-xs font-noir font-semibold text-gray-300">
            Nickname / Label *
          </Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            onFocus={handleInputFocus}
            placeholder="e.g. Main Treasury Wallet, Cold Storage"
            placeholderTextColor="#6B7280"
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 font-noir text-sm text-white"
          />
          <Text className="text-[11px] font-noir text-gray-500 pl-1">
            A friendly name to identify this wallet address.
          </Text>
        </View>

        {/* 2. Wallet Address Field */}
        <View className="gap-2">
          <Text className="text-xs font-noir font-semibold text-gray-300">
            Wallet Address (TRON TRC-20) *
          </Text>
          <View className="w-full relative justify-center">
            <TextInput
              value={address}
              onChangeText={handleAddressChange}
              onFocus={handleInputFocus}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter TRON address starting with T..."
              placeholderTextColor="#6B7280"
              className={`w-full h-13 bg-white/5 border rounded-xl pl-4 ${netMeta ? "pr-24" : "pr-4"
                } font-mono text-xs text-white ${isInvalidFormat ? "border-red-500/60 bg-red-500/5" : "border-white/10"
                }`}
            />
            {netMeta && (
              <View className={`absolute right-3 px-2.5 py-1 rounded-lg flex-row items-center gap-1.5 ${netMeta.chipBg}`}>
                <View className={`w-1.5 h-1.5 rounded-full ${netMeta.dotClass}`} />
                <Text className={`text-[10px] font-noir-medium ${netMeta.textClass}`}>
                  {netMeta?.short}
                </Text>
              </View>
            )}
          </View>

          {/* Validation Feedback */}
          <Show>
            <Show.If isTrue={!!netMeta && !isInvalidFormat}>
              <View className="flex-row items-center gap-1.5 pl-1 mt-0.5">
                <Feather name="check-circle" size={13} color="#6df0a3" />
                <Text className="text-noirMint font-noir text-[11px]">
                  {netMeta?.hint}
                </Text>
              </View>
            </Show.If>
            <Show.ElseIf isTrue={isInvalidFormat}>
              <View className="flex-row items-center gap-1.5 pl-1 mt-0.5">
                <Feather name="alert-circle" size={13} color="#ff7b7b" />
                <Text className="text-red-400 font-noir text-[11px]">
                  Must be a valid 34-character TRON address starting with 'T'
                </Text>
              </View>
            </Show.ElseIf>
          </Show>
        </View>

        {/* 3. Supported Network Glassmorphic Info Card */}
        <LinearGradient
          colors={["rgba(255, 82, 82, 0.2)", "rgba(255, 255, 255, 0.04)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 1 }}
          className="w-full mt-1"
        >
          <View className="w-full bg-[#0c1215] rounded-[19px] p-4 gap-3.5 overflow-hidden">
            {/* Header: TRON Shield Icon Badge & Title */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 items-center justify-center">
                  <Feather name="shield" size={18} color="#ff7b7b" />
                </View>
                <View>
                  <Text className="text-sm font-noir-medium font-bold text-white tracking-tight">
                    Supported Payout Network
                  </Text>
                  <Text className="text-xs font-noir font-semibold text-red-400 mt-0.5">
                    TRON Network (TRC-20)
                  </Text>
                </View>
              </View>

              <View className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/25">
                <Text className="text-[10px] font-noir font-bold text-red-400 tracking-wider uppercase">
                  ACTIVE
                </Text>
              </View>
            </View>

            {/* Requirement Bullet Points */}
            <View className="gap-2 border-t border-white/[0.06] pt-3">
              <View className="flex-row items-center gap-2">
                <Feather name="check" size={14} color="#baffd8" />
                <Text className="text-xs font-noir text-gray-300">
                  Address must start with <Text className="font-mono text-white font-bold">'T'</Text> (34 characters)
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Feather name="zap" size={14} color="#96dded" />
                <Text className="text-xs font-noir text-gray-300">
                  Automatic verification for fast payout activation
                </Text>
              </View>
            </View>

            {/* Security Footer Notice */}
            <View className="bg-black/40 border border-white/5 rounded-xl p-2.5 flex-row items-start gap-2 mt-0.5">
              <Feather name="lock" size={14} color="#baffd8" />
              <Text className="text-[11px] font-noir text-gray-400 flex-1 leading-4">
                Your whitelisted address is saved securely and used as your destination for crypto payouts & withdrawals.
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Action Buttons at Bottom */}
      <View className="flex-row gap-3 mt-auto pt-6">
        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-full items-center justify-center active:bg-white/10"
        >
          <Text className="font-noir font-semibold text-sm text-gray-300">
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          className={`flex-1 py-4 rounded-full flex-row items-center justify-center gap-2 ${canSubmit
            ? "bg-noirMint shadow-lg shadow-noirMint/20 active:opacity-80"
            : "bg-noirMint/20 opacity-40"
            }`}
        >
          <Show>
            <Show.If isTrue={loading}>
              <ActivityIndicator color="#111418" size="small" />
            </Show.If>
            <Show.Else>
              <Feather name="plus-circle" size={18} color="#111418" />
              <Text className="font-noir font-bold text-sm text-[#111418]">
                Add Address
              </Text>
            </Show.Else>
          </Show>
        </TouchableOpacity>
      </View>
    </View>
  );
}
