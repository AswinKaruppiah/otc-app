import { useEffect, useRef } from "react";
import { View, Text, ScrollView, Animated } from "react-native";
import Button from "../../components/Button";
import { useUser } from "../../hooks/useUser";
import { Avatar } from "heroui-native";
import { withUniwind } from "uniwind";
import Feather from "@expo/vector-icons/Feather";
import { getInitials } from "../../utils/helper";

const StyledFeather = withUniwind(Feather);

const PROFILE_TYPE_LABELS = {
  individual: "Individual Account",
  corporate: "Business Account",
};

export default function SuccessScreen({ onFinish }) {
  const { user } = useUser();

  const badgeScale = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentRise = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(badgeScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.spring(contentRise, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const profileTypeLabel = PROFILE_TYPE_LABELS[user?.profileType] ?? user?.profileType;

  return (
    <View className="flex-1 justify-between px-5 py-4 w-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", flexGrow: 1, justifyContent: "center" }}
      >
        {/* Celebration Badge */}
        <Animated.View
          style={{ transform: [{ scale: badgeScale }] }}
          className="items-center justify-center mb-5"
        >
          <View className="w-32 h-32 rounded-full bg-noirMint/10 items-center justify-center">
            <View className="w-24 h-24 rounded-full bg-noirMint items-center justify-center">
              <StyledFeather name="check" size={48} colorClassName="accent-noirBg" />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={{ opacity: contentFade, transform: [{ translateY: contentRise }] }}
          className="items-center w-full"
        >
          {/* Header Info */}
          <View className="items-center mb-7">
            <Text className="text-[32px] text-noirText font-noir mb-2 text-center tracking-[-0.5px]">
              You're all set
            </Text>
            <Text className="text-[14px] text-gray-400 font-noir text-center max-w-[280px] leading-[20px]">
              Your account has been created and is ready to use.
            </Text>
          </View>

          {/* Profile Summary Card */}
          <View className="flex-row items-center w-full bg-noirBg border border-white/10 rounded-full px-4 py-4">
            <Avatar className="w-24 aspect-square rounded-full bg-white/5 border border-white/10">
              {user?.profileImage ? (
                <Avatar.Image source={{ uri: user.profileImage }} />
              ) : null}
              <Avatar.Fallback className="bg-transparent">
                <Text className="text-white text-lg font-noir-medium">
                  {getInitials(user?.fullName)}
                </Text>
              </Avatar.Fallback>
            </Avatar>

            <View className="flex-1 ml-4">
              <Text className="text-white text-lg font-noir-medium mb-0.5" numberOfLines={1}>
                {user?.fullName}
              </Text>
              <Text className="text-gray-400 text-sm font-noir mb-2.5" numberOfLines={1}>
                {user?.email}
              </Text>

              {profileTypeLabel ? (
                <View className="flex-row items-center self-start bg-noirMint/10 px-3 py-1.5 rounded-full">
                  <StyledFeather name="user-check" size={13} colorClassName="accent-noirMint" />
                  <Text className="text-noirMint text-[11px] font-noir-medium uppercase tracking-wider ml-1.5">
                    {profileTypeLabel}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Button */}
      <Animated.View style={{ opacity: contentFade }} className="w-full pt-4">
        <Button onPress={onFinish} primary={true}>
          Go to Dashboard
        </Button>
      </Animated.View>
    </View>
  );
}
