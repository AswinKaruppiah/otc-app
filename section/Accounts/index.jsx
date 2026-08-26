import React, { useState } from "react";
import { View, RefreshControl } from "react-native";
import { useQuery } from "@apollo/client/react";
import PageContainer from "../../components/PageContainer";
import Show from "../../components/Show";
import { MY_BANK_ACCOUNTS } from "../../apollo/query";
import AccountsHeader from "./components/AccountsHeader";
import AccountsSegmentTabs from "./components/AccountsSegmentTabs";
import LinkedAccountsList from "./components/LinkedAccountsList";
import LinkedWalletsList from "./components/LinkedWalletsList";

/**
 * AccountsOverview — Main section overview allowing users to toggle between
 * Bank Accounts and Crypto Wallets tabs with Apollo GraphQL API queries.
 */
export default function AccountsOverview() {
  const [activeTab, setActiveTab] = useState("banks");

  // Fetch Bank Accounts via GraphQL Query
  const { data, loading, error, refetch, networkStatus } = useQuery(
    MY_BANK_ACCOUNTS,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const isRefreshing = networkStatus === 4;
  const bankAccountsList = data?.myBankAccounts || [];

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
    <PageContainer
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => refetch()}
          tintColor="#baffd8"
          colors={["#baffd8"]}
          progressBackgroundColor="#181e25"
        />
      }
    >
      <View className="w-full pb-8">
        {/* Tab Switcher */}
        <AccountsSegmentTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dynamic Header */}
        <AccountsHeader activeTab={activeTab} />

        {/* Accounts List Group with 4-state handling */}
        <Show>
          <Show.If isTrue={activeTab === "banks"}>
            <LinkedAccountsList
              loading={loading}
              error={error}
              accounts={bankAccountsList}
              refetch={refetch}
            />
          </Show.If>
          <Show.Else>
            <LinkedWalletsList linkedWallets={linkedWallets} />
          </Show.Else>
        </Show>
      </View>
    </PageContainer>
  );
}
