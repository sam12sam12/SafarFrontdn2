import { Text, View } from "react-native";

import { cn } from "@/utils/cn";

type SegmentsProps = {
  total: number;
  filled: number;
  tone?: "blue" | "teal" | "amber";
  className?: string;
};

const TONE = {
  blue: "bg-primary",
  teal: "bg-teal",
  amber: "bg-warning",
} as const;

/** The 4-segment bar used on every trip row in the Figma owner/driver apps. */
export function SeatProgress({ total, filled, tone = "blue", className }: SegmentsProps) {
  return (
    <View className={cn("flex-row gap-1", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            index < filled ? TONE[tone] : "bg-disable",
          )}
        />
      ))}
    </View>
  );
}

type TrackProps = {
  value: number;
  className?: string;
  showDot?: boolean;
  tone?: "blue" | "teal" | "amber";
  height?: "thin" | "base";
};

export function ProgressTrack({
  value,
  className,
  showDot,
  tone = "blue",
  height = "thin",
}: TrackProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View className={cn("relative justify-center", className)}>
      <View
        className={cn("w-full rounded-full bg-disable", height === "thin" ? "h-1.5" : "h-2.5")}
      >
        <View
          className={cn("rounded-full", TONE[tone], height === "thin" ? "h-1.5" : "h-2.5")}
          style={{ width: `${clamped}%` }}
        />
      </View>
      {showDot && clamped > 0 && clamped < 100 && (
        <View
          className="absolute w-3.5 h-3.5 rounded-full bg-primary border-2 border-card"
          style={{ left: `${clamped}%`, marginLeft: -7 }}
        />
      )}
    </View>
  );
}

type SplitProps = {
  pct: number;
  tone?: "blue" | "teal" | "amber" | "success";
  className?: string;
};

export function SplitBar({ pct, tone = "blue", className }: SplitProps) {
  return (
    <View className={cn("h-2 w-full rounded-full bg-disable overflow-hidden", className)}>
      <View
        className={cn(
          "h-2 rounded-full",
          tone === "teal"
            ? "bg-teal"
            : tone === "amber"
              ? "bg-warning"
              : tone === "success"
                ? "bg-success"
                : "bg-primary",
        )}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </View>
  );
}

type BarChartProps = {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  caption?: string;
};

/** Simple token-styled bar chart — the Figma dashboards only ever show a
 * handful of bars, so four Views beat pulling in a chart library. */
export function BarChart({ data, height = 130, className, caption }: BarChartProps) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <View className={className}>
      <View className="flex-row items-end justify-between gap-3" style={{ height }}>
        {data.map((item) => {
          const barHeight = Math.max(4, Math.round((item.value / max) * height));
          return (
            <View key={item.label} className="flex-1 items-center justify-end">
              <View
                className={cn(
                  "w-full max-w-[46px] rounded-t-md",
                  item.value === 0 ? "bg-disable" : "bg-primary",
                )}
                style={{ height: barHeight }}
              />
            </View>
          );
        })}
      </View>
      <View className="flex-row items-center justify-between gap-3 mt-2">
        {data.map((item) => (
          <Text key={item.label} className="flex-1 text-center text-sm text-secText">
            {item.label}
          </Text>
        ))}
      </View>
      {caption ? (
        <Text className="text-sm text-secText text-center mt-2">{caption}</Text>
      ) : null}
    </View>
  );
}
