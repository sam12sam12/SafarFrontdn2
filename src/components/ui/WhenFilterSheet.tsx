import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { colors } from "@/utils/theme";
import { AppButton } from "./AppButton";
import { BottomSheet } from "./BottomSheet";
import { CalendarMonth } from "./CalendarMonth";
import { Icon } from "./Icon";
import { Ripple } from "./Ripple";
import { TimeField, type Period } from "./TimeField";

export type TimeValue = { time: string; period: Period } | null;
export type WhenValue = { date: string | null; time: TimeValue };

type Props = {
  visible: boolean;
  onClose: () => void;
  value: WhenValue;
  onApply: (value: WhenValue) => void;
};

/**
 * One combined "when" filter: a calendar (today / future, current month) on top
 * and a "depart after" time field below, committed together on Apply. Replaces
 * the two separate date and time filters.
 */
export function WhenFilterSheet({ visible, onClose, value, onApply }: Props) {
  const { t } = useTranslation();

  const [draftDate, setDraftDate] = useState<string | null>(value.date);
  const [timeOn, setTimeOn] = useState<boolean>(value.time !== null);
  const [time, setTime] = useState(value.time?.time ?? "06:00");
  const [period, setPeriod] = useState<Period>(value.time?.period ?? "AM");

  // Re-seed the draft from the committed value each time the sheet opens — the
  // render-time reset React recommends over an effect.
  const [wasOpen, setWasOpen] = useState(false);
  if (visible && !wasOpen) {
    setWasOpen(true);
    setDraftDate(value.date);
    setTimeOn(value.time !== null);
    setTime(value.time?.time ?? "06:00");
    setPeriod(value.time?.period ?? "AM");
  } else if (!visible && wasOpen) {
    setWasOpen(false);
  }

  const dirty = draftDate !== null || timeOn;

  const apply = () => {
    onApply({ date: draftDate, time: timeOn ? { time: time || "06:00", period } : null });
    onClose();
  };

  const clearAll = () => {
    onApply({ date: null, time: null });
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("home.whenTitle")}>
      {/* Date */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted">
          {t("home.dateTitle")}
        </Text>
        {draftDate ? (
          <Ripple
            onPress={() => setDraftDate(null)}
            accessibilityLabel={t("home.anyDate")}
            className="flex-row items-center gap-1 rounded-full bg-disable px-2.5 py-1"
          >
            <Icon name="close" size={12} color={colors.secText} />
            <Text className="text-2xs font-semibold text-secText">{t("home.anyDate")}</Text>
          </Ripple>
        ) : null}
      </View>
      <CalendarMonth value={draftDate ?? ""} onSelect={setDraftDate} />

      <View className="h-px bg-border my-3" />

      {/* Time */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted">
          {t("home.timeTitle")}
        </Text>
        {timeOn ? (
          <Ripple
            onPress={() => setTimeOn(false)}
            accessibilityLabel={t("home.anyTime")}
            className="flex-row items-center gap-1 rounded-full bg-disable px-2.5 py-1"
          >
            <Icon name="close" size={12} color={colors.secText} />
            <Text className="text-2xs font-semibold text-secText">{t("home.anyTime")}</Text>
          </Ripple>
        ) : null}
      </View>
      {timeOn ? (
        <TimeField
          value={time}
          period={period}
          onChangeValue={setTime}
          onChangePeriod={setPeriod}
        />
      ) : (
        <Ripple
          onPress={() => setTimeOn(true)}
          accessibilityLabel={t("home.timeTitle")}
          className="flex-row items-center gap-2 rounded-base border border-dashed border-border bg-card px-3 py-3"
        >
          <Icon name="schedule" size={16} color={colors.secText} />
          <Text className="flex-1 text-base-lg font-semibold text-secText">{t("home.anyTime")}</Text>
          <Icon name="add" size={16} color={colors.primary} />
        </Ripple>
      )}

      <AppButton label={t("common.apply")} icon="check" iconPosition="left" className="mt-4" onPress={apply} />

      {dirty ? (
        <Ripple
          onPress={clearAll}
          accessibilityLabel={t("common.clearFilter")}
          className="flex-row items-center justify-center gap-2 py-3 mt-1"
        >
          <Icon name="restart-alt" size={16} color={colors.error} />
          <Text className="text-base-lg font-semibold text-error">{t("common.clearFilter")}</Text>
        </Ripple>
      ) : null}
    </BottomSheet>
  );
}

/** Convert a 12-hour {time, period} into minutes-from-midnight for comparison. */
export function timeValueToMinutes(value: TimeValue): number | null {
  if (!value) return null;
  const [rawH, rawM] = value.time.split(":");
  let hour = Number(rawH) % 12;
  if (value.period === "PM") hour += 12;
  const minutes = Number(rawM ?? 0) || 0;
  return hour * 60 + minutes;
}
