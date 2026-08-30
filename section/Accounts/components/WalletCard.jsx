import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";

/**
 * WalletCard — Standalone component for rendering individual whitelisted crypto wallet cards.
 */
export default function WalletCard({
  wallet = {},
  onCopy,
  onRemove,
  isRemoving = false,
}) {
  const maskAddress = (addr) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkMeta = (network, address) => {
    const net = (network || "").toUpperCase();
    if (net.includes("TRON") || /^T/.test(address || "")) {
      return { name: "TRON Network", badge: "TRC-20", icon: "shield", color: "#ff7b7b" };
    }
    if (net.includes("SOLANA") || (address && address.length >= 32 && !address.startsWith("0x") && !address.startsWith("T"))) {
      return { name: "Solana Network", badge: "SPL", icon: "layers", color: "#c084fc" };
    }
    return { name: "EVM Network", badge: "ERC-20", icon: "cpu", color: "#96dded" };
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    if (s === "APPROVED" || s === "VERIFIED" || s === "ACTIVE") {
      return { label: "Verified", badgeClass: "bg-noirMint/15 border-noirMint/30 text-noirMint" };
    }
    if (s === "REJECTED") {
      return { label: "Rejected", badgeClass: "bg-red-500/15 border-red-500/30 text-red-400" };
    }
    return { label: "Under Review", badgeClass: "bg-amber-400/15 border-amber-400/30 text-amber-400" };
  };

  const meta = getNetworkMeta(wallet.network, wallet.address);
  const statusMeta = getStatusBadge(wallet.status);

  return (
    <View className="w-full bg-noirCard rounded-2xl p-5 border border-white/[0.04] relative overflow-hidden">
      {/* Header: Wallet Label & Status */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-3">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: `${meta.color}15` }}
          >
            <Feather name={meta.icon} size={18} color={meta.color} />
          </View>
          <View>
            <Text className="text-noirText font-noir-medium text-base">
              {wallet.label || "Crypto Wallet"}
            </Text>
            <Text className="text-gray-400 font-noir text-xs">
              {meta.badge}
            </Text>
          </View>
        </View>
        <View className={`px-2.5 py-1 rounded-full border ${statusMeta.badgeClass}`}>
          <Text className={`font-noir text-[11px] font-medium ${statusMeta.badgeClass.split(" ").pop()}`}>
            {statusMeta.label}
          </Text>
        </View>
      </View>

      {/* Wallet Address Details */}
      <View className="border-t border-white/[0.04] pt-4 gap-2.5">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 font-noir text-xs">
            Network
          </Text>
          <Text className="text-noirText font-noir-medium text-xs">
            {meta.name} ({meta.badge})
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 font-noir text-xs">
            Wallet Address
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onCopy?.(wallet.address)}
              className="flex-row items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg"
            >
              <Text className="text-noirCyan font-mono text-xs">
                {maskAddress(wallet.address)}
              </Text>
              <Feather name="copy" size={12} color="#96dded" />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isRemoving}
              onPress={() => onRemove?.(wallet.id, wallet.label)}
              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 items-center justify-center active:bg-red-500/20"
            >
              {isRemoving ? (
                <ActivityIndicator size="small" color="#ff7b7b" />
              ) : (
                <Feather name="trash-2" size={13} color="#ff7b7b" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
