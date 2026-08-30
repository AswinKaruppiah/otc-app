import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton } from "heroui-native";
import Show from "../../../components/Show";
import { useScreenPadding } from "../../../context/ScrollContext";
import { truncateDecimal } from "../../../utils/helper";

/**
 * WithdrawBalanceCard — Hero card displaying total balance, available/on-hold stats, and Withdraw USDT CTA button.
 */
export default function WithdrawBalanceCard({
  walletBalance = 0,
  walletHold = 0,
  loading = false,
  onWithdrawPress,
}) {
  const totalBalance = walletBalance + walletHold;
  const { paddingTop, paddingHorizontal } = useScreenPadding();

  return (
    <View
      style={{
        borderRadius: 44,
        overflow: "hidden",
      }}
      className="mb-6"
    >
      <LinearGradient
        colors={["#020a06", "#0c3624", "#166648"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: paddingTop + 30,
          paddingHorizontal: paddingHorizontal,
          paddingBottom: 8,
        }}
        className="w-full relative"
      >
        {/* 1. TOTAL BALANCE Label */}
        <Text className="text-xs font-noir font-light uppercase text-white/40 mb-2 text-center tracking-wider">
          Total Balance
        </Text>

        {/* 2. Main Balance Display */}
        <Show>
          <Show.If isTrue={loading}>
            <Skeleton className="h-12 w-48 rounded-xl bg-white/10 mb-2 self-center" />
          </Show.If>
          <Show.Else>
            <View className="flex-row items-baseline justify-center gap-2 mb-1">
              <Text className="text-4xl sm:text-5xl font-noir font-normal text-white tracking-tight">
                {truncateDecimal(totalBalance, 2)}
              </Text>
              <Text className="text-4xl sm:text-5xl font-noir font-normal text-white/50">
                USDT
              </Text>
            </View>
            <Text className="text-xs font-noir font-normal text-gray-400 text-center mb-2">
              Instant TRC-20 Transfer
            </Text>
          </Show.Else>
        </Show>

        {/* 3. Bottom Section: Available & On-Hold Stats + Withdraw CTA */}
        <View className="w-full mt-6 gap-4">
          {/* Split Stats Row */}
          <Show>
            <Show.If isTrue={loading}>
              <View className="flex-row gap-3">
                <Skeleton className="flex-1 h-[68px] rounded-2xl bg-white/10" />
                <Skeleton className="flex-1 h-[68px] rounded-2xl bg-white/10" />
              </View>
            </Show.If>
            <Show.Else>
              <View className="flex-row gap-3">
                {/* Available Box */}
                <View className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl p-3.5 flex-row items-center gap-3">
                  <Feather name="arrow-up-right" size={24} color="#baffd8" />
                  <View className="flex-1 min-w-0">
                    <Text className="text-[10px] font-noir font-medium text-gray-400 uppercase tracking-wider">Available</Text>
                    <View className="flex-row items-baseline gap-1 mt-0.5">
                      <Text className="text-base font-noir font-bold text-white tracking-tight">
                        {truncateDecimal(walletBalance, 2)}
                      </Text>
                      <Text className="text-[10px] font-noir font-medium text-noirMint">
                        USDT
                      </Text>
                    </View>
                  </View>
                </View>

                {/* On Hold Box */}
                <View className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl p-3.5 flex-row items-center gap-3">
                  <Feather name="clock" size={24} color="#fbbf24" />
                  <View className="flex-1 min-w-0">
                    <Text className="text-[10px] font-noir font-medium text-gray-400 uppercase tracking-wider">On Hold</Text>
                    <View className="flex-row items-baseline gap-1 mt-0.5">
                      <Text className="text-base font-noir font-bold text-white tracking-tight">
                        {truncateDecimal(walletHold, 2)}
                      </Text>
                      <Text className="text-[10px] font-noir font-medium text-amber-400">
                        USDT
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Show.Else>
          </Show>

          {/* Withdraw USDT CTA Button */}
          <View style={{ marginHorizontal: -paddingHorizontal + 12 }}>
            <TouchableOpacity
              onPress={onWithdrawPress}
              disabled={loading}
              activeOpacity={0.85}
              className={`w-full py-5 rounded-full flex-row items-center justify-center gap-2 ${loading ? "bg-noirMint/50" : "bg-noirMint"
                }`}
            >
              <Feather name="upload" size={20} color="#111418" />
              <Text className="font-noir font-bold text-sm text-noirBg">
                Withdraw USDT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
