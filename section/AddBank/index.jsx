import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { useMutation } from "@apollo/client/react";
import Feather from "@expo/vector-icons/Feather";
import PageContainer from "../../components/PageContainer";
import { ADD_BANK_ACCOUNT } from "../../apollo/mutation";
import { MY_BANK_ACCOUNTS } from "../../apollo/query";
import { BANK_OPTIONS } from "../../constants/banks";
import SelectBankDialog from "../../components/dialog/SelectBankDialog";
import AddBankForm from "./components/AddBankForm";

/**
 * AddBankSection — Dedicated feature section component for adding a bank account.
 * Located in section/AddBank/index.jsx.
 */
export default function AddBankSection() {
  const router = useRouter();
  const { toast } = useToast();
  const [addBankAccount, { loading }] = useMutation(ADD_BANK_ACCOUNT);

  // Form states
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("savings");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);

  const selectedBankObj = BANK_OPTIONS.find((b) => b.key === bankName);

  const handleSubmit = async () => {
    if (!bankName) {
      toast?.show({
        label: "Missing Bank Name",
        description: "Please select your bank.",
        variant: "danger",
      });
      return;
    }

    if (!accountHolderName.trim()) {
      toast?.show({
        label: "Missing Holder Name",
        description: "Please enter the account holder name.",
        variant: "danger",
      });
      return;
    }

    if (!accountNumber || accountNumber.length < 6 || accountNumber.length > 18) {
      toast?.show({
        label: "Invalid Account Number",
        description: "Account number must be between 6 and 18 digits.",
        variant: "danger",
      });
      return;
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const cleanIfsc = ifscCode.trim().toUpperCase();
    if (!ifscRegex.test(cleanIfsc)) {
      toast?.show({
        label: "Invalid IFSC Code",
        description: "Please enter a valid 11-digit IFSC code (e.g. SBIN0001234).",
        variant: "danger",
      });
      return;
    }

    try {
      const selectedBankLabel = selectedBankObj?.label || bankName;

      await addBankAccount({
        variables: {
          input: {
            bankName: selectedBankLabel,
            accountType,
            accountHolderName: accountHolderName.trim(),
            accountNumber: accountNumber.trim(),
            ifscCode: cleanIfsc,
          },
        },
        update(cache, { data }) {
          const newBankAccount = data?.addBankAccount;
          if (!newBankAccount) return;

          try {
            const existingData = cache.readQuery({
              query: MY_BANK_ACCOUNTS,
            });

            if (existingData?.myBankAccounts) {
              cache.writeQuery({
                query: MY_BANK_ACCOUNTS,
                data: {
                  myBankAccounts: [newBankAccount, ...existingData.myBankAccounts],
                },
              });
            }
          } catch (err) {
            // Safe fallback if query not in cache yet
          }
        },
      });

      toast?.show({
        label: "Success",
        description: "Bank account added successfully!",
        variant: "success",
      });

      router.back();
    } catch (error) {
      toast?.show({
        label: "Error",
        description: error?.message || "Failed to add bank account.",
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
            <Text className="text-2xl font-noir font-bold text-white">Add Bank Account</Text>
          </View>
          <Text className="text-xs font-noir text-gray-400 pl-[52px]">
            Enter your bank details for verified fiat settlements (Max 3 accounts).
          </Text>
        </View>

        {/* Form Fields Component */}
        <AddBankForm
          bankName={bankName}
          selectedBankObj={selectedBankObj}
          onOpenBankDialog={() => setIsBankDialogOpen(true)}
          accountType={accountType}
          setAccountType={setAccountType}
          accountHolderName={accountHolderName}
          setAccountHolderName={setAccountHolderName}
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          ifscCode={ifscCode}
          setIfscCode={setIfscCode}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </View>

      {/* Standalone SelectBankDialog Component */}
      <SelectBankDialog
        isOpen={isBankDialogOpen}
        onOpenChange={setIsBankDialogOpen}
        value={bankName}
        onSelect={setBankName}
      />
    </PageContainer>
  );
}
