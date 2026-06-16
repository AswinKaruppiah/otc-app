import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Show from "../../components/Show";
import Feather from "@expo/vector-icons/Feather";
import * as Clipboard from "expo-clipboard";
import { haptic } from "../../utils/haptics";
import { formatAccountNumber } from "../../utils/helper";

export const CopyableRow = ({ label, value, displayValue, isMonospace = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        haptic.light();
        try {
            await Clipboard.setStringAsync(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.log("Copy error:", e);
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

            <View className="w-full rounded-xl overflow-hidden border border-white/[0.04]">
                <View className="flex-row bg-black/5 items-center p-5 gap-3.5">
                    <View>
                        <Text className="text-white font-noir text-base">
                            {bank.bankName}
                        </Text>
                        <Show>
                            <Show.If isTrue={!!bank.branch}>
                                <Text className="text-gray-400 font-noir text-xs mt-0.5">
                                    {bank.branch} Branch
                                </Text>
                            </Show.If>
                        </Show>
                    </View>
                </View>

                <View className="gap-3 px-5 py-6 bg-noirCard">
                    <CopyableRow label="Account Holder" value={bank.accountHolderName} />
                    <CopyableRow
                        label="Account Number"
                        value={bank.accountNumber}
                        displayValue={formatAccountNumber(bank.accountNumber)}
                    />
                    <CopyableRow label="IFSC Code" value={bank.ifscCode} isMonospace={true} />

                    <Show>
                        <Show.If isTrue={!!bank.note}>
                            <View className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5 flex-row gap-2.5 items-start">
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
        </View>
    );
};
