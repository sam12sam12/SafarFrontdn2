import { ActivityIndicator, Modal, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useLoadingStore } from "@/Stores/useLoadingStore";
import { colors } from "@/utils/theme";

export function GlobalLoadingModal() {
  const { visible, message } = useLoadingStore();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-overlay px-8">
        <Animated.View
          entering={FadeIn.duration(150)}
          className="items-center gap-3 px-8 py-6 rounded-lg bg-card shadow-raised shadow-shadowStrong"
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-base-lg font-semibold text-text text-center">
            {message ?? "Working…"}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}
