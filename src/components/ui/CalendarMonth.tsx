import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import {
  DEMO_TODAY,
  formatMonthYear,
  isPastDay,
  isSameDay,
  isToday,
  localizeNumber,
  monthGrid,
  weekdayInitials,
} from "@/lib/dates";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { Ripple } from "./Ripple";

type Props = {
  /** Currently selected day, ISO `YYYY-MM-DD`. */
  value: string;
  onSelect: (dateISO: string) => void;
  /** The month to render is taken from this anchor (defaults to "today"). */
  anchorISO?: string;
};

/**
 * A fully custom, tri-lingual month grid (English / Dari / Pashto) built on the
 * app's own dayjs date helpers — no third-party calendar. It shows a single
 * month, Saturday-first, with past days disabled: a passenger or agent can only
 * pick today or a later day in the current month, never the past.
 */
export function CalendarMonth({ value, onSelect, anchorISO = DEMO_TODAY }: Props) {
  const { i18n } = useTranslation();
  const lng = i18n.language;

  const cells = useMemo(() => monthGrid(anchorISO), [anchorISO]);
  const initials = useMemo(() => weekdayInitials(lng), [lng]);

  return (
    <View>
      <View className="flex-row items-center justify-center gap-2 mb-3">
        <Icon name="calendar-today" size={16} color="#1D4ED8" />
        <Text className="text-base-lg font-bold text-text">{formatMonthYear(anchorISO, lng)}</Text>
      </View>

      <View className="flex-row border-b border-border pb-2 mb-1">
        {initials.map((name, index) => (
          <View key={index} className="flex-1 items-center">
            <Text className="text-2xs font-bold uppercase text-muted">{name}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((iso, index) => {
          if (!iso) return <View key={`blank-${index}`} style={{ width: `${100 / 7}%` }} className="h-11" />;

          const selected = Boolean(value) && isSameDay(iso, value);
          const past = isPastDay(iso);
          const today = isToday(iso);

          return (
            <View key={iso} style={{ width: `${100 / 7}%` }} className="h-11 items-center justify-center">
              <Ripple
                onPress={() => !past && onSelect(iso)}
                disabled={past}
                accessibilityLabel={iso}
                accessibilityState={{ selected, disabled: past }}
                className={cn(
                  "w-9 h-9 rounded-full items-center justify-center",
                  selected && "bg-primary",
                  !selected && today && "border border-primaryBorder",
                )}
              >
                <Text
                  className={cn(
                    "text-base-lg font-semibold",
                    selected ? "text-onPrimary" : past ? "text-disable" : today ? "text-primary" : "text-text",
                  )}
                >
                  {localizeNumber(Number(iso.slice(8, 10)), lng)}
                </Text>
              </Ripple>
            </View>
          );
        })}
      </View>
    </View>
  );
}
