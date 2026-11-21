import { View } from "react-native";
import { useCSSVariable } from "uniwind";

import { cn } from "@/utils/cn";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";

type Variant = "soft" | "white" | "primary" | "outline";
type Size = "sm" | "md" | "lg";

type Props = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: Variant;
  size?: Size;
  iconSize?: number;
  className?: string;
};

const SHELL: Record<Variant, string> = {
  soft: "bg-primarySoft",
  white: "bg-card border border-border",
  primary: "bg-primary",
  outline: "bg-transparent border border-border",
};

const SIZE: Record<Size, { box: string; icon: number }> = {
  sm: { box: "w-9 h-9", icon: 18 },
  md: { box: "w-10 h-10", icon: 20 },
  lg: { box: "w-12 h-12", icon: 22 },
};

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = "soft",
  size = "md",
  iconSize,
  className,
}: Props) {
  const [primary, onPrimary, text, secText] = useCSSVariable([
    "--color-primary",
    "--color-onPrimary",
    "--color-text",
    "--color-secText",
  ]) as string[];

  const color =
    variant === "primary" ? onPrimary : variant === "soft" ? primary : secText;

  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      className={cn(
        "rounded-full items-center justify-center",
        SHELL[variant],
        SIZE[size].box,
        className,
      )}
    >
      <View className="items-center justify-center">
        <Icon name={icon} size={iconSize ?? SIZE[size].icon} color={color || text} />
      </View>
    </Ripple>
  );
}
