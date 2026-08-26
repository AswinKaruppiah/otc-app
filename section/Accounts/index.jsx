import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import PageContainer from "../../components/PageContainer";
import { maskAccountNumber } from "../../utils/helper";
import AccountsHeader from "./components/AccountsHeader";
import LinkedAccountsList from "./components/LinkedAccountsList";
import TransferLimitsCard from "./components/TransferLimitsCard";

/**
 * AccountsOverview — Main component for managing bank accounts and funding sources.
 */
export default function AccountsOverview() {
  const router = useRouter();

  const linkedBanks = [
    {
      id: "1",
      bankName: "Chase Bank",
      type: "Checking Account",
      accountNum: maskAccountNumber("8821"),
      routingNum: "021000021",
      status: "Primary",
      icon: "home",
      iconColor: "#baffd8",
    },
    {
      id: "2",
      bankName: "Wells Fargo",
      type: "Savings Account",
      accountNum: maskAccountNumber("4302"),
      routingNum: "121000248",
      status: "Secondary",
      icon: "briefcase",
      iconColor: "#96dded",
    },
  ];

  return (
    <PageContainer>
      <View className="w-full pb-8">
        <AccountsHeader />
        <LinkedAccountsList linkedBanks={linkedBanks} />
        <TransferLimitsCard
          dailyLimit="$5,000.00 max"
          remainingLimit="$1,200.00 left"
          progressPercent="76%"
        />

        {/* Actions */}
        <View className="w-full gap-3">
          <TouchableOpacity className="w-full bg-noirMint py-4 rounded-xl flex-row items-center justify-center gap-2">
            <Feather name="plus" size={16} color="#111418" />
            <Text className="text-noirBg font-noir text-[15px]">
              Link Another Bank
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="w-full bg-white/5 border border-white/[0.04] py-4 rounded-xl flex-row items-center justify-center gap-2"
          >
            <Text className="text-noirText font-noir text-[15px]">Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PageContainer>
  );
}
