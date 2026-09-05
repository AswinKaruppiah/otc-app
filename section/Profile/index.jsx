import { useState } from "react";
import { View, Text, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useApolloClient } from "@apollo/client/react";
import { useToast } from "heroui-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useUser } from "../../hooks/useUser";
import { useScreenPadding } from "../../context/ScrollContext";
import PageContainer from "../../components/PageContainer";
import LogoutDialog from "../../components/dialog/LogoutDialog";
import HapticTouchableOpacity from "../../components/HapticTouchableOpacity";
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

  const isKycVerified = user?.kycStatus === "verified";

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

        {/* KYC Verification Call-to-Action (shown if user KYC is not completed) */}
        {!loading && !refreshing && user && !isKycVerified && (
          <View className="w-full mb-6">
            <HapticTouchableOpacity
              activeOpacity={0.85}
              hapticType="medium"
              onPress={() => router.push("/kyc-guide")}
              className="w-full rounded-full overflow-hidden"
            >
              <LinearGradient
                colors={["#0c2b1e", "#103c2a", "#072015"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 py-4 flex-row items-center justify-between"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-white font-noir-medium text-base font-semibold">
                    {user?.kycStatus === "pending"
                      ? "KYC Under Review"
                      : "Complete KYC Verification"}
                  </Text>
                  <Text className="text-emerald-300/70 font-noir text-xs mt-0.5" numberOfLines={1}>
                    {user?.kycStatus === "pending"
                      ? "Review takes 1–2 days • Tap for details"
                      : "Unlock unlimited limits & fast settlements"}
                  </Text>
                </View>
                <Feather name="chevron-right" size={24} color="#baffd8" />
              </LinearGradient>
            </HapticTouchableOpacity>
          </View>
        )}

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
