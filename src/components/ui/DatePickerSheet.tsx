import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { colors } from "@/utils/theme";
import { BottomSheet } from "./BottomSheet";
import { CalendarMonth } from "./CalendarMonth";
import { Icon } from "./Icon";
import { Ripple } from "./Ripple";

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Currently selected day, ISO `YYYY-MM-DD`. */
  value: string;
  onChange: (dateISO: string) => void;
  title?: string;
  /** When provided, shows an "Any day" reset row above the calendar. */
  onClear?: () => void;
  clearLabel?: string;
};

/**
 * Date picker sheet — the shared BottomSheet wrapping the custom tri-lingual
 * {@link CalendarMonth}. Current month only, no past days.
 */
export function DatePickerSheet({
  visible,
  onClose,
  value,
  onChange,
  title,
  onClear,
  clearLabel,
}: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title ?? t("common.selectDate")}>
      {onClear ? (
        <Ripple
          onPress={() => {
            onClear();
            onClose();
          }}
          accessibilityLabel={clearLabel ?? t("common.reset")}
          className="flex-row items-center gap-2 rounded-base border border-border bg-card px-4 py-3 mb-3"
        >
          <Icon name="event-busy" size={18} color={colors.secText} />
          <Text className="flex-1 text-base-lg font-semibold text-text">
            {clearLabel ?? t("common.reset")}
          </Text>
        </Ripple>
      ) : null}
      <CalendarMonth
        value={value}
        onSelect={(iso) => {
          onChange(iso);
          onClose();
        }}
      />
    </BottomSheet>
  );
}
