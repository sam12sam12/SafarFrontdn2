import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Ripple } from "./Ripple";

type Props = {
  title?: string;
  eyebrow?: string;
  action?: string;
  onAction?: () => void;
  className?: string;
  titleClassName?: string;
};

export function SectionHeader({
  title,
  eyebrow,
  action,
  onAction,
  className,
  titleClassName,
}: Props) {
  return (
    <View className={cn("flex-row items-end justify-between", className)}>
      <View className="flex-1">
        {eyebrow ? (
          <Text className="text-xs font-bold tracking-[1.4px] uppercase text-muted mb-1">
            {eyebrow}
          </Text>
        ) : null}
        {title ? (
          <Text className={cn("text-lg font-bold text-text", titleClassName)}>{title}</Text>
        ) : null}
      </View>
      {action ? (
        <Ripple onPress={onAction} accessibilityLabel={action} className="px-2 py-1 -mr-2">
          <Text className="text-base-lg font-semibold text-primary">{action}</Text>
        </Ripple>
      ) : null}
    </View>
  );
}
