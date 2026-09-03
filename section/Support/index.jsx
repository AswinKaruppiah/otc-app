import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import PageContainer from "../../components/PageContainer";
import { haptic } from "../../utils/haptics";
import { copyToClipboard } from "../../utils/helper";
import { useToast } from "heroui-native";

export default function SupportSection() {
  const { toast } = useToast();

  const handleOpenLink = (url) => {
    haptic.light();
    Linking.openURL(url).catch(() => {});
  };

  const handleCopyEmail = () => {
    copyToClipboard("support@quotex.io", toast, "Email Copied", "support@quotex.io copied to clipboard.");
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
            3. Instant TRC-20 Settlements
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            USDT withdrawals are broadcast automatically across the TRON network once fiat confirmation completes. Transfers typically confirm in 2 to 5 minutes depending on blockchain network traffic.
          </Text>
        </View>

        {/* Section 4 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            4. Direct Contact Channels
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6 mb-3">
            For urgent trade disputes or live assistance:
          </Text>
          <View className="gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleOpenLink("https://t.me/quotex_support")}
              className="self-start py-1"
            >
              <Text className="text-sm font-noir text-white font-medium">
                • Telegram OTC Desk:{" "}
                <Text className="text-noirMint underline">@quotex_support</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCopyEmail}
              className="self-start py-1"
            >
              <Text className="text-sm font-noir text-white font-medium">
                • Compliance & Email:{" "}
                <Text className="text-noirCyan underline">support@quotex.io</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 5 */}
        <View className="mb-7">
          <Text className="text-lg font-noir-medium text-white tracking-tight mb-2">
            5. Security & 2FA Inquiries
          </Text>
          <Text className="text-sm font-noir text-gray-300 leading-6">
            Quotex representatives will never ask for your private keys, seed phrases, or Google account passwords. Always ensure you access official portal links under the verified bloqex.com domain.
          </Text>
        </View>
      </View>
    </PageContainer>
  );
}
