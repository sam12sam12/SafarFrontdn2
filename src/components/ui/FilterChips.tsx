import { ScrollView, Text } from "react-native";

import { cn } from "@/utils/cn";
import { Ripple } from "./Ripple";

type Props = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/** Figma uses a single dark "active" chip against white pills. */
export function FilterChips({ options, value, onChange, className }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={cn("gap-2 pr-4", className)}
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
              "rounded-full px-3.5 py-2 border",
              active ? "bg-text border-text" : "bg-card border-border",
            )}
          >
            <Text
              className={cn(
                "text-base-lg font-semibold whitespace-nowrap",
                active ? "text-onPrimary" : "text-secText",
              )}
            >
              {option.label}
            </Text>
          </Ripple>
        );
      })}
    </ScrollView>
  );
}
