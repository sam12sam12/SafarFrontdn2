import { View } from "react-native";

import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";

type Props = {
  icon: IconName;
  onPress?: () => void;
  accessibilityLabel: string;
  /** Shows a small unread dot on the top-right corner. */
  badge?: boolean;
  color?: string;
  size?: number;
  className?: string;
};

/**
 * A header action icon — a borderless 40×40 tap target. Header icons are never
 * wrapped in a bordered circle; the icon sits plainly in the bar.
 */
export function HeaderIcon({
  icon,
  onPress,
  accessibilityLabel,
  badge,
  color,
  size = 23,
  className,
}: Props) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      className={cn("w-10 h-10 rounded-full items-center justify-center", className)}
    >
      <Icon name={icon} size={size} color={color ?? colors.text} />
      {badge ? (
        <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error border border-card" />
      ) : null}
    </Ripple>
  );
}
