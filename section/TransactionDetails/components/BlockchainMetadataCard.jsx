import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CopyableRow } from "./CopyableRow";
import { formatDate } from "../../../utils/helper";

export const BlockchainMetadataCard = ({ blockchainTx }) => {
  if (!blockchainTx) return null;

  return (
    <View>
      <View className="pl-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Blockchain Transaction
        </Text>
      </View>

      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View className="bg-[#060E0B] rounded-[15px] p-4 gap-1">
          {blockchainTx.hash && (
            <CopyableRow label="Tx Hash" value={blockchainTx.hash} isMonospace={true} />
          )}
          {blockchainTx.to && (
            <CopyableRow label="To Address" value={blockchainTx.to} isMonospace={true} />
          )}
          {blockchainTx.amount && (
            <CopyableRow
              label="Amount Released"
              value={`${blockchainTx.amount} USDT`}
            />
          )}
          {blockchainTx.confirmedAt && (
            <CopyableRow
              label="Confirmed Date"
              value={formatDate(blockchainTx.confirmedAt)}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};
