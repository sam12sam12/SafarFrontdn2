import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Icon } from "../ui/Icon";
import { colors } from "@/utils/theme";

type Stop = {
  city: string;
  time: string;
  state: "done" | "passed" | "active" | "upcoming";
  note?: string;
};

type Props = {
  stops: Stop[];
  className?: string;
};

export function RouteTimeline({ stops, className }: Props) {
  const { t } = useTranslation();
  const lastIndex = Math.max(stops.length - 1, 1);
  const activeIndex = Math.max(
    stops.findIndex((stop) => stop.state === "active"),
    0,
  );
  const cell = 100 / stops.length;
  const offset = cell / 2;
  const trackWidth = 100 - offset * 2;
  const progress = (activeIndex / lastIndex) * trackWidth;

  return (
    <View className={cn("mt-1", className)}>
      <View className="flex-row items-start relative">
        <View
          className="absolute h-[2px] bg-primaryBorder"
          style={{ left: `${offset}%`, right: `${offset}%`, top: 18 }}
        />
        <View
          className="absolute h-[2px] bg-primary"
          style={{ left: `${offset}%`, width: `${progress}%`, top: 18 }}
        />

        {stops.map((stop) => {
          const active = stop.state === "active";
          const done = stop.state === "done";
          const passed = stop.state === "passed";

          return (
            <View key={stop.city} className="flex-1 items-center">
              <View className="w-9 h-9 items-center justify-center">
                {passed ? (
                  <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                ) : (
                  <View
                    className={cn(
                      "w-9 h-9 rounded-full items-center justify-center border",
                      active
                        ? "bg-primary border-primary shadow-button shadow-buttonShadow"
                        : done
                          ? "bg-primarySoft border-primaryBorder"
                          : "bg-card border-border",
                    )}
                  >
                    {active ? (
                      <Icon name="directions-car" size={16} color={colors.onPrimary} />
                    ) : done ? (
                      <Icon name="check" size={15} color={colors.primary} />
                    ) : (
                      <Icon name="location-on" size={15} color={colors.muted} />
                    )}
                  </View>
                )}
              </View>

              <Text
                className={cn(
                  "text-sm font-bold mt-1",
                  active ? "text-primary" : done || passed ? "text-text" : "text-muted",
                )}
                numberOfLines={1}
              >
                {stop.city}
              </Text>

              {active && stop.note ? (
                <View className="mt-1 rounded-full bg-primarySoft px-2 py-0.5">
                  <Text className="text-2xs font-bold text-primary text-center" numberOfLines={1}>
                    {stop.note}
                  </Text>
                </View>
              ) : (
                <Text
                  className={cn(
                    "text-2xs mt-1",
                    passed ? "text-muted" : "text-secText",
                  )}
                  numberOfLines={1}
                >
                  {passed ? t("common.passed") : stop.time}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
