import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { haptic } from "../../utils/haptics";

/**
 * Order Screen — A premium, dummy order preview screen that displays the chosen bank account
 * and details of the order. Conforms to the parent UserLayout container.
 */
export default function OrderOverview() {
    const router = useRouter();
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

    const [proofsList, setProofsList] = useState([]);
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Only block navigation if order is NOT completed
    const { isOpen, setIsOpen, confirmExit, cancelExit } = useConfirmExit(!orderCompleted);

    const isFormValid = proofsList.length > 0;

    const handleConfirmPayment = () => {
        if (!isFormValid) return;
        haptic.medium();
        setIsSubmitting(true);

        // Simulate a network upload request for 1.5 seconds
        setTimeout(() => {
            haptic.success();
            setIsSubmitting(false);
            setOrderCompleted(true);
        }, 1500);
    };

    if (orderCompleted) {
        return (
            <OrderSuccess
                inrAmount={inrAmount}
                usdtAmount={usdtAmount}
                walletAddress={user?.walletAddress}
                proofsList={proofsList}
            />
        );
    }

    return (
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

                {/* Payment Proof Uploader */}
                <PaymentProofUploader
                    onProofsChanged={setProofsList}
                    initialSenderName={accountHolderName}
                    initialSenderBank={bankName}
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
                        ) : (
                            "Confirm Payment"
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
    );
}
