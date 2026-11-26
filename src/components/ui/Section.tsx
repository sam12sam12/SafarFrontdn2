import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Ripple } from "./Ripple";

type Props = {
  title: string;
  /** Small pill next to the title, e.g. how many items the section holds. */
  count?: number;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
};

/** Page section: a prominent title with optional count + trailing action. */
export function Section({ title, count, action, onAction, children, className }: Props) {
  return (
    <View className={cn("mt-6", className)}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-xl font-bold text-text" numberOfLines={1}>
            {title}
          </Text>
          {typeof count === "number" ? (
            <View className="rounded-full bg-primarySoft px-2 py-0.5">
              <Text className="text-xs font-bold text-primary">{count}</Text>
            </View>
          ) : null}
        </View>
        {action ? (
          <Ripple onPress={onAction} accessibilityLabel={action} className="px-2 py-1 -mr-2">
            <Text className="text-base-lg font-semibold text-primary">{action}</Text>
          </Ripple>
        ) : null}
      </View>
      {children ? <View className="mt-3 gap-3">{children}</View> : null}
    </View>
  );
}
