import { View, ActivityIndicator } from "react-native";
import Button from "../../../components/Button";

/**
 * WithdrawConfirmFooter — Final confirmation submission CTA.
 */
export default function WithdrawConfirmFooter({ loading, disabled, onConfirm }) {
  return (
    <View className="w-full pt-4 pb-2">
      <Button
        onPress={onConfirm}
        primary={true}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color="#111418" />
        ) : (
          "Confirm"
        )}
      </Button>
    </View>
  );
}
