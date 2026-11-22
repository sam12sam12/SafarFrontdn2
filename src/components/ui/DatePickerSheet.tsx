import { useTranslation } from "react-i18next";
import { Calendar } from "react-native-calendars";
import { useCSSVariable } from "uniwind";

import { DEMO_TODAY } from "@/lib/dates";
import { BottomSheet } from "./BottomSheet";

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Currently selected day, ISO `YYYY-MM-DD`. */
  value: string;
  onChange: (dateISO: string) => void;
  title?: string;
  /** Earliest selectable day (ISO). Defaults to the demo "today". */
  minDate?: string;
};

/**
 * A calendar date picker rendered inline inside the shared BottomSheet.
 * Uses `react-native-calendars` (pure JS) and is themed entirely from design
 * tokens so it tracks light/dark like the rest of the app.
 */
export function DatePickerSheet({ visible, onClose, value, onChange, title, minDate }: Props) {
  const { t } = useTranslation();

  const [card, text, muted, primary, onPrimary, disable, border] = useCSSVariable([
    "--color-card",
    "--color-text",
    "--color-muted",
    "--color-primary",
    "--color-onPrimary",
    "--color-disable",
    "--color-border",
  ]) as string[];

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title ?? t("common.selectDate")}>
      <Calendar
        current={value || DEMO_TODAY}
        minDate={minDate ?? DEMO_TODAY}
        onDayPress={(day) => {
          onChange(day.dateString);
          onClose();
        }}
        markedDates={{
          [value]: { selected: true, selectedColor: primary, selectedTextColor: onPrimary },
        }}
        firstDay={6}
        enableSwipeMonths
        theme={{
          calendarBackground: card,
          monthTextColor: text,
          textMonthFontWeight: "700",
          textMonthFontSize: 16,
          arrowColor: primary,
          dayTextColor: text,
          textDayFontWeight: "600",
          todayTextColor: primary,
          textSectionTitleColor: muted,
          textDisabledColor: disable,
          selectedDayBackgroundColor: primary,
          selectedDayTextColor: onPrimary,
          textDayHeaderFontWeight: "700",
          textDayHeaderFontSize: 12,
          // @ts-expect-error — stylesheet override keys are untyped in the lib
          "stylesheet.calendar.header": {
            week: {
              marginTop: 4,
              marginBottom: 2,
              flexDirection: "row",
              justifyContent: "space-around",
              borderBottomWidth: 1,
              borderBottomColor: border,
              paddingBottom: 8,
            },
          },
        }}
        style={{ borderRadius: 12, paddingBottom: 6 }}
      />
    </BottomSheet>
  );
}
