import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Show from "../../components/Show";
import Feather from "@expo/vector-icons/Feather";
import { formatAccountNumber, copyToClipboard } from "../../utils/helper";
import { LinearGradient } from "expo-linear-gradient";

export const CopyableRow = ({ label, value, displayValue, isMonospace = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View className="flex-row justify-between items-center py-1.5">
      <View className="flex-1 mr-4">
        <Text className="text-gray-400 font-noir text-[13px]">{label}</Text>
        <Text className={`text-white font-noir text-[14px] mt-0.5 ${isMonospace ? 'tracking-wider uppercase' : ''}`}>
          {displayValue || value}
        </Text>
      </View>
      <Pressable
        onPress={handleCopy}
        className="w-8 h-8 rounded-lg bg-white/5 items-center justify-center active:bg-white/10"
      >
        <Feather
          name={copied ? "check" : "copy"}
          size={14}
          color={copied ? "#baffd8" : "rgba(255, 255, 255, 0.4)"}
        />
      </Pressable>
    </View>
  );
};

export const AdminBankAccountCard = ({ bank }) => {
  if (!bank) return null;

  return (
    <View>
      <View className="pl-1 gap-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Deposit Bank Account
        </Text>
        <Text className="text-gray-500 font-noir text-xs leading-normal">
          Transfer the exact amount to the admin account below.
        </Text>
      </View>

      {/* Highlighted Card Container using a premium mint gradient border */}
      <LinearGradient
        colors={["rgba(186, 255, 216, 0.25)", "rgba(186, 255, 216, 0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View style={{ borderRadius: 15, overflow: "hidden" }}>

          {/* Top row with Bank Name and highlighting badge */}
          <LinearGradient
            colors={["#14382A", "#0B1F17"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center justify-between p-5 border-b border-noirMint/[0.08]"
          >
            <View className="flex-1 mr-4">
              <Text
                className="text-noirMint font-noir-medium text-base"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {bank.bankName}
              </Text>
              <Show>
                <Show.If isTrue={!!bank.branch}>
                  <Text
                    className="text-noirMint/65 font-noir text-xs mt-0.5"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {bank.branch} Branch
                  </Text>
                </Show.If>
              </Show>
            </View>

            <View className="bg-noirMint/10 px-2.5 py-1 rounded-full">
              <Text className="text-noirMint font-noir-medium text-[10px] uppercase tracking-wider">
                Send Payment Here
              </Text>
            </View>
          </LinearGradient>

          {/* Details section with a solid dark obsidian-green background */}
          <View className="gap-3 px-5 py-6 bg-[#060E0B]">
            <CopyableRow label="Account Holder" value={bank.accountHolderName} />
            <CopyableRow
              label="Account Number"
              value={bank.accountNumber}
              displayValue={formatAccountNumber(bank.accountNumber)}
            />
            <CopyableRow label="IFSC Code" value={bank.ifscCode} isMonospace={true} />

            <Show>
              <Show.If isTrue={!!bank.note}>
                <View className="mt-2 p-3 bg-noirMint/5 rounded-lg border border-noirMint/10 flex-row gap-2.5 items-start">
                  <Feather name="info" size={15} color="#baffd8" style={{ marginTop: 1.5 }} />
                  <View className="flex-1">
                    <Text className="text-gray-300 font-noir text-xs leading-normal">
                      {bank.note}
                    </Text>
                  </View>
                </View>
              </Show.If>
            </Show>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
