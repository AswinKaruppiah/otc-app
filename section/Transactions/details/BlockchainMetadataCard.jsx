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
          Blockchain Metadata
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
            <CopyableRow
              label="Tx Hash"
              value={blockchainTx.hash}
              displayValue={`${blockchainTx.hash.slice(0, 8)}...${blockchainTx.hash.slice(-6)}`}
              isMonospace={true}
            />
          )}
          {blockchainTx.to && (
            <CopyableRow
              label="To Address"
              value={blockchainTx.to}
              displayValue={`${blockchainTx.to.slice(0, 8)}...${blockchainTx.to.slice(-6)}`}
              isMonospace={true}
            />
          )}
          {blockchainTx.confirmedAt && (
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-400 font-noir text-[13px]">Confirmed At</Text>
              <Text className="text-white font-noir text-[14px]">
                {formatDate(blockchainTx.confirmedAt)}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};
