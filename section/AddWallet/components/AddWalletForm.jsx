import { useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, findNodeHandle } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Show from "../../../components/Show";
import { useScrollViewRef } from "../../../context/ScrollContext";

function detectNetwork(address) {
  if (!address) return null;
  const clean = address.trim();
  if (/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(clean)) return "tron";
  if (/^0x[0-9a-fA-F]{40}$/.test(clean)) return "evm";
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) return "solana";
  return null;
}

const NETWORK_META = {
  tron: {
    label: "TRON",
    short: "TRC-20",
    chipBg: "bg-red-500/15 border border-red-500/30",
    textClass: "text-red-400",
    dotClass: "bg-red-500",
    hint: "TRON (TRC-20) address detected",
  },
  evm: {
    label: "EVM",
    short: "ERC-20",
    chipBg: "bg-sky-500/15 border border-sky-500/30",
    textClass: "text-sky-400",
    dotClass: "bg-sky-500",
    hint: "EVM-compatible (ERC-20) address detected",
  },
  solana: {
    label: "Solana",
    short: "SPL",
    chipBg: "bg-purple-500/15 border border-purple-500/30",
    textClass: "text-purple-400",
    dotClass: "bg-purple-500",
    hint: "Solana (SPL) address detected",
  },
};

/**
 * AddWalletForm — Form fields and action buttons for adding a whitelisted crypto wallet address.
 * Auto-detects TRON (TRC-20), EVM (ERC-20), and Solana (SPL) network formats with live validation badges.
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
            120, // offset above soft keyboard
            true
          );
        } else {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }
    }, 150);
  };

  const network = useMemo(() => detectNetwork(address), [address]);
  const netMeta = network ? NETWORK_META[network] : null;
  const isInvalidFormat = address.trim().length > 10 && !network;
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
            Wallet Address *
          </Text>
          <View className="w-full relative justify-center">
            <TextInput
              value={address}
              onChangeText={setAddress}
              onFocus={handleInputFocus}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Paste your TRON, EVM, or Solana address"
              placeholderTextColor="#6B7280"
              className={`w-full h-13 bg-white/5 border rounded-xl pl-4 ${
                netMeta ? "pr-24" : "pr-4"
              } font-mono text-xs text-white ${
                isInvalidFormat ? "border-red-500/60 bg-red-500/5" : "border-white/10"
              }`}
            />
            {netMeta && (
              <View className={`absolute right-3 px-2 py-1 rounded-lg flex-row items-center gap-1.5 ${netMeta.chipBg}`}>
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
                  Unrecognized format. Supported: TRON (T...), EVM (0x...), Solana (Base58)
                </Text>
              </View>
            </Show.ElseIf>
          </Show>
        </View>

        {/* 3. Supported Networks Info Card */}
        <View className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 gap-3 mt-1">
          <View className="flex-row items-center gap-2">
            <Feather name="info" size={15} color="#96dded" />
            <Text className="text-xs font-noir-medium text-white">Supported Networks</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {Object.entries(NETWORK_META).map(([key, meta]) => (
              <View key={key} className={`px-2.5 py-1 rounded-lg flex-row items-center gap-1.5 ${meta.chipBg}`}>
                <View className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
                <Text className={`text-[10px] font-noir-medium ${meta.textClass}`}>
                  {meta.label} ({meta.short})
                </Text>
              </View>
            ))}
          </View>
          <Text className="text-[11px] font-noir text-gray-400 leading-4">
            The network is auto-detected from your address. Your wallet will be manually reviewed before it is activated for withdrawals.
          </Text>
        </View>
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
          className={`flex-1 py-4 rounded-full flex-row items-center justify-center gap-2 ${
            canSubmit
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
