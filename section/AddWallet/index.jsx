import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { useMutation } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import PageContainer from "../../components/PageContainer";
import { ADD_WHITELISTED_ADDRESS } from "../../apollo/mutation";
import { GET_USER_WHITELISTED_ADDRESSES } from "../../apollo/query";
import AddWalletForm from "./components/AddWalletForm";

/**
 * AddWalletSection — Main feature container for adding a whitelisted crypto wallet address.
 * Located in section/AddWallet/index.jsx. Updates Apollo cache directly upon creation.
 */
export default function AddWalletSection() {
  const router = useRouter();
  const { toast } = useToast();
  const [addWalletAddress, { loading }] = useMutation(ADD_WHITELISTED_ADDRESS, {
    update(cache, { data }) {
      const newWallet = data?.addUserWalletAddress;
      if (!newWallet) return;

      try {
        const existing = cache.readQuery({ query: GET_USER_WHITELISTED_ADDRESSES });
        if (existing?.getUserWhitelistedAddresses) {
          cache.writeQuery({
            query: GET_USER_WHITELISTED_ADDRESSES,
            data: {
              getUserWhitelistedAddresses: [
                newWallet,
                ...existing.getUserWhitelistedAddresses.filter((item) => item.id !== newWallet.id),
              ],
            },
          });
        }
      } catch (e) {
        // Cache read fallback
      }
    },
  });

  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    if (!label.trim() || !address.trim()) return;

    try {
      await addWalletAddress({
        variables: {
          label: label.trim(),
          address: address.trim(),
        },
      });

      toast?.show({
        label: "Address Added",
        description: "Your wallet address has been whitelisted successfully.",
        variant: "success",
      });

      router.back();
    } catch (error) {
      toast?.show({
        label: "Error",
        description: error?.message || "Failed to add wallet address.",
        variant: "danger",
      });
    }
  };

  return (
    <PageContainer>
      <View className="w-full flex-1 justify-between">
        {/* Header Navigation & Subtitle */}
        <View className="mb-6">
          <View className="flex-row items-center gap-3 mb-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center active:bg-white/10"
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-2xl font-noir font-bold text-white">Add Wallet Address</Text>
          </View>
          <Text className="text-xs font-noir text-gray-400 pl-[52px]">
            Whitelisted destination for crypto payouts & withdrawals (Max 5 addresses).
          </Text>
        </View>

        {/* Form Component */}
        <AddWalletForm
          label={label}
          setLabel={setLabel}
          address={address}
          setAddress={setAddress}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </View>
    </PageContainer>
  );
}
