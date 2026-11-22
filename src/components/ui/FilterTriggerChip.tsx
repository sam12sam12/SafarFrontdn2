import { Text } from "react-native";

import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";

type Props = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  /** Filled (primary) when a non-default value is applied; outline otherwise. */
  active?: boolean;
};

/**
 * A pill that opens a filter menu/sheet — label + trailing chevron. When a
 * non-default value is applied it reads as selected via a primary border and
 * soft tint (not a full fill), matching the Bazar56 chip style.
 */
export function FilterTriggerChip({ label, onPress, icon, active }: Props) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={label}
      className={cn(
        "flex-row items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5",
        active ? "border-primary bg-primarySoft" : "border-border bg-card",
      )}
    >
      {icon ? <Icon name={icon} size={14} color={active ? colors.primary : colors.secText} /> : null}
      <Text
        className={cn(
          "text-base-lg font-semibold whitespace-nowrap",
          active ? "text-primary" : "text-secText",
        )}
      >
        {label}
      </Text>
      <Icon name="expand-more" size={16} color={active ? colors.primary : colors.secText} />
    </Ripple>
  );
}
