import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Ripple } from "./Ripple";
import { Icon } from "./Icon";
import { colors } from "@/utils/theme";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  className?: string;
};

export function Stepper({ value, onChange, min = 1, max = 4, label, className }: Props) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View
      className={cn(
        "flex-row items-center justify-between rounded-base bg-elevated border border-border px-3 py-2.5",
        className,
      )}
    >
      <View className="flex-1">
        <Text className="text-base-lg font-semibold text-text">{value} Passenger{value > 1 ? "s" : ""}</Text>
        {label ? <Text className="text-sm text-secText mt-0.5">{label}</Text> : null}
      </View>
      <View className="flex-row items-center gap-2">
        <Ripple
          onPress={() => canDecrease && onChange(value - 1)}
          disabled={!canDecrease}
          accessibilityLabel="Remove a passenger"
          className={cn(
            "w-8 h-8 rounded-full items-center justify-center border border-border bg-card",
            !canDecrease && "opacity-40",
          )}
        >
          <Icon name="remove" size={16} color={colors.text} />
        </Ripple>
        <Text className="text-md font-bold text-text w-4 text-center">{value}</Text>
        <Ripple
          onPress={() => canIncrease && onChange(value + 1)}
          disabled={!canIncrease}
          accessibilityLabel="Add a passenger"
          className={cn(
            "w-8 h-8 rounded-full items-center justify-center bg-primary",
            !canIncrease && "opacity-40",
          )}
        >
          <Icon name="add" size={16} color={colors.onPrimary} />
        </Ripple>
      </View>
    </View>
  );
}
