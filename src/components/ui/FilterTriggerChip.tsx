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

/** A pill that opens a filter menu/sheet — label + trailing chevron. */
export function FilterTriggerChip({ label, onPress, icon, active }: Props) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={label}
      className={cn(
        "flex-row items-center gap-1.5 rounded-full border px-3.5 py-2",
        active ? "bg-primary border-primary" : "bg-card border-border",
      )}
    >
      {icon ? <Icon name={icon} size={14} color={active ? colors.onPrimary : colors.secText} /> : null}
      <Text
        className={cn(
          "text-base-lg font-semibold whitespace-nowrap",
          active ? "text-onPrimary" : "text-secText",
        )}
      >
        {label}
      </Text>
      <Icon name="expand-more" size={16} color={active ? colors.onPrimary : colors.secText} />
    </Ripple>
  );
}
