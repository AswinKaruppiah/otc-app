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
          Identity verification (KYC) is required under FIU-IND regulations and AML standards to protect your account, unlock unlimited daily OTC trading volumes, and enable instant fiat INR settlements and TRC-20 payouts.
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
            2. Aadhaar e-KYC via DigiLocker
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Connect your government DigiLocker account using your 12-digit Aadhaar number. A one-time password (OTP) will be sent to your Aadhaar-linked mobile phone to securely verify your legal name, date of birth, and registered address.
          </Text>
        </View>

        {/* Section 3 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            3. PAN Card Verification
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Enter your 10-digit alphanumeric Permanent Account Number (PAN). Our system queries the NSDL tax registry in real-time to validate the Tax ID and ensure the name matches your Aadhaar record.
          </Text>
        </View>

        {/* Section 4 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            4. Live Face Match Biometrics
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Take a quick, well-lit live selfie using your device camera. Our automated AI biometric engine checks 3D depth and matches your facial features against official document records.
          </Text>
        </View>

        {/* Section 5 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            5. Automatic Mobile App Synchronization
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Once submitted and approved, no further action is required. Return to this app and pull down to refresh on the Profile screen — your account will automatically display the Verified checkmark badge with instant withdrawal limits enabled.
          </Text>
        </View>

        {/* Section 6 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            6. Security & Data Privacy
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            All verification requests use end-to-end 256-bit encryption. Your documents and biometric metadata are processed in strict compliance with government data protection standards and are never shared with unauthorized third parties.
          </Text>
        </View>
      </View>
    </PageContainer>
  );
}
