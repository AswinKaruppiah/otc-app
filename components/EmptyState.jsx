import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import HapticTouchableOpacity from "./HapticTouchableOpacity";

/**
 * EmptyState — Reusable Empty and Error state component matching TransactionList styling.
 * Uses large transparent background icons (size 156), bold text, and optional action buttons.
 */
export default function EmptyState({
  type = "empty",
  icon,
  iconSize = 156,
  title,
  description,
  actionLabel,
  onAction,
}) {
  const isError = type === "error";
  const isSearch = type === "search";

  // Resolve icon
  const resolvedIcon =
    icon || (isError ? "alert-circle" : isSearch ? "search" : "inbox");

  // Icon color: red for error, mint for empty/search
  const iconColor = isError
    ? "rgba(255, 123, 123, 0.2)"
    : "rgba(186, 255, 216, 0.2)";

  // Default title based on type
  const resolvedTitle =
    title ||
    (isError
      ? "Failed to load transactions"
      : isSearch
        ? "No results found"
        : "No transactions yet");

  // Default description based on type
  const resolvedDescription =
    description ||
    (isError
      ? "Something went wrong. Please try again later."
      : isSearch
        ? "We couldn't find any trades matching your filter criteria."
        : "Your trade transactions history will show up here once you start.");

  return (
    <View className="items-center justify-center py-16 px-6">
      {/* Large Transparent Icon */}
      <View className="mb-6 items-center justify-center">
        <Feather name={resolvedIcon} size={iconSize} color={iconColor} />
      </View>

      {/* Title */}
      <Text className="text-lg text-noirText font-noir font-bold mb-2 text-center">
        {resolvedTitle}
      </Text>

      {/* Description */}
      <Text className="text-sm text-gray-400 font-noir text-center max-w-[280px] leading-5">
        {resolvedDescription}
      </Text>

      {/* Optional Action Button */}
      {actionLabel && onAction ? (
        <HapticTouchableOpacity
          onPress={onAction}
          hapticType="light"
          className="mt-6 px-6 py-3 rounded-full bg-white/10 border border-white/15 active:opacity-75 flex-row items-center gap-2"
        >
          {isError && <Feather name="refresh-cw" size={14} color="#baffd8" />}
          <Text className="text-noirMint font-noir text-sm font-medium">
            {actionLabel}
          </Text>
        </HapticTouchableOpacity>
      ) : null}
    </View>
  );
}
