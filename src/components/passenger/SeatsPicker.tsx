import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const MIN_SEATS = 1;
const MAX_SEATS = 4;

type Props = {
  visible: boolean;
  onClose: () => void;
  value: number;
  onChange: (value: number) => void;
};

function clamp(value: number) {
  if (Number.isNaN(value)) return MIN_SEATS;
  return Math.min(MAX_SEATS, Math.max(MIN_SEATS, value));
}

export function SeatsPicker({ visible, onClose, value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("home.seatsTitle")}>
      <View className="items-center gap-1 mb-4">
        <View className="flex-row items-center gap-4">
          <Ripple
            onPress={() => onChange(clamp(value - 1))}
            disabled={value <= MIN_SEATS}
            accessibilityLabel={t("common.removePassenger")}
            className={cn(
              "w-11 h-11 rounded-full items-center justify-center border border-border bg-elevated",
              value <= MIN_SEATS && "opacity-40",
            )}
          >
            <Icon name="remove" size={20} color={colors.text} />
          </Ripple>

          <TextInput
            value={String(value)}
            onChangeText={(text) => onChange(clamp(Number(text.replace(/[^0-9]/g, "")) || MIN_SEATS))}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            className="text-3xl font-bold text-text w-16"
            accessibilityLabel={t("home.seatsTitle")}
          />

          <Ripple
            onPress={() => onChange(clamp(value + 1))}
            disabled={value >= MAX_SEATS}
            accessibilityLabel={t("common.addPassenger")}
            className={cn(
              "w-11 h-11 rounded-full items-center justify-center bg-primary",
              value >= MAX_SEATS && "opacity-40",
            )}
          >
            <Icon name="add" size={20} color={colors.onPrimary} />
          </Ripple>
        </View>
        <Text className="text-sm text-secText mt-2">{t("home.seatsHint")}</Text>
      </View>

      <AppButton label={t("common.done")} onPress={onClose} />
    </BottomSheet>
  );
}
