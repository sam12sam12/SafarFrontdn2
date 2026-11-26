import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Icon } from "./Icon";

type Props = {
  fromCity: string;
  toCity: string;
  departTime: string;
  departPeriod: string;
  arriveTime: string;
  arrivePeriod: string;
  duration: string;
  /** When set, shown under the connector line with a small date icon. */
  dateText?: string;
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
  dateText,
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
        {/* origin city + direction arrow — "Kandahar →" (flips in RTL) */}
        <View className="flex-row items-center gap-1 mt-0.5">
          <Text className="text-sm font-bold text-primary shrink" numberOfLines={1}>
            {fromCity}
          </Text>
          <Icon name="arrow-forward" size={12} color={colors.primary} />
        </View>
      </View>

      <View className="flex-1 items-center px-1">
        <Text className="text-xs text-muted mb-1">{duration}</Text>
        <View className="flex-row items-center w-full">
          <View className="w-1.5 h-1.5 rounded-full bg-primary" />
          <View className="flex-1 h-[2px] bg-primary/50" />
          <View className="w-6 h-6 rounded-full bg-card border border-primaryBorder items-center justify-center -mx-0.5">
            <Icon name="directions-car" size={13} color={colors.primary} />
          </View>
          <View className="flex-1 h-[2px] bg-primary/50" />
          <View className="w-1.5 h-1.5 rounded-full bg-primary" />
        </View>
        {dateText ? (
          <View className="flex-row items-center gap-1 mt-1.5">
            <Icon name="event" size={11} color={colors.muted} />
            <Text className="text-2xs font-semibold text-muted" numberOfLines={1}>
              {dateText}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="flex-1 items-end">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-xl font-bold text-text">{arriveTime}</Text>
          <Text className="text-sm font-semibold text-secText">{arrivePeriod}</Text>
        </View>
        <Text className="text-sm font-bold text-text mt-0.5" numberOfLines={1}>
          {toCity}
        </Text>
      </View>
    </View>
  );
}
