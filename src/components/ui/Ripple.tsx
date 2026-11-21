import type { ReactNode } from "react";
import {
  type AccessibilityState,
  type GestureResponderEvent,
  Pressable,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useCSSVariable } from "uniwind";

import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: "button" | "link" | "radio" | "tab";
  accessibilityState?: AccessibilityState;
  style?: StyleProp<ViewStyle>;
};

/** One pressable shell for the whole app: native ripple on Android, a
 * pressed-state opacity everywhere else. */
export function Ripple({
  children,
  className,
  onPress,
  onLongPress,
  disabled,
  accessibilityLabel,
  accessibilityRole = "button",
  accessibilityState,
  style,
}: Props) {
  const disable = useCSSVariable("--color-disable") as string;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      android_ripple={disabled ? undefined : { color: disable, foreground: true }}
      style={({ pressed }) => [style, pressed && !disabled ? { opacity: 0.82 } : undefined]}
      className={cn("overflow-hidden", className)}
    >
      {children}
    </Pressable>
  );
}
