import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConfirmExit } from "../../hooks/useConfirmExit";
import ConfirmExitDialog from "../../components/dialog/ConfirmExitDialog";
import { BankAccountCard } from "./BankSection";
import { AdminBankAccountCard } from "./AdminBankAccountCard";
import { CryptoAddressCard } from "./CryptoAddressCard";
import { OrderDetailsCard } from "./OrderDetailsCard";
import { useUser } from "../../hooks/useUser";

/**
 * Order Screen — A premium, dummy order preview screen that displays the chosen bank account
 * and details of the order. Conforms to the parent UserLayout container.
 */
export default function OrderOverview() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { isOpen, setIsOpen, confirmExit, cancelExit } = useConfirmExit();
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


    return (
        <View className="w-full pb-8 gap-12">
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
            {/* Exit confirmation dialog */}
            <ConfirmExitDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                onConfirm={confirmExit}
            />
        </View>
    );
}
