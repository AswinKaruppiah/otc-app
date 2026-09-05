import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import PageContainer from "../../components/PageContainer";
import { haptic } from "../../utils/haptics";

export default function SupportSection() {
  const handleOpenLink = (url) => {
    haptic.light();
    Linking.openURL(url).catch(() => {});
  };

  return (
    <PageContainer>
      <View className="w-full pb-16 px-1">
        {/* Main Editorial Header */}
        <Text className="text-3xl font-noir-medium text-white tracking-tight mb-2">
          Help & Support Guidelines
        </Text>
        <Text className="text-xs font-noir text-noirCyan font-bold tracking-widest uppercase mb-6">
          OTC Desk, Settlements & Assistance Policy
        </Text>

        {/* Introduction Paragraph */}
        <Text className="text-sm font-noir text-gray-300 leading-6 mb-8">
          Dedicated assistance is available 24/7 for private OTC orders, fiat settlement inquiries, account verifications, and technical support.
        </Text>

        {/* Section 1 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            1. Submitting a Support Request
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6 mb-3">
            Formal assistance requests and ticket tracking are managed directly through our web support portal:
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleOpenLink("https://app.bloqex.com/support")}
            className="self-start py-1"
          >
            <Text className="text-sm font-noir text-noirCyan font-semibold underline">
              https://app.bloqex.com/support
            </Text>
          </TouchableOpacity>
          <Text className="text-xs font-noir text-gray-400 leading-5 mt-2">
            Sign in using the same account used in this mobile application. You can create a request, attach payment UTR receipts, and receive updates directly from an assigned OTC specialist.
          </Text>
        </View>

        {/* Section 2 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            2. Payment & UTR Verifications
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            When completing an INR bank transfer (IMPS, NEFT, RTGS, or UPI), ensure the correct 12-digit Unique Transaction Reference (UTR) is entered without extra spaces. If a transfer is marked pending after 15 minutes, submit a ticket with your bank receipt slip for manual clearance.
          </Text>
        </View>

        {/* Section 3 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            3. TRC-20 Settlements & Withdrawals
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            USDT withdrawals and settlements are reviewed and processed within 1 to 2 business days. Once broadcasted, blockchain transfers confirm quickly on the TRON network.
          </Text>
        </View>

        {/* Section 4 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            4. Security & 2FA Inquiries
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Quotex representatives will never ask for your private keys, seed phrases, or Google account passwords. Always ensure you access official portal links under the verified bloqex.com domain.
          </Text>
        </View>
      </View>
    </PageContainer>
  );
}
