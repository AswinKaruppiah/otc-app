import React from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useUser } from "../../hooks/useUser";
import { getInitials } from "../../utils/helper";

/**
 * Profile Screen — User avatar, status details, account actions.
 * Rebuilt using the premium Noir theme:
 *   - Base font:  /
 *   - Colors: bg-noirCard, bg-noirMint, bg-noirCyan
 */
export default function Profile() {
  const { user, loading, error } = useUser();

  if (loading && !user) {
    return (
      <View className="flex-1 items-center justify-center py-20 w-full">
        <ActivityIndicator size="large" color="#baffd8" />
        <Text className="text-gray-400 font-noir mt-4 text-[14px]">
          Loading Profile...
        </Text>
      </View>
    );
  }

  const displayName = user?.fullName || "Guest User";
  const displayEmail = user?.email || "No Email Address";
  const displayInitials = getInitials(displayName);
  const displayBadge = user?.kycStatus === "APPROVED" 
    ? "Verified Member" 
    : user?.kycStatus 
      ? `KYC: ${user.kycStatus}` 
      : "Standard Account";

  const profileOptions = [
    { id: "1", label: "Personal Details", value: displayName, icon: "user" },
    {
      id: "2",
      label: "Linked Bank Accounts",
      value: "2 Banks",
      icon: "briefcase",
    },
    {
      id: "3",
      label: "Security & Biometrics",
      value: "FaceID On",
      icon: "shield",
    },
    { id: "4", label: "Preferences", value: "English • USD", icon: "sliders" },
  ];

  return (
    <View className="items-center py-[10px] w-full">
      {/* Avatar Section */}
      <View className="items-center mb-6">
        <View className="w-24 h-24 rounded-full bg-noirMint/10 border-2 border-noirMint/25 items-center justify-center mb-3.5 relative">
          <Text className="text-noirMint font-noir text-[32px] ">{displayInitials}</Text>
          <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-noirMint border-2 border-noirBg items-center justify-center">
            <Feather name="camera" size={14} color="#111418" />
          </TouchableOpacity>
        </View>
        <Text className="text-[22px] text-noirText font-noir mb-1">{displayName}</Text>
        <Text className="text-[14px] text-gray-400 font-noir">
          {displayEmail}
        </Text>
      </View>

      {/* Account Tier Badge */}
      <View className="bg-noirMint/10 border border-noirMint/25 px-4 py-1.5 rounded-full mb-8 flex-row items-center gap-1.5">
        <Feather name="award" size={14} color="#baffd8" />
        <Text className="text-noirMint font-noir text-[12px] tracking-[0.5px]">
          {displayBadge}
        </Text>
      </View>

      {/* Options List */}
      <View className="w-full gap-4 mb-8">
        {profileOptions.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            activeOpacity={0.7}
            className="w-full bg-noirCard rounded-2xl p-4 border border-white/[0.04] flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3.5">
              <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center">
                <Feather name={opt.icon} size={18} color="white" />
              </View>
              <View>
                <Text className="text-[14px] text-gray-400 font-noir mb-0.5">
                  {opt.label}
                </Text>
                <Text className="text-[15px] text-noirText font-noir">{opt.value}</Text>
              </View>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color="rgba(255, 255, 255, 0.35)"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3 mb-4">
        <TouchableOpacity className="w-full bg-white/5 border border-white/[0.04] py-4 rounded-xl flex-row items-center justify-center gap-2">
          <Feather name="help-circle" size={16} color="white" />
          <Text className="text-noirText font-noir text-[15px] ">Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full bg-red-500/5 border border-red-500/10 py-4 rounded-xl flex-row items-center justify-center gap-2">
          <Feather name="log-out" size={16} color="#ff7b7b" />
          <Text className="text-[#ff7b7b] font-noir text-[15px] ">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
