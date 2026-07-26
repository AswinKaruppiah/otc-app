import { View, Pressable, Image, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export const ImagePreviewModal = ({ imageUrl, onClose }) => {
  return (
    <Modal
      visible={!!imageUrl}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/90 items-center justify-center p-4 relative">
        <Pressable
          onPress={onClose}
          className="absolute top-12 right-6 z-50 p-3 rounded-full bg-white/10 border border-white/20 active:bg-white/20"
        >
          <Feather name="x" size={22} color="#ffffff" />
        </Pressable>

        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "80%", borderRadius: 16 }}
            resizeMode="contain"
          />
        )}
      </View>
    </Modal>
  );
};
