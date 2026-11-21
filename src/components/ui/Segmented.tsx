import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Ripple } from "./Ripple";

export type SegmentOption<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  compact?: boolean;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  compact,
}: Props<T>) {
  return (
    <View
      className={cn(
        "flex-row items-center bg-disable rounded-full p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Ripple
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            className={cn(
              "flex-1 rounded-full items-center justify-center",
              compact ? "py-1.5" : "py-2.5",
              active && "bg-card shadow-sm shadow-shadowColor",
            )}
          >
            <Text
              className={cn(
                "font-semibold",
                compact ? "text-sm" : "text-base-lg",
                active ? "text-text" : "text-secText",
              )}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Ripple>
        );
      })}
    </View>
  );
}
