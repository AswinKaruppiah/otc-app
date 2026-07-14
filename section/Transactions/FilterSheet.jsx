import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { BottomSheet } from "heroui-native";

const statuses = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export default function FilterSheet({
  isOpen,
  onOpenChange,
  currentStatus,
  currentDateFrom,
  currentDateTo,
  onApply,
  onClear,
}) {
  const [form, setForm] = useState({
    status: currentStatus || "all",
    dateFrom: currentDateFrom || "",
    dateTo: currentDateTo || "",
  });

  // Sync internal state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        status: currentStatus || "all",
        dateFrom: currentDateFrom || "",
        dateTo: currentDateTo || "",
      });
    }
  }, [isOpen, currentStatus, currentDateFrom, currentDateTo]);

  const handleApply = () => {
    onApply({
      status: form.status === "all" ? null : form.status,
      dateFrom: form.dateFrom || null,
      dateTo: form.dateTo || null,
    });
    onOpenChange(false);
  };

  const handleClear = () => {
    setForm({
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
    onClear();
    onOpenChange(false);
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View>
            {/* Header */}
            <View className="mb-6 gap-1.5 items-start">
              <BottomSheet.Title className="text-center font-noir-medium text-white text-lg">
                Filter Transactions
              </BottomSheet.Title>
              <BottomSheet.Description className="text-center font-noir text-sm text-gray-400">
                Narrow down your trade search
              </BottomSheet.Description>
            </View>

            {/* Status Selector */}
            <View className="mb-6">
              <Text className="text-sm font-noir font-semibold text-gray-300 mb-3">
                Transaction Status
              </Text>
              <View className="flex-row bg-white/5 p-1 rounded-full w-full">
                {statuses.map((item) => {
                  const isActive = form.status === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => setForm((prev) => ({ ...prev, status: item.value }))}
                      className={`flex-1 py-3 rounded-full items-center justify-center transition-all ${isActive
                        ? "bg-noirMint"
                        : "bg-transparent"
                        }`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-xs font-noir font-bold ${isActive ? "text-[#111418]" : "text-gray-400"
                          }`}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Date Range Section */}
            <View className="mb-8">
              <Text className="text-sm font-noir font-semibold text-gray-300 mb-3">
                Date Range (YYYY-MM-DD)
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 font-noir mb-1.5">From Date</Text>
                  <TextInput
                    value={form.dateFrom}
                    onChangeText={(val) => setForm((prev) => ({ ...prev, dateFrom: val }))}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(255, 255, 255, 0.25)"
                    maxLength={10}
                    className="w-full bg-white/5 border border-white/[0.08] text-white rounded-xl p-3 font-noir text-sm"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 font-noir mb-1.5">To Date</Text>
                  <TextInput
                    value={form.dateTo}
                    onChangeText={(val) => setForm((prev) => ({ ...prev, dateTo: val }))}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="rgba(255, 255, 255, 0.25)"
                    maxLength={10}
                    className="w-full bg-white/5 border border-white/[0.08] text-white rounded-xl p-3 font-noir text-sm"
                  />
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleClear}
                className="flex-1 py-3.5 border border-white/[0.1] bg-white/5 rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-white font-noir font-semibold">
                  Clear
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="flex-1 py-3.5 bg-noirMint rounded-full items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-[#111418] font-noir font-bold">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
