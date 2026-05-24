import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * Transactions Screen — Rendered inside the main layout wrapper.
 * Displays list of conversion and sending transactions.
 */
export default function Transactions() {
  const mockTransactions = [
    {
      id: "1",
      type: "Sent Conversion",
      pair: "USD ➔ EUR",
      amount: "-$120.00",
      converted: "+€110.40",
      date: "May 24, 2026 • 12:45 PM",
      status: "Completed",
      icon: "arrow-up-right",
      iconColor: "#ef4444",
    },
    {
      id: "2",
      type: "Received Conversion",
      pair: "INR ➔ USD",
      amount: "+₹35,000",
      converted: "+$420.50",
      date: "May 22, 2026 • 09:15 AM",
      status: "Completed",
      icon: "arrow-down-left",
      iconColor: "#22c55e",
    },
    {
      id: "3",
      type: "Exchanged Currencies",
      pair: "GBP ➔ JPY",
      amount: "-£250.00",
      converted: "+¥48,200",
      date: "May 20, 2026 • 04:30 PM",
      status: "Pending",
      icon: "repeat",
      iconColor: "#eab308",
    },
    {
      id: "4",
      type: "Sent Conversion",
      pair: "CAD ➔ USD",
      amount: "-$75.00",
      converted: "+$54.80",
      date: "May 18, 2026 • 11:20 AM",
      status: "Completed",
      icon: "arrow-up-right",
      iconColor: "#ef4444",
    },
  ];

  return (
    <View className="items-center justify-center py-[10px] w-full">
      {/* Header Badge */}
      <View className="bg-[#0a57ff]/20 border border-[#0a57ff]/40 px-4 py-1.5 rounded-full mb-6">
        <Text className="text-[#7eb8ff] text-[13px] font-semibold tracking-[0.5px]">📊 Activity Log</Text>
      </View>

      {/* Title */}
      <Text className="text-[38px] font-extrabold text-white mb-3 tracking-[-0.5px]">Transactions</Text>
      <Text className="text-[15px] text-[#9ba3af] text-center leading-[22px] mb-9 max-w-[300px]">
        Keep track of your recent conversions and transfers.
      </Text>

      {/* Transaction List */}
      <View className="w-full gap-4 mb-8">
        {mockTransactions.map((tx) => (
          <View
            key={tx.id}
            className="w-full bg-white/5 rounded-2xl p-4 border border-white/[0.08] flex-row items-center justify-between"
          >
            {/* Left Section: Icon & Info */}
            <View className="flex-row items-center gap-3.5 flex-1">
              <View
                className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: `${tx.iconColor}15` }}
              >
                <Feather name={tx.icon} size={20} color={tx.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-white mb-0.5">
                  {tx.type}
                </Text>
                <Text className="text-[12px] text-[#9ba3af] mb-1">
                  {tx.pair}
                </Text>
                <Text className="text-[11px] text-[#555c66]">
                  {tx.date}
                </Text>
              </View>
            </View>

            {/* Right Section: Amounts & Status */}
            <View className="items-end gap-1.5">
              <Text className="text-[15px] font-bold text-white">
                {tx.amount}
              </Text>
              <Text className="text-[13px] text-[#7eb8ff] font-medium">
                {tx.converted}
              </Text>
              <View
                className="px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: tx.status === "Completed" ? "rgba(34, 197, 94, 0.1)" : "rgba(234, 179, 8, 0.1)",
                  borderColor: tx.status === "Completed" ? "rgba(34, 197, 94, 0.3)" : "rgba(234, 179, 8, 0.3)",
                }}
              >
                <Text
                  className="text-[10px] font-medium"
                  style={{
                    color: tx.status === "Completed" ? "#22c55e" : "#eab308",
                  }}
                >
                  {tx.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Back Link */}
      <Link href="/" asChild>
        <TouchableOpacity className="bg-[#0a57ff]/30 border border-[#0a57ff]/50 px-7 py-3.5 rounded-xl">
          <Text className="text-white text-[15px] font-semibold">← Back to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
