import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Ripple } from "./Ripple";

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
};

/** Page section: a prominent title with an optional trailing action. */
export function Section({ title, action, onAction, children, className }: Props) {
  return (
    <View className={cn("mt-6", className)}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-xl font-bold text-text" numberOfLines={1}>
            {title}
          </Text>
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
