import { Pressable, View } from "react-native";

import { cn } from "@/utils/cn";

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function Toggle({ value, onChange, disabled, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      className="py-1"
    >
      <View
        className={cn(
          "w-12 h-7 rounded-full px-0.5 justify-center",
          value ? "bg-primary" : "bg-disable",
          disabled && "opacity-50",
        )}
      >
        <View
          className={cn(
            "w-6 h-6 rounded-full bg-card shadow-sm shadow-shadowColor",
            value ? "self-end" : "self-start",
          )}
        />
      </View>
    </Pressable>
  );
}
