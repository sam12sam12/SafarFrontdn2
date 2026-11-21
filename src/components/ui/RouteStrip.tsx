import { Text, View } from "react-native";

import { cn } from "@/utils/cn";

type Props = {
  fromCity: string;
  toCity: string;
  departTime: string;
  departPeriod: string;
  arriveTime: string;
  arrivePeriod: string;
  duration: string;
  className?: string;
};

export function RouteStrip({
  fromCity,
  toCity,
  departTime,
  departPeriod,
  arriveTime,
  arrivePeriod,
  duration,
  className,
}: Props) {
  return (
    <View
      className={cn(
        "flex-row items-center rounded-base bg-elevated border border-secBorder px-3 py-3",
        className,
      )}
    >
      <View className="flex-1">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-xl font-bold text-text">{departTime}</Text>
          <Text className="text-sm font-semibold text-secText">{departPeriod}</Text>
        </View>
        <Text className="text-sm font-semibold text-primary mt-0.5" numberOfLines={1}>
          {fromCity}
        </Text>
      </View>

      <View className="flex-1 items-center px-1">
        <Text className="text-xs text-muted mb-1">{duration}</Text>
        <View className="flex-row items-center w-full">
          <View className="w-1.5 h-1.5 rounded-full bg-primary" />
          <View className="flex-1 h-[2px] bg-primary/50" />
          <View className="w-1.5 h-1.5 rounded-full bg-primary" />
        </View>
      </View>

      <View className="flex-1 items-end">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-xl font-bold text-text">{arriveTime}</Text>
          <Text className="text-sm font-semibold text-secText">{arrivePeriod}</Text>
        </View>
        <Text className="text-sm font-semibold text-primary mt-0.5" numberOfLines={1}>
          {toCity}
        </Text>
      </View>
    </View>
  );
}
