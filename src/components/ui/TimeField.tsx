import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Icon } from "./Icon";
import { Ripple } from "./Ripple";

export type Period = "AM" | "PM";

type Props = {
  /** Typed time, e.g. "10" or "06:30". */
  value: string;
  period: Period;
  onChangeValue: (value: string) => void;
  onChangePeriod: (period: Period) => void;
  label?: string;
  className?: string;
};

/** Keep only digits and a single colon, cap at HH:MM. */
function sanitize(input: string) {
  const cleaned = input.replace(/[^0-9:]/g, "");
  const [h, m] = cleaned.split(":");
  if (m === undefined) return h.slice(0, 2);
  return `${h.slice(0, 2)}:${m.slice(0, 2)}`;
}

/**
 * A time entry field: a free numeric input ("10", "06:30") with an AM / PM
 * segmented toggle beside it. Purely controlled — the parent owns the value.
 */
export function TimeField({
  value,
  period,
  onChangeValue,
  onChangePeriod,
  label,
  className,
}: Props) {
  const { t } = useTranslation();

  return (
    <View className={className}>
      {label ? (
        <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted mb-1.5">
          {label}
        </Text>
      ) : null}
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center gap-2 rounded-base bg-elevated border border-secBorder px-3 py-2.5">
          <Icon name="schedule" size={16} color={colors.secText} />
          <TextInput
            value={value}
            onChangeText={(text) => onChangeValue(sanitize(text))}
            keyboardType="number-pad"
            placeholder="10:00"
            placeholderTextColor={colors.placeholder}
            maxLength={5}
            className="flex-1 text-base-lg font-semibold text-text"
            accessibilityLabel={t("common.selectTime")}
          />
        </View>

        <View className="flex-row rounded-base bg-elevated border border-secBorder p-1">
          {(["AM", "PM"] as Period[]).map((item) => {
            const active = period === item;
            return (
              <Ripple
                key={item}
                onPress={() => onChangePeriod(item)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={item}
                className={cn(
                  "px-3.5 py-1.5 rounded-sm",
                  active ? "bg-primary" : "bg-transparent",
                )}
              >
                <Text
                  className={cn(
                    "text-base-lg font-bold",
                    active ? "text-onPrimary" : "text-secText",
                  )}
                >
                  {item}
                </Text>
              </Ripple>
            );
          })}
        </View>
      </View>
    </View>
  );
}
