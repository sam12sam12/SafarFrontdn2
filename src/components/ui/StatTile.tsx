import { Text, View } from "react-native";

import { cn } from "@/utils/cn";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  unit?: string;
  className?: string;
  tone?: "default" | "success";
};

export function StatTile({ label, value, hint, unit, className, tone = "default" }: Props) {
  return (
    <View className={cn("rounded-base bg-card border border-border p-3.5", className)}>
      <Text className="text-xs font-bold tracking-[1.1px] uppercase text-muted" numberOfLines={1}>
        {label}
      </Text>
      <View className="flex-row items-baseline gap-1 mt-1">
        <Text
          className={cn(
            "text-2xl font-bold",
            tone === "success" ? "text-success" : "text-text",
          )}
        >
          {value}
        </Text>
        {unit ? <Text className="text-sm font-semibold text-secText">{unit}</Text> : null}
      </View>
      {hint ? <Text className="text-sm text-secText mt-0.5">{hint}</Text> : null}
    </View>
  );
}
