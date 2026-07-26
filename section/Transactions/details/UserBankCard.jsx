import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CopyableRow } from "./CopyableRow";
import { formatAccountNumber } from "../../../utils/helper";

export const UserBankCard = ({ userBank }) => {
  if (!userBank) return null;

  return (
    <View>
      <View className="pl-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          User Payment Bank
        </Text>
      </View>

      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View className="bg-[#060E0B] rounded-[15px] p-4 gap-1">
          <CopyableRow label="Bank Name" value={userBank.bankName} />
          <CopyableRow label="Account Holder" value={userBank.accountHolderName} />
          <CopyableRow
            label="Account Number"
            value={userBank.accountNumber}
            displayValue={formatAccountNumber(userBank.accountNumber)}
          />
          <CopyableRow label="IFSC Code" value={userBank.ifscCode} isMonospace={true} />
        </View>
      </LinearGradient>
    </View>
  );
};
