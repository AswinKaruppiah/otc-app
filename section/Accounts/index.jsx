import React, { useState } from "react";
import { View } from "react-native";
import { useQuery } from "@apollo/client/react";
import PageContainer from "../../components/PageContainer";
import Show from "../../components/Show";
import { MY_BANK_ACCOUNTS } from "../../apollo/query";
import AccountsHeader from "./components/AccountsHeader";
import AccountsSegmentTabs from "./components/AccountsSegmentTabs";
import LinkedAccountsList from "./components/LinkedAccountsList";
import LinkedWalletsList from "./components/LinkedWalletsList";
import AddBankAccountSheet from "./components/AddBankAccountSheet";

/**
 * AccountsOverview — Main section overview displaying linked bank accounts and whitelisted wallets.
 */
export default function AccountsOverview() {
  const [activeTab, setActiveTab] = useState("banks");
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);

  // Fetch Bank Accounts via GraphQL Query
  const { data, loading, error, refetch } = useQuery(MY_BANK_ACCOUNTS);

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

  const handleAddPress = () => {
    if (activeTab === "banks") {
      setIsAddBankOpen(true);
    }
  };

  return (
    <PageContainer>
      <View className="w-full pb-8">
        {/* Tab Switcher */}
        <AccountsSegmentTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dynamic Header */}
        <AccountsHeader activeTab={activeTab} onAddPress={handleAddPress} />

        {/* Accounts List Group */}
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

        {/* Add Bank Account Sheet */}
        <AddBankAccountSheet
          isOpen={isAddBankOpen}
          onOpenChange={setIsAddBankOpen}
          refetchAccounts={refetch}
        />
      </View>
    </PageContainer>
  );
}
