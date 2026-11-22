import { BottomSheetModal, BottomSheetView } from "@expo/ui/community/bottom-sheet";
import { useEffect, useRef, type ReactNode } from "react";
import { Dimensions, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Fixed snap points, e.g. ["40%", "80%"] — omit to size to content. */
  snapPoints?: (string | number)[];
};

const { width } = Dimensions.get("screen");

/**
 * The app's single bottom sheet, backed by the native Expo UI sheet
 * (`@expo/ui/community/bottom-sheet`) — the same primitive used in Bazar56.
 * The native sheet provides its own backdrop, pan-to-dismiss and drag grabber,
 * so we only render the title + content. Driven declaratively by `visible`.
 */
export function BottomSheet({ visible, onClose, title, children, snapPoints }: Props) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const [card] = useCSSVariable(["--color-card"]) as string[];

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backgroundStyle={{ backgroundColor: card }}
    >
      <BottomSheetView
        style={{
          width,
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <Text className="text-lg font-bold text-text mb-3">{title}</Text>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
