import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";
import { colors } from "@/utils/theme";

type DetailRowProps = {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "muted";
  className?: string;
  valueClassName?: string;
};

export function DetailRow({ label, value, tone = "default", className, valueClassName }: DetailRowProps) {
  return (
    <View className={cn("flex-row items-center justify-between gap-4 py-2", className)}>
      <Text className="text-base text-secText flex-1" numberOfLines={2}>
        {label}
      </Text>
      <Text
        className={cn(
          "text-base-lg font-semibold text-right",
          tone === "success"
            ? "text-success"
            : tone === "warning"
              ? "text-warning"
              : tone === "muted"
                ? "text-muted"
                : "text-text",
          valueClassName,
        )}
      >
        {value}
      </Text>
    </View>
  );
}

type NavRowProps = {
  title: string;
  subtitle?: string;
  icon?: IconName;
  onPress?: () => void;
  right?: ReactNode;
  danger?: boolean;
  className?: string;
};

export function NavRow({
  title,
  subtitle,
  icon,
  onPress,
  right,
  danger,
  className,
}: NavRowProps) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={title}
      className={cn("flex-row items-center gap-3 py-3.5", className)}
    >
      {icon ? (
        <View className="w-9 h-9 rounded-base bg-primarySoft items-center justify-center">
          <Icon name={icon} size={18} color={danger ? colors.error : colors.primary} />
        </View>
      ) : null}
      <View className="flex-1">
        <Text className={cn("text-base-lg font-semibold", danger ? "text-error" : "text-text")}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-base text-secText mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? <Icon name="chevron-right" size={20} color={colors.muted} />}
    </Ripple>
  );
}
