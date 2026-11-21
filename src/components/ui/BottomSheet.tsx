import type { ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function BottomSheet({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <Pressable
          accessibilityLabel="Close"
          className="absolute inset-0"
          onPress={onClose}
        />
        <View
          className="bg-card rounded-t-2xl px-5 pt-3"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <View className="items-center mb-3">
            <View className="w-10 h-1 rounded-full bg-border" />
          </View>
          <Text className="text-lg font-bold text-text mb-3">{title}</Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}
