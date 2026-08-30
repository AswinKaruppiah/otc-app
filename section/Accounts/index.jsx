import { useState, useEffect, useCallback } from "react";
import { View, BackHandler } from "react-native";
import { useQuery } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import PageContainer from "../../components/PageContainer";
import Show from "../../components/Show";
import { MY_BANK_ACCOUNTS, GET_USER_WHITELISTED_ADDRESSES } from "../../apollo/query";
import AccountsHeader from "./components/AccountsHeader";
import AccountsSegmentTabs from "./components/AccountsSegmentTabs";
import LinkedAccountsList from "./components/LinkedAccountsList";
import LinkedWalletsList from "./components/LinkedWalletsList";

// In-memory tab persistence across screen pushes, pops, and back swipes
let memoryActiveTab = "banks";

/**
 * AccountsOverview — Main section overview displaying linked bank accounts and whitelisted wallets.
 * Handles back press: switching from "wallets" tab back to "banks" tab before popping to Home.
 */
export default function AccountsOverview() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 1. Resolve active tab: URL query param -> memory tab -> default "banks"
  const urlTab =
    params?.tab === "wallets" || params?.tab === "wallet"
      ? "wallets"
      : params?.tab === "banks" || params?.tab === "bank"
      ? "banks"
      : null;

  const currentTab = urlTab || memoryActiveTab || "banks";
  const [activeTab, setActiveTab] = useState(currentTab);
  const { toast } = useToast();

  // 2. Keep memory active tab in sync whenever urlTab or activeTab changes
  useEffect(() => {
    const nextTab = urlTab || activeTab;
    memoryActiveTab = nextTab;
    if (activeTab !== nextTab) {
      setActiveTab(nextTab);
    }
  }, [urlTab, activeTab]);

  // 3. Handle manual tab change
  const handleTabChange = (newTab) => {
    memoryActiveTab = newTab;
    setActiveTab(newTab);
    router.setParams({ tab: newTab });
  };

  // 4. Intercept mobile back press: If on "wallets" tab, go back to "banks" tab first instead of exiting to Home!
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (activeTab === "wallets") {
          handleTabChange("banks");
          return true; // Prevents exit to Home page
        }
        return false; // On "banks" tab, allows default exit to Home page
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [activeTab])
  );

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
      router.push({ pathname: "/accounts/add-bank", params: { tab: "banks" } });
    } else {
      if (whitelistedWallets.length >= 5) {
        toast?.show({
          label: "Wallet Limit Reached",
          description: "You can only link a maximum of 5 wallet addresses.",
          variant: "danger",
        });
        return;
      }
      router.push({ pathname: "/accounts/add-wallet", params: { tab: "wallets" } });
    }
  };

  return (
    <PageContainer>
      <View className="w-full pb-8">
        {/* Tab Switcher */}
        <AccountsSegmentTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
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
