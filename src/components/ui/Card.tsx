import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  /** flat cards sit directly on the light background without a shadow */
  flat?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, className, flat, style }: Props) {
  return (
    <View
      style={style}
      className={cn(
        "bg-card rounded-lg border border-border p-4",
        !flat && "shadow-sm shadow-shadowColor",
        className,
      )}
    >
      {children}
    </View>
  );
}
