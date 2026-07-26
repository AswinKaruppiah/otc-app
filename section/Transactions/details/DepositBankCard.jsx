import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CopyableRow } from "./CopyableRow";
import { formatAccountNumber } from "../../../utils/helper";

export const DepositBankCard = ({ bank }) => {
  if (!bank) return null;

  return (
    <View>
      <View className="pl-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Deposit Bank Account
        </Text>
      </View>

      <LinearGradient
        colors={["rgba(186, 255, 216, 0.25)", "rgba(186, 255, 216, 0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View style={{ borderRadius: 15, overflow: "hidden" }}>
          <LinearGradient
            colors={["#14382A", "#0B1F17"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center justify-between p-5 border-b border-noirMint/[0.08]"
          >
            <View className="flex-1 mr-4">
              <Text className="text-noirMint font-noir-medium text-base" numberOfLines={1}>
                {bank.bankName}
              </Text>
              {bank.branch && (
                <Text className="text-noirMint/65 font-noir text-xs mt-0.5">
                  {bank.branch} Branch
                </Text>
              )}
            </View>
            <View className="bg-noirMint/10 px-2.5 py-1 rounded-full">
              <Text className="text-noirMint font-noir-medium text-[10px] uppercase tracking-wider">
                Deposit Bank
              </Text>
            </View>
          </LinearGradient>

          <View className="gap-1 px-5 py-4 bg-[#060E0B]">
            <CopyableRow label="Account Holder" value={bank.accountHolderName} />
            <CopyableRow
              label="Account Number"
              value={bank.accountNumber}
              displayValue={formatAccountNumber(bank.accountNumber)}
            />
            <CopyableRow label="IFSC Code" value={bank.ifscCode} isMonospace={true} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
