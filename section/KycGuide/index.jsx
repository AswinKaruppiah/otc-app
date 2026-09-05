import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import PageContainer from "../../components/PageContainer";
import { haptic } from "../../utils/haptics";

export default function KycGuideSection() {
  const handleOpenLink = (url) => {
    haptic.light();
    Linking.openURL(url).catch(() => {});
  };

  return (
    <PageContainer>
      <View className="w-full pb-16 px-1">
        {/* Main Editorial Header */}
        <Text className="text-3xl font-noir-medium text-white tracking-tight mb-2">
          Identity Verification Guide
        </Text>
        <Text className="text-xs font-noir text-noirMint font-bold tracking-widest uppercase mb-6">
          Official OTC Compliance & Onboarding Walkthrough
        </Text>

        {/* Introduction Paragraph */}
        <Text className="text-sm font-noir text-gray-300 leading-6 mb-8">
          Identity verification (KYC) is required under FIU-IND regulations and AML standards to protect your account, unlock unlimited daily OTC trading volumes, and enable fiat INR settlements and TRC-20 payouts.
        </Text>

        {/* Section 1 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            1. Access the Verification Portal
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6 mb-3">
            KYC verification is processed securely through our central web portal. Open your browser and navigate to:
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleOpenLink("https://app.bloqex.com/settings/verification")}
            className="self-start py-1"
          >
            <Text className="text-sm font-noir text-noirMint font-semibold underline">
              https://app.bloqex.com/settings/verification
            </Text>
          </TouchableOpacity>
          <Text className="text-xs font-noir text-gray-400 leading-5 mt-2">
            Important: Ensure you sign in with the same Google account or email address you use on this mobile application so your verified status syncs automatically.
          </Text>
        </View>

        {/* Section 2 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            2. Submit Requested Documents
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Follow the simple on-screen instructions on the portal and provide the identity documents requested by the application to complete your submission.
          </Text>
        </View>

        {/* Section 3 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            3. Verification Timeline & Approval
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Once submitted, your verification and compliance review typically takes 1 to 2 business days. Once approved, your account will automatically display the Verified checkmark badge with withdrawal limits enabled.
          </Text>
        </View>

        {/* Section 4 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            4. Need Assistance or Facing Delays?
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            If your verification takes longer than 2 business days or if you experience any issues, please reach out directly to our dedicated support team via the Support tab in your profile.
          </Text>
        </View>
      </View>
    </PageContainer>
  );
}
