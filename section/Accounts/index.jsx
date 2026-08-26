import React, { useState } from "react";
import { View } from "react-native";
import PageContainer from "../../components/PageContainer";
import Show from "../../components/Show";
import { maskAccountNumber } from "../../utils/helper";
import AccountsHeader from "./components/AccountsHeader";
import AccountsSegmentTabs from "./components/AccountsSegmentTabs";
import LinkedAccountsList from "./components/LinkedAccountsList";
import LinkedWalletsList from "./components/LinkedWalletsList";

/**
 * AccountsOverview — Main section overview allowing users to toggle between
 * Bank Accounts and Crypto Wallets tabs.
 */
export default function AccountsOverview() {
  const [activeTab, setActiveTab] = useState("banks");

  // Linked Bank Accounts sample data
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

  // Whitelisted Crypto Wallets sample data
  const linkedWallets = [
    {
      id: "1",
      label: "Main Treasury Wallet",
      network: "ERC-20",
      networkName: "Ethereum Mainnet",
      address: "0x52590e71d21f81bb59d006f42437730bd1c76e31",
      status: "Verified",
      icon: "cpu",
      iconColor: "#baffd8",
    },
    {
      id: "2",
      label: "Payout Polygon Wallet",
      network: "Polygon",
      networkName: "Polygon POS",
      address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      status: "Verified",
      icon: "shield",
      iconColor: "#96dded",
    },
  ];

  return (
    <PageContainer>
      <View className="w-full pb-8">
        {/* Tab Switcher */}
        <AccountsSegmentTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dynamic Header */}
        <AccountsHeader activeTab={activeTab} />

        {/* Accounts List Group */}
        <Show>
          <Show.If isTrue={activeTab === "banks"}>
            <LinkedAccountsList linkedBanks={linkedBanks} />
          </Show.If>
          <Show.Else>
            <LinkedWalletsList linkedWallets={linkedWallets} />
          </Show.Else>
        </Show>


      </View>
    </PageContainer>
  );
}
