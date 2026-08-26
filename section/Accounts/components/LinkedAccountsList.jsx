import React from "react";
import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton } from "heroui-native";
import Show from "../../../components/Show";
import EmptyState from "../../../components/EmptyState";
import { maskAccountNumber } from "../../../utils/helper";

/**
 * LinkedAccountsList — Renders list of linked bank accounts handling all 4 UI states:
 * Loading, Error, Empty / No Data, and Data state.
 */
export default function LinkedAccountsList({
  loading = false,
  error = null,
  accounts = [],
  refetch,
}) {
  return (
    <View className="w-full mb-6">
      <Text className="text-[17px] text-noirText font-noir mb-3 tracking-[0.2px]">
        Linked Accounts
      </Text>

      <Show>
        {/* 1. Loading State */}
        <Show.If isTrue={loading}>
          <View className="w-full gap-4">
            {[1, 2].map((key) => (
              <View
                key={key}
                className="w-full bg-noirCard rounded-2xl p-5 border border-white/[0.04]"
              >
                <View className="flex-row items-center gap-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <View className="gap-2">
                    <Skeleton className="w-32 h-5 rounded-md" />
                    <Skeleton className="w-20 h-4 rounded-md" />
                  </View>
                </View>
                <View className="border-t border-white/[0.04] pt-4 gap-2.5">
                  <View className="flex-row justify-between">
                    <Skeleton className="w-24 h-4 rounded-md" />
                    <Skeleton className="w-28 h-4 rounded-md" />
                  </View>
                  <View className="flex-row justify-between">
                    <Skeleton className="w-20 h-4 rounded-md" />
                    <Skeleton className="w-24 h-4 rounded-md" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Show.If>

        {/* 2. Error State */}
        <Show.ElseIf isTrue={!!error}>
          <EmptyState
            type="error"
            title="Failed to load bank accounts"
            description={error?.message || "Something went wrong while fetching details."}
            actionLabel="Retry"
            onAction={refetch}
          />
        </Show.ElseIf>

        {/* 3. Empty / No Data State */}
        <Show.ElseIf isTrue={!accounts || accounts.length === 0}>
          <EmptyState
            type="empty"
            icon="credit-card"
            title="No Bank Accounts Linked"
            description="You haven't linked any bank accounts yet. Tap the plus button above to connect your account."
          />
        </Show.ElseIf>

        {/* 4. Data State */}
        <Show.Else>
          <View className="w-full gap-4">
            {accounts.map((bank, index) => {
              const colors = ["#baffd8", "#96dded", "#ffc4d6", "#e8caff"];
              const iconColor = bank.iconColor || colors[index % colors.length];
              const type = bank.accountType || bank.type || "Checking Account";
              const icon = bank.icon || (type.toLowerCase().includes("saving") ? "briefcase" : "home");
              const accountNum = bank.accountNumberMasked || maskAccountNumber(bank.accountNumber || "");
              const statusText = bank.status || (bank.isActive ? "Active" : "Linked");

              return (
                <View
                  key={bank.id || index}
                  className="w-full bg-noirCard rounded-2xl p-5 border border-white/[0.04] relative overflow-hidden"
                >
                  {/* Header: Bank Name & Status */}
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: `${iconColor}15` }}
                      >
                        <Feather name={icon} size={18} color={iconColor} />
                      </View>
                      <View>
                        <Text className="text-noirText font-noir text-[16px]">
                          {bank.bankName}
                        </Text>
                        <Text className="text-gray-400 font-noir text-[12px]">
                          {type}
                        </Text>
                      </View>
                    </View>
                    <View className="px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5">
                      <Text className="text-noirText font-noir text-[11px] capitalize">
                        {statusText}
                      </Text>
                    </View>
                  </View>

                  {/* Account Details */}
                  <View className="border-t border-white/[0.04] pt-4 gap-2.5">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-400 font-noir text-[13px]">
                        Account Number
                      </Text>
                      <Text className="text-noirText font-noir text-[14px]">
                        {accountNum}
                      </Text>
                    </View>
                    {bank.ifscCode ? (
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-400 font-noir text-[13px]">
                          IFSC Code
                        </Text>
                        <Text className="text-noirText font-noir text-[14px]">
                          {bank.ifscCode}
                        </Text>
                      </View>
                    ) : null}
                    {bank.accountHolderName ? (
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-400 font-noir text-[13px]">
                          Account Holder
                        </Text>
                        <Text className="text-noirText font-noir text-[14px]">
                          {bank.accountHolderName}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}
