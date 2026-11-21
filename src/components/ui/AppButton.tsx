import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { cn } from "@/utils/cn";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";
import { colors } from "@/utils/theme";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost" | "dark";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  compact?: boolean;
};

const SHELL: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-card border border-border",
  outline: "bg-transparent border border-primaryBorder",
  danger: "bg-transparent border border-error/40",
  ghost: "bg-primarySoft",
  dark: "bg-text",
};

const TEXT: Record<Variant, string> = {
  primary: "text-onPrimary",
  secondary: "text-text",
  outline: "text-primary",
  danger: "text-error",
  ghost: "text-primary",
  dark: "text-onPrimary",
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  icon,
  iconPosition = "right",
  loading,
  disabled,
  className,
  textClassName,
  compact,
}: Props) {
  const [primaryLight, primary, onPrimary, primarySoft] = useCSSVariable([
    "--color-primaryLight",
    "--color-primary",
    "--color-onPrimary",
    "--color-primarySoft",
  ]) as string[];

  const iconColor =
    variant === "primary" || variant === "dark"
      ? onPrimary
      : variant === "danger"
        ? colors.error
        : primary;

  const content = (
    <View
      className={cn(
        "flex-row items-center justify-center gap-2",
        compact ? "px-4 py-2.5" : "px-5 py-3.5",
      )}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Icon name={icon} size={compact ? 16 : 18} color={iconColor} />
          )}
          <Text
            className={cn(
              "font-bold",
              compact ? "text-base-lg" : "text-md",
              TEXT[variant],
              textClassName,
            )}
          >
            {label}
          </Text>
          {icon && iconPosition === "right" && (
            <Icon name={icon} size={compact ? 16 : 18} color={iconColor} />
          )}
        </>
      )}
    </View>
  );

  return (
    <Ripple
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={label}
      className={cn(
        "rounded-base",
        SHELL[variant],
        variant === "primary" && "shadow-button shadow-buttonShadow",
        disabled && "opacity-50",
        className,
      )}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[primaryLight, primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 13, backgroundColor: primarySoft }}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Ripple>
  );
}
