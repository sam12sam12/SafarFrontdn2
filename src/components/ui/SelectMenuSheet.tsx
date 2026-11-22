import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { BottomSheet } from "./BottomSheet";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
};

type Props<T extends string> = {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: SelectOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  /** When passed, a "Clear filter" row appears while a non-default value is
   * chosen. Resets to this value. */
  clearTo?: T;
};

/** A single-select bottom-sheet menu — the app's one list-picker pattern. */
export function SelectMenuSheet<T extends string>({
  visible,
  onClose,
  title,
  options,
  value,
  onSelect,
  clearTo,
}: Props<T>) {
  const { t } = useTranslation();
  const canClear = clearTo !== undefined && value !== clearTo;

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View className="gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Ripple
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              accessibilityLabel={option.label}
              accessibilityState={{ selected: active }}
              className={cn(
                "flex-row items-center gap-3 rounded-base border-2 px-4 py-3",
                active ? "border-primary bg-primarySoft" : "border-border bg-card",
              )}
            >
              {option.icon ? (
                <View className="w-9 h-9 rounded-full bg-disable items-center justify-center">
                  <Icon name={option.icon} size={18} color={active ? colors.primary : colors.secText} />
                </View>
              ) : null}
              <Text className={cn("flex-1 text-base-lg font-semibold", active ? "text-primary" : "text-text")}>
                {option.label}
              </Text>
              <Icon
                name={active ? "check-circle" : "radio-button-unchecked"}
                size={20}
                color={active ? colors.primary : colors.slate}
              />
            </Ripple>
          );
        })}

        {canClear ? (
          <Ripple
            onPress={() => {
              onSelect(clearTo);
              onClose();
            }}
            accessibilityLabel={t("common.clearFilter")}
            className="flex-row items-center justify-center gap-2 py-3 mt-1"
          >
            <Icon name="restart-alt" size={16} color={colors.error} />
            <Text className="text-base-lg font-semibold text-error">{t("common.clearFilter")}</Text>
          </Ripple>
        ) : null}
      </View>
    </BottomSheet>
  );
}
