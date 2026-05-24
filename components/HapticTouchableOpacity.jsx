import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * HapticTouchableOpacity — A drop-in replacement for TouchableOpacity
 * that automatically triggers custom haptic vibration feedback on press.
 *
 * Supports a custom `hapticType` prop:
 * - 'light' (default): Haptics.ImpactFeedbackStyle.Light
 * - 'medium': Haptics.ImpactFeedbackStyle.Medium
 * - 'heavy': Haptics.ImpactFeedbackStyle.Heavy
 * - 'selection': Haptics.selectionAsync()
 * - 'success': Haptics.notificationAsync(Success)
 * - 'warning': Haptics.notificationAsync(Warning)
 * - 'error': Haptics.notificationAsync(Error)
 */
export default function HapticTouchableOpacity({
  onPress,
  hapticType = "light",
  children,
  ...props
}) {
  const handlePress = (event) => {
    if (Platform.OS !== "web") {
      try {
        switch (hapticType) {
          case "medium":
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case "heavy":
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case "selection":
            Haptics.selectionAsync();
            break;
          case "success":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case "warning":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case "error":
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case "light":
          default:
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        }
      } catch (error) {
        // Safe fallback in case native module is unavailable
      }
    }
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} {...props}>
      {children}
    </TouchableOpacity>
  );
}
