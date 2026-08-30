import { useState } from "react";
import { View } from "react-native";
import { useQuery } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { useRouter } from "expo-router";
import PageContainer from "../../components/PageContainer";
import Show from "../../components/Show";
import { MY_BANK_ACCOUNTS, GET_USER_WHITELISTED_ADDRESSES } from "../../apollo/query";
import AccountsHeader from "./components/AccountsHeader";
import AccountsSegmentTabs from "./components/AccountsSegmentTabs";
import LinkedAccountsList from "./components/LinkedAccountsList";
import LinkedWalletsList from "./components/LinkedWalletsList";

/**
 * AccountsOverview — Main section overview displaying linked bank accounts and whitelisted wallets.
 */
export default function AccountsOverview() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("banks");
  const { toast } = useToast();

  // Fetch Bank Accounts via GraphQL Query
  const {
    data: bankData,
    loading: bankLoading,
    error: bankError,
    refetch: refetchBanks,
  } = useQuery(MY_BANK_ACCOUNTS);

  // Fetch Whitelisted Crypto Wallets via GraphQL Query
  const {
    data: walletData,
    loading: walletLoading,
    error: walletError,
    refetch: refetchWallets,
  } = useQuery(GET_USER_WHITELISTED_ADDRESSES);

  const bankAccountsList = bankData?.myBankAccounts || [];
  const whitelistedWallets = walletData?.getUserWhitelistedAddresses || [];

  const handleAddPress = () => {
    if (activeTab === "banks") {
      if (bankAccountsList.length >= 3) {
        toast?.show({
          label: "Account Limit Reached",
          description: "You can only link a maximum of 3 bank accounts.",
          variant: "danger",
        });
        return;
      }
      router.push("/accounts/add-bank");
    } else {
      if (whitelistedWallets.length >= 5) {
        toast?.show({
          label: "Wallet Limit Reached",
          description: "You can only link a maximum of 5 wallet addresses.",
          variant: "danger",
        });
        return;
      }
      router.push("/accounts/add-wallet");
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
        <AccountsHeader
          activeTab={activeTab}
          onAddPress={handleAddPress}
          bankCount={bankAccountsList.length}
          maxBanks={3}
          walletCount={whitelistedWallets.length}
          maxWallets={5}
        />

        {/* Accounts List Group */}
        <Show>
          <Show.If isTrue={activeTab === "banks"}>
            <LinkedAccountsList
              loading={bankLoading}
              error={bankError}
              accounts={bankAccountsList}
              refetch={refetchBanks}
            />
          </Show.If>
          <Show.Else>
            <LinkedWalletsList
              loading={walletLoading}
              error={walletError}
              wallets={whitelistedWallets}
              refetch={refetchWallets}
            />
          </Show.Else>
        </Show>
      </View>
    </PageContainer>
  );
}
