import { useState } from "react";
import { View, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useApolloClient } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { useUser } from "../../hooks/useUser";
import { useScreenPadding } from "../../context/ScrollContext";
import PageContainer from "../../components/PageContainer";
import LogoutDialog from "../../components/dialog/LogoutDialog";
import { clearAuthSession, isUnauthenticatedError } from "../../utils/helper";

import ProfileHeroCard from "./components/ProfileHeroCard";
import ProfileQuickGrid from "./components/ProfileQuickGrid";
import ProfileActions from "./components/ProfileActions";

/**
 * ProfileSection — Main profile overview with account details, linked banks/wallets,
 * security preferences, and sign-out dialog actions.
 * Route: /profile
 */
export default function ProfileSection() {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const { toast } = useToast();
  const { paddingTop } = useScreenPadding();
  const { user, loading, refetch } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (e) {
      console.error("Error refreshing profile:", e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    setLogoutDialogOpen(false);
    try {
      await clearAuthSession(apolloClient, async () => {
        router.replace("/");
      });
      toast.show({
        label: "Signed Out",
        description: "You have successfully signed out.",
        variant: "success",
      });
    } catch (error) {
      if (isUnauthenticatedError(error)) {
        toast.show({
          label: "Signed Out",
          description: "You have successfully signed out.",
          variant: "success",
        });
        router.replace("/");
      } else {
        toast.show({
          label: "Error",
          description: `Failed to sign out: ${error.message}`,
          variant: "danger",
        });
      }
    }
  };

  return (
    <PageContainer
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#baffd8"
          colors={["#baffd8"]}
          progressBackgroundColor="#181e25"
          progressViewOffset={paddingTop - 10}
        />
      }
    >
      <View className="w-full">
        {/* 1. Profile Hero Section (Reference Design) */}
        <ProfileHeroCard
          user={user}
          loading={loading || refreshing}
          onActionPress={() => router.push({ pathname: "/accounts", params: { tab: "banks" } })}
        />

        {/* 2. Quick Access & Vault Grid (Mirroring "My Work" Grid) */}
        <ProfileQuickGrid
          onBanksPress={() => router.push({ pathname: "/accounts", params: { tab: "banks" } })}
          onWalletsPress={() => router.push({ pathname: "/accounts", params: { tab: "wallets" } })}
          onWithdrawPress={() => router.push("/withdraw")}
          onOrdersPress={() => router.push("/transactions")}
        />

        {/* 3. KYC Guide, Support & Destructive Actions */}
        <ProfileActions
          onKycGuidePress={() => router.push("/kyc-guide")}
          onSupportPress={() => router.push("/support")}
          onLogoutPress={() => setLogoutDialogOpen(true)}
        />
      </View>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        isOpen={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleSignOut}
      />
    </PageContainer>
  );
}
