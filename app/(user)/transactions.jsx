import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

/**
 * Transactions Screen — activity log showing recent transactions.
 * Rebuilt using the premium Noir theme:
 *   - Base font: font-noir / font-noir-medium
 *   - Colors: bg-noirCard, bg-noirMint, bg-noirCyan
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
      iconColor: "#ff7b7b",
      glowColor: "rgba(255,123,123,0.15)",
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
      iconColor: "#baffd8",
      glowColor: "rgba(186,255,216,0.15)",
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
      iconColor: "#96dded",
      glowColor: "rgba(150,221,237,0.15)",
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
      iconColor: "#ff7b7b",
      glowColor: "rgba(255,123,123,0.15)",
    },
  ];

  return (
    <View className="items-center justify-center py-[10px] w-full">
      {/* Header Badge */}
      <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-6">
        <Text className="text-noirMint text-[12px] font-noir-medium tracking-[0.5px]">📊 Activity Log</Text>
      </View>

      {/* Title */}
      <Text className="text-[38px] font-noir-medium text-noirText mb-3 tracking-[-0.5px]">Transactions</Text>
      <Text className="text-[15px] text-gray-400 font-noir text-center leading-[22px] mb-9 max-w-[300px]">
        Keep track of your recent conversions and transfers.
      </Text>

      {/* Transaction List */}
      <View className="w-full gap-4 mb-8">
        {mockTransactions.map((tx) => (
          <View
            key={tx.id}
            className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] flex-row items-center justify-between"
          >
            {/* Left Section: Icon & Info */}
            <View className="flex-row items-center gap-3.5 flex-1">
              <View
                className="w-11 h-11 rounded-xl items-center justify-center"
                style={{ backgroundColor: tx.glowColor }}
              >
                <Feather name={tx.icon} size={18} color={tx.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-noir-medium text-noirText mb-0.5">
                  {tx.type}
                </Text>
                <Text className="text-[12px] text-gray-400 font-noir mb-1">
                  {tx.pair}
                </Text>
                <Text className="text-[11px] text-gray-500 font-noir">
                  {tx.date}
                </Text>
              </View>
            </View>

            {/* Right Section: Amounts & Status */}
            <View className="items-end gap-1.5">
              <Text className="text-[15px] font-noir-medium text-noirText">
                {tx.amount}
              </Text>
              <Text className="text-[13px] text-noirCyan font-noir-medium">
                {tx.converted}
              </Text>
              <View
                className="px-2.5 py-0.5 rounded-full border border-white/5"
                style={{
                  backgroundColor: tx.status === "Completed" ? "rgba(186, 255, 216, 0.08)" : "rgba(150, 221, 237, 0.08)",
                }}
              >
                <Text
                  className="text-[10px] font-noir-medium"
                  style={{
                    color: tx.status === "Completed" ? "#baffd8" : "#96dded",
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
        <TouchableOpacity className="bg-noirMint/10 border border-noirMint/25 px-7 py-3.5 rounded-xl">
          <Text className="text-noirMint text-[15px] font-noir-medium">← Back to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
