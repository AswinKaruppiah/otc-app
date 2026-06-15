import { View, Text } from "react-native";
import { maskAccountNumber } from "../../utils/helper";
import Show from "../../components/Show";

export const BankAccountCard = ({
    bankName,
    type,
    accountNumber,
    accountHolderName,
    ifscCode,
    branch,
}) => {
    const accountNumMasked = maskAccountNumber(accountNumber, "");

    return (
        <View>
            <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase pl-1 mb-3">
                Bank Account Details
            </Text>

            <View className="w-full rounded-xl overflow-hidden border border-white/[0.04]">
                <View className="flex-row  bg-black/5 items-center p-5 gap-3.5">
                    <View>
                        <Text className="text-white font-noir text-base">
                            {bankName}
                        </Text>
                        <Show>
                            <Show.If isTrue={!!(type || accountNumMasked)}>
                                <Text className="text-gray-400 font-noir text-xs mt-0.5">
                                    {type}{type && accountNumMasked ? " • " : ""}{accountNumMasked}
                                </Text>
                            </Show.If>
                        </Show>
                    </View>
                </View>

                <View className="gap-3.5 px-5 py-8 bg-noirCard">
                    <Show>
                        <Show.If isTrue={!!accountHolderName}>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-400 font-noir text-[13px]">Account Holder</Text>
                                <Text className="text-white font-noir text-[13px]">{accountHolderName}</Text>
                            </View>
                        </Show.If>
                    </Show>

                    <Show>
                        <Show.If isTrue={!!ifscCode}>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-400 font-noir text-[13px]">IFSC Code</Text>
                                <Text className="text-white font-noir text-[13px] tracking-wide uppercase">
                                    {ifscCode}
                                </Text>
                            </View>
                        </Show.If>
                    </Show>

                    <Show>
                        <Show.If isTrue={!!branch}>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-400 font-noir text-[13px]">Branch</Text>
                                <Text className="text-white font-noir text-[13px]">{branch}</Text>
                            </View>
                        </Show.If>
                    </Show>
                </View>
            </View>
        </View>
    );
};
