import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton } from "heroui-native";
import Show from "../../../components/Show";

/**
 * WithdrawBalanceCard — Hero gradient card displaying total balance, available USDT, on-hold balance, and INR value.
 */
export default function WithdrawBalanceCard({
  walletBalance = 0,
  walletHold = 0,
  loading = false,
}) {
  const totalBalance = walletBalance + walletHold;

  return (
    <View
      style={{ borderRadius: 24, overflow: "hidden" }}
      className="w-full mb-6 shadow-2xl border border-white/10"
    >
      <LinearGradient
        colors={["#0c1417", "#0a221b", "#06130e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 22 }}
        className="w-full relative"
      >
        <Text className="text-xs font-noir text-gray-400 uppercase tracking-wider mb-2">
          Total Balance
        </Text>

        <Show>
          <Show.If isTrue={loading}>
            <Skeleton className="h-10 w-44 rounded-xl bg-white/10 mb-2" />
            <Skeleton className="h-4 w-32 rounded bg-white/10 mb-4" />
          </Show.If>
          <Show.Else>
            <View className="flex-row items-baseline gap-2 mb-1">
              <Text className="text-4xl font-noir font-bold text-white tracking-tight">
                {totalBalance.toFixed(2)}
              </Text>
              <Text className="text-base font-noir font-semibold text-gray-400">
                USDT
              </Text>
            </View>
            <Text className="text-xs font-noir text-gray-400 mb-4">
              ≈ ₹{(totalBalance * 98.49).toLocaleString("en-IN", { maximumFractionDigits: 2 })} INR at current rate
            </Text>
          </Show.Else>
        </Show>

        {/* Split Stats: Available vs On Hold */}
        <View className="flex-row gap-3 pt-2 border-t border-white/10">
          {/* Available */}
          <View className="flex-1 bg-noirMint/10 border border-noirMint/20 rounded-xl p-3 flex-row items-center gap-2.5">
            <View className="w-7 h-7 rounded-lg bg-noirMint/20 items-center justify-center">
              <Feather name="arrow-up-right" size={14} color="#baffd8" />
            </View>
            <View>
              <Text className="text-[10px] font-noir text-gray-400">Available</Text>
              <Text className="text-sm font-noir font-bold text-noirMint">
                {walletBalance.toFixed(2)} USDT
              </Text>
            </View>
          </View>

          {/* On Hold */}
          {walletHold > 0 && (
            <View className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex-row items-center gap-2.5">
              <View className="w-7 h-7 rounded-lg bg-amber-500/20 items-center justify-center">
                <Feather name="clock" size={14} color="#fbbf24" />
              </View>
              <View>
                <Text className="text-[10px] font-noir text-gray-400">On Hold</Text>
                <Text className="text-sm font-noir font-bold text-amber-400">
                  {walletHold.toFixed(2)} USDT
                </Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
