import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { EMVChipSVG } from "../../../utils/icons";

// 3 Distinct green gradient palettes for up to 3 bank accounts
const CARD_GRADIENTS = [
  // Card 1: Vibrant Spring Emerald Mint -> Dark Forest Green
  {
    colors: ["#10B981", "#34D399", "#047857", "#013A23"],
    locations: [0, 0.29, 0.63, 1.0],
  },
  // Card 2: Deep Teal Emerald & Turquoise
  {
    colors: ["#0F766E", "#14B8A6", "#0D9488", "#022C22"],
    locations: [0, 0.3, 0.65, 1.0],
  },
  // Card 3: Vibrant Lime-Sage & Deep Teal (Approved)
  {
    colors: ["#A3E635", "#34D399", "#059669", "#064E3B"],
    locations: [0, 0.29, 0.57, 0.93],
  },
];

/**
 * BankCard — Reusable component rendering linked bank accounts in a standard debit/credit card format.
 * Uses exact custom linear gradient color stops provided in design specs.
 *
 * @param {object} bank - Bank account details from GraphQL API
 * @param {number} index - Index for preset card gradient selection
 */
export default function BankCard({ bank = {}, index = 0 }) {
  const currentGradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  // Format account numbers into 4-digit groups (e.g. "8763 2736 9873 0329"), fallback to "-"
  const formatCardNumber = (accountNumRaw) => {
    if (!accountNumRaw) return "-";
    const clean = String(accountNumRaw).replace(/\s+/g, "");
    return clean.replace(/(.{4})/g, "$1 ").trim();
  };

  const cardNumFormatted = formatCardNumber(
    bank.accountNumber || bank.accountNumberMasked
  );

  const cardHolder = bank.accountHolderName
    ? String(bank.accountHolderName).toUpperCase()
    : "-";

  const accountType =
    bank.accountType || bank.type
      ? String(bank.accountType || bank.type).toUpperCase()
      : "-";

  const bankName = bank.bankName || "-";

  return (
    <LinearGradient
      colors={currentGradient.colors}
      locations={currentGradient.locations}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full aspect-[1.65/1] rounded-2xl p-6 shadow-2xl justify-between relative overflow-hidden"
    >
      {/* Top Row: Bank Name & Account Type Badge */}
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-noir text-[18px] tracking-wide font-medium">
          {bankName}
        </Text>
        <View className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20">
          <Text className="text-white font-noir text-[10px] font-medium tracking-wider uppercase">
            {accountType}
          </Text>
        </View>
      </View>

      {/* Middle-Top Section: Golden EMV Chip on the Left */}
      <View className="my-1 flex-row items-center">
        <EMVChipSVG width={42} height={29} />
      </View>

      {/* Middle-Bottom Section: Account Number */}
      <Text className="text-white font-noir text-[21px] tracking-[1.8px] font-normal mb-1">
        {cardNumFormatted}
      </Text>

      {/* Bottom Row: Card Holder Name */}
      <View className="flex-row justify-between items-end">
        <View className="flex-1 pr-2">
          <Text className="text-white/80 font-noir text-[11px] font-normal mb-0.5">
            Card Holder Name
          </Text>
          <Text
            className="text-white font-noir font-semibold text-[13px] tracking-wide"
            numberOfLines={1}
          >
            {cardHolder}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
