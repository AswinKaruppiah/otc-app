import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useConfirmExit } from "../../hooks/useConfirmExit";
import ConfirmExitDialog from "../../components/dialog/ConfirmExitDialog";
import { BankAccountCard } from "./BankSection";
import { AdminBankAccountCard } from "./AdminBankAccountCard";
import { CryptoAddressCard } from "./CryptoAddressCard";
import { OrderDetailsCard } from "./OrderDetailsCard";
import { PaymentProofUploader } from "./PaymentProofUploader";
import OrderSuccess from "./OrderSuccess";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";
import { usePaymentUpload } from "../../hooks/usePaymentUpload";
import PageContainer from "../../components/PageContainer";

/**
 * Order Screen — A premium order preview screen that displays the chosen bank account,
 * details of the order, and handles order creation and payment proof uploads.
 * Conforms to the parent UserLayout container.
 */
export default function OrderOverview() {
    const params = useLocalSearchParams();
    const { user } = useUser();
    const assignedAdminBank = user?.assignedAdminBank;

    // Retrieve parameters passed via route navigation
    const {
        id,
        bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
        branch,
        type,
        inrAmount,
        usdtAmount,
        exchangeRate,
    } = params;

    const [orderCompleted, setOrderCompleted] = useState(false);

    // Custom hook for handling uploads
    const { proofsList, setProofsList, isLoading: isSubmitting, handleUpload } = usePaymentUpload();

    // Only block navigation if order is NOT completed
    const { isOpen, setIsOpen, confirmExit, cancelExit } = useConfirmExit(!orderCompleted);

    const totalUploadedAmount = proofsList.reduce((sum, proof) => {
        const val = parseFloat(proof.amount) || 0;
        return sum + val;
    }, 0);
    const requiredAmount = parseFloat(String(inrAmount).replace(/,/g, "")) || 0;
    const isAmountMatching = Math.abs(totalUploadedAmount - requiredAmount) < 0.01;

    const isFormValid = proofsList.length > 0 && isAmountMatching;

    const handleConfirmPayment = () => {
        if (!isFormValid) return;
        handleUpload({
            userBankId: id,
            inrAmount,
            usdtAmount,
            exchangeRate,
            onSuccess: () => setOrderCompleted(true),
        });
    };

    if (orderCompleted) {
        return <OrderSuccess />;
    }

    return (
        <PageContainer className="w-full flex-1">
            <View className="flex-1">
                <View className="w-full gap-10">
                    <OrderDetailsCard
                        inrAmount={inrAmount}
                        usdtAmount={usdtAmount}
                        exchangeRate={exchangeRate}
                    />

                    {assignedAdminBank && (
                        <AdminBankAccountCard bank={assignedAdminBank} />
                    )}

                    <CryptoAddressCard />

                    <BankAccountCard
                        bankName={bankName}
                        type={type}
                        accountNumber={accountNumber}
                        accountHolderName={accountHolderName}
                        ifscCode={ifscCode}
                        branch={branch}
                    />

                    <PaymentProofUploader
                        onProofsChanged={setProofsList}
                        initialSenderName={accountHolderName}
                        initialSenderBank={bankName}
                        requiredAmount={requiredAmount}
                        totalUploadedAmount={totalUploadedAmount}
                    />

                    {/* Confirm Payment Action Button */}
                    <View className="mt-12">
                        <Button
                            onPress={handleConfirmPayment}
                            primary={true}
                            disabled={!isFormValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#111418" />
                            ) : isFormValid ? (
                                "Confirm"
                            ) : (
                                `Confirm (${requiredAmount > 0 ? Math.round((totalUploadedAmount / requiredAmount) * 100) : 0}%)`
                            )}
                        </Button>
                    </View>
                </View>

                {/* Exit confirmation dialog */}
                <ConfirmExitDialog
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    onConfirm={confirmExit}
                />
            </View>
        </PageContainer>
    );
}
