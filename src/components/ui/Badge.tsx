import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Icon, type IconName } from "./Icon";
import { colors } from "@/utils/theme";

export type BadgeTone = "blue" | "teal" | "green" | "amber" | "red" | "slate" | "violet" | "dark";

type Props = {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
  solid?: boolean;
  className?: string;
  compact?: boolean;
};

const SOFT: Record<BadgeTone, string> = {
  blue: "bg-primarySoft",
  teal: "bg-tealSoft",
  green: "bg-successSoft",
  amber: "bg-warningSoft",
  red: "bg-errorSoft",
  slate: "bg-disable",
  violet: "bg-violetSoft",
  dark: "bg-text",
};

const TEXT: Record<BadgeTone, string> = {
  blue: "text-primary",
  teal: "text-teal",
  green: "text-success",
  amber: "text-warning",
  red: "text-error",
  slate: "text-secText",
  violet: "text-violet",
  dark: "text-onPrimary",
};

const SOLID: Record<BadgeTone, string> = {
  blue: "bg-primary",
  teal: "bg-teal",
  green: "bg-success",
  amber: "bg-warning",
  red: "bg-error",
  slate: "bg-secText",
  violet: "bg-violet",
  dark: "bg-text",
};

const ICON: Record<BadgeTone, string> = {
  blue: colors.primary,
  teal: colors.teal,
  green: colors.success,
  amber: colors.warning,
  red: colors.error,
  slate: colors.secText,
  violet: colors.violet,
  dark: colors.onPrimary,
};

export function Badge({ label, tone = "slate", icon, solid, className, compact }: Props) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-1 rounded-full self-start",
        compact ? "px-2 py-0.5" : "px-2.5 py-1",
        solid ? SOLID[tone] : SOFT[tone],
        className,
      )}
    >
      {icon && (
        <Icon name={icon} size={compact ? 10 : 12} color={solid ? colors.onPrimary : ICON[tone]} />
      )}
      <Text
        className={cn(
          "font-semibold",
          compact ? "text-2xs" : "text-sm",
          solid ? "text-onPrimary" : TEXT[tone],
        )}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}
