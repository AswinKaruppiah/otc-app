import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { Skeleton } from "heroui-native";
import { getInitials, getHighResProfileImage } from "../../../utils/helper";
import Show from "../../../components/Show";

/**
 * ProfileHeroCard — Editorial portrait hero header matching the reference design:
 * 1. Large portrait rounded card (image or gradient monogram avatar)
 * 2. Floating Account Type badge on photo card
 * 3. Bold Display Name with Verified checkmark badge
 * 4. Editorial bio / status description with Account Type
 */
export default function ProfileHeroCard({
  user,
  loading,
  onActionPress,
  actionLabel = "+ Link New Account",
}) {
  const displayName = user?.fullName || "Quotex Trader";
  const displayEmail = user?.email || "trader@quotex.io";
  const initials = getInitials(displayName);
  const isVerified = user?.kycStatus?.toUpperCase() === "APPROVED" || user?.kycStatus?.toUpperCase() === "VERIFIED";
  const profileImageUrl = getHighResProfileImage(user?.profileImage, 512);

  const isCorporate = user?.profileType === "corporate";
  const accountTypeLabel = isCorporate ? "Business Account" : "Individual Account";
  const accountIcon = isCorporate ? "briefcase" : "user";
  const accountColor = isCorporate ? "#96dded" : "#baffd8";

  return (
    <View className="w-full mb-6">
      <Show>
        <Show.If isTrue={loading}>
          {/* 1. Skeleton Hero State */}
          <Skeleton className="w-full h-[340px] rounded-[36px] bg-white/10 mb-5" />

          {/* 2. Name & Badge Skeleton */}
          <View className="flex-row items-center gap-2 mb-2">
            <Skeleton className="w-48 h-8 rounded-xl bg-white/10" />
            <Skeleton className="w-5 h-5 rounded-full bg-white/10" />
          </View>

          {/* 3. Bio / Subtitle 2-line Skeleton matching leading-5 (40px) + mb-4 */}
          <View className="h-[40px] justify-between mb-4">
            <Skeleton className="w-full h-[15px] rounded-md bg-white/10" />
            <Skeleton className="w-3/4 h-[15px] rounded-md bg-white/10" />
          </View>
        </Show.If>

        <Show.Else>
          {/* 1. Large Portrait Photo / Stylized Hero Banner */}
          <View className="w-full h-[340px] rounded-[36px] overflow-hidden bg-noirCard border border-white/10 relative mb-5">
            <Show>
              <Show.If isTrue={profileImageUrl}>
                <Image
                  source={{ uri: profileImageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </Show.If>
              <Show.Else>
                <LinearGradient
                  colors={["#0a1118", "#121e24", "#0c3624"]}
                  start={{ x: 0.1, y: 0.1 }}
                  end={{ x: 0.9, y: 0.9 }}
                  className="w-full h-full items-center justify-center relative"
                >
                  {/* Monogram / Silhouette Illustration */}
                  <View className="w-32 h-32 rounded-full bg-white/[0.04] border border-white/10 items-center justify-center shadow-inner">
                    <Text className="text-white font-noir-medium text-4xl tracking-widest">
                      {initials}
                    </Text>
                  </View>
                </LinearGradient>
              </Show.Else>
            </Show>

            {/* Bottom Gradient Vignette for soft transition */}
            <LinearGradient
              colors={["transparent", "rgba(17, 20, 24, 0.7)", "rgba(17, 20, 24, 0.95)"]}
              className="absolute bottom-0 left-0 right-0 h-28 justify-end p-5"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-noir text-white/60" numberOfLines={1}>
                  {displayEmail}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* 2. Name & Verified Checkmark Badge */}
          <View className="flex-row items-center gap-1.5 mb-2">
            <Text
              style={{
                includeFontPadding: false,
                transform: [{ translateY: 1.5 }],
              }}
              className="text-2xl font-noir-medium text-white tracking-tight"
            >
              {displayName}
            </Text>
            <Show>
              <Show.If isTrue={isVerified}>
                <MaterialCommunityIcons name="check-decagram" size={20} color="#baffd8" />
              </Show.If>
            </Show>
          </View>

          {/* 3. Bio / Tagline with Account Info */}
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-gray-300 font-noir text-[13px]">
              {isCorporate && user?.companyName ? user.companyName : accountTypeLabel}
            </Text>
            <Text className="text-gray-600 font-noir text-[12px]">•</Text>
            <Text className="text-gray-400 font-noir text-[13px]">
              Quotex OTC Trader
            </Text>
          </View>
        </Show.Else>
      </Show>
    </View>
  );
}
