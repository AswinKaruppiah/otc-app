import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Dialog, Skeleton } from "heroui-native";
import Feather from "@expo/vector-icons/Feather";
import Show from "../../../components/Show";
import SelectAddressDialog from "../../../components/dialog/SelectAddressDialog";

/**
 * Truncate address: TQp8LmN2...6zU1
 */
function elideAddress(addr) {
  if (!addr) return "";
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}····${addr.slice(-6)}`;
}

/**
 * WithdrawModal — Dialog modal for entering amount, selecting whitelisted wallet, and confirming USDT withdrawal.
 */
export default function WithdrawModal({
  isOpen,
  onOpenChange,
  walletBalance = 0,
  whitelistedAddresses = [],
  walletLoading = false,
  submitting = false,
  onSubmit,
  onAddAddress,
}) {
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);

  // Pre-select default or first whitelisted address when modal opens or addresses load
  useEffect(() => {
    if (whitelistedAddresses.length > 0) {
      if (!selectedAddress || !whitelistedAddresses.some((a) => a.id === selectedAddress.id)) {
        const defaultAddr =
          whitelistedAddresses.find((a) => a.isDefault) || whitelistedAddresses[0];
        setSelectedAddress(defaultAddr);
      }
    }
  }, [whitelistedAddresses, isOpen]);

  // Reset form when modal closes
  const handleClose = () => {
    setAmount("");
    onOpenChange?.(false);
  };

  const handleQuickPercent = (percent) => {
    const calc = (walletBalance * percent).toFixed(2);
    setAmount(calc > 0 ? calc.toString() : "");
  };

  const numAmount = parseFloat(amount) || 0;
  const isExceeding = numAmount > walletBalance;
  const canSubmit =
    numAmount > 0 &&
    !isExceeding &&
    Boolean(selectedAddress?.address) &&
    !submitting;

  const handleConfirm = () => {
    if (!canSubmit || !selectedAddress?.address) return;
    onSubmit?.({
      amount: amount.trim(),
      recipientAddress: selectedAddress.address,
      onSuccess: handleClose,
    });
  };

  return (
    <>
      <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/80" />
          <Dialog.Content
            isSwipeable={false}
            className="rounded-3xl p-5 w-[92vw] self-center max-h-[85vh] bg-[#0d1317] border border-white/10"
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center pb-3 border-b border-white/10 mb-4">
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-xl bg-noirMint/10 border border-noirMint/25 items-center justify-center">
                  <Feather name="upload" size={16} color="#baffd8" />
                </View>
                <View>
                  <Dialog.Title className="text-base text-white font-noir-bold">
                    Withdraw USDT
                  </Dialog.Title>
                  <Text className="text-[11px] font-noir text-gray-400">
                    Send to whitelisted address
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <Feather name="x" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Dialog.Description className="hidden">
              Withdrawal Modal Dialog
            </Dialog.Description>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {/* Available Balance Header Strip */}
              <View className="bg-white/5 border border-white/10 rounded-2xl p-3 flex-row justify-between items-center mb-4">
                <Text className="text-xs font-noir text-gray-400">
                  Available Balance
                </Text>
                <Text className="text-xs font-noir font-bold text-noirMint">
                  {walletBalance.toFixed(2)} USDT
                </Text>
              </View>

              {/* Amount Input */}
              <View className="bg-white/5 border border-white/10 rounded-2xl p-4 items-center mb-4">
                <Text className="text-[11px] font-noir font-semibold text-noirCyan uppercase tracking-wider mb-2">
                  Amount to Withdraw
                </Text>

                <View className="flex-row items-center justify-center mb-1">
                  <Text className="text-2xl font-noir text-gray-400 mr-1">$</Text>
                  <TextInput
                    placeholder="0.00"
                    placeholderTextColor="rgba(255, 255, 255, 0.25)"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    className="text-3xl font-noir font-bold text-white text-center min-w-[120px] max-w-[200px]"
                  />
                </View>

                {/* Validation Warning */}
                {isExceeding && (
                  <Text className="text-[11px] font-noir text-red-400 mb-2">
                    Exceeds available balance ({walletBalance.toFixed(2)} USDT)
                  </Text>
                )}

                {/* Quick Percent Pills */}
                <View className="flex-row gap-2 mt-1">
                  {[0.25, 0.5, 1.0].map((val, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleQuickPercent(val)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg active:bg-white/15"
                    >
                      <Text className="text-[11px] font-noir font-medium text-gray-200">
                        {val === 1.0 ? "MAX" : `${val * 100}%`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Destination Address Selector */}
              <Text className="text-xs font-noir font-semibold text-gray-300 mb-1.5 pl-1">
                Recipient Address *
              </Text>

              <Show>
                <Show.If isTrue={walletLoading}>
                  <Skeleton className="h-14 w-full rounded-2xl bg-white/5 mb-4" />
                </Show.If>
                <Show.ElseIf isTrue={whitelistedAddresses.length === 0}>
                  <View className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 mb-4">
                    <View className="flex-row items-center gap-2 mb-1.5">
                      <Feather name="alert-triangle" size={14} color="#fbbf24" />
                      <Text className="font-noir font-semibold text-xs text-amber-400">
                        No Whitelisted Address
                      </Text>
                    </View>
                    <Text className="font-noir text-[11px] text-gray-300 mb-2.5 leading-4">
                      You must add a whitelisted TRON address before withdrawing.
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleClose();
                        onAddAddress?.();
                      }}
                      className="w-full py-2 bg-amber-500/20 border border-amber-500/40 rounded-xl items-center"
                    >
                      <Text className="font-noir font-semibold text-[11px] text-amber-300">
                        + Add Whitelisted Address
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Show.ElseIf>
                <Show.Else>
                  <TouchableOpacity
                    onPress={() => setIsAddressPickerOpen(true)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 flex-row justify-between items-center mb-4 active:bg-white/10"
                  >
                    {selectedAddress ? (
                      <View className="flex-row items-center gap-2.5 flex-1">
                        <View className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 items-center justify-center">
                          <Feather name="shield" size={15} color="#f87171" />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-1.5">
                            <Text className="font-noir font-semibold text-xs text-white">
                              {selectedAddress.label || "Whitelisted Address"}
                            </Text>
                            <Text className="text-[9px] font-noir-medium text-red-400 bg-red-500/15 px-1 py-0.2 rounded">
                              TRC-20
                            </Text>
                          </View>
                          <Text className="font-mono text-[11px] text-gray-400 mt-0.5">
                            {elideAddress(selectedAddress.address)}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <Text className="font-noir text-xs text-gray-400">
                        Select recipient address...
                      </Text>
                    )}
                    <Feather name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </Show.Else>
              </Show>

              {/* Security Notice */}
              <View className="bg-white/5 border border-white/5 rounded-xl p-3 flex-row items-center gap-2.5 mb-5">
                <Feather name="lock" size={13} color="#baffd8" />
                <Text className="text-[11px] font-noir text-gray-400 flex-1 leading-4">
                  Withdrawals are irreversible and sent directly to your whitelisted wallet.
                </Text>
              </View>
            </ScrollView>

            {/* Modal Footer Submit & Cancel */}
            <View className="gap-2 pt-2 border-t border-white/10">
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!canSubmit}
                className={`w-full py-3.5 rounded-xl flex-row items-center justify-center gap-2 ${
                  canSubmit
                    ? "bg-noirMint shadow-lg shadow-noirMint/20 active:opacity-90"
                    : "bg-noirMint/20 opacity-40"
                }`}
              >
                {submitting ? (
                  <ActivityIndicator color="#111418" size="small" />
                ) : (
                  <>
                    <Feather name="arrow-up-right" size={16} color="#111418" />
                    <Text className="text-noirBg font-noir font-bold text-sm">
                      Confirm Withdrawal
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClose}
                className="w-full bg-white/5 border border-white/10 py-3 rounded-xl flex-row items-center justify-center active:bg-white/10"
              >
                <Text className="text-gray-300 font-noir font-medium text-xs">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      {/* Select Address Dialog */}
      <SelectAddressDialog
        isOpen={isAddressPickerOpen}
        onOpenChange={setIsAddressPickerOpen}
        addresses={whitelistedAddresses}
        selectedId={selectedAddress?.id}
        onSelect={setSelectedAddress}
      />
    </>
  );
}
