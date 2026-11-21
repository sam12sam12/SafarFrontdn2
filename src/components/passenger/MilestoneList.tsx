import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Badge } from "../ui/Badge";
import { Icon, type IconName } from "../ui/Icon";
import { colors } from "@/utils/theme";

type Milestone = {
  title: string;
  detail: string;
  time: string;
  state: "done" | "active" | "upcoming";
  icon?: IconName;
};

type Props = {
  items: Milestone[];
  className?: string;
};

export function MilestoneList({ items, className }: Props) {
  const { t } = useTranslation();

  return (
    <View className={cn("relative", className)}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <View key={item.title} className="flex-row gap-3">
            <View className="items-center w-6">
              <View
                className={cn(
                  "w-8 h-8 -mt-1 rounded-full items-center justify-center",
                  item.state === "active" ? "bg-primarySoft" : "bg-transparent",
                )}
              >
                <View
                  className={cn(
                    "w-6 h-6 rounded-full items-center justify-center border",
                    item.state === "done"
                      ? "bg-primary border-primary"
                      : item.state === "active"
                        ? "bg-primary border-primary"
                        : "bg-elevated border-border",
                  )}
                >
                  {item.state === "done" ? (
                    <Icon name="check" size={13} color={colors.onPrimary} />
                  ) : item.state === "active" ? (
                    <Text className="text-2xs font-bold text-onPrimary">!!</Text>
                  ) : (
                    <Icon name="location-on" size={13} color={colors.muted} />
                  )}
                </View>
              </View>
              {!last ? (
                <View
                  className={cn(
                    "w-[2px] flex-1 my-1",
                    item.state === "done" ? "bg-primaryBorder" : "bg-border",
                  )}
                />
              ) : null}
            </View>

            <View className={cn("flex-1", last ? "pb-0" : "pb-4")}>
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-row items-center gap-1.5 flex-1">
                  <Text
                    className={cn(
                      "text-base-lg font-semibold",
                      item.state === "upcoming" ? "text-muted" : "text-text",
                    )}
                  >
                    {item.title}
                  </Text>
                  {item.state === "active" ? (
                    <Badge label={t("common.active")} tone="blue" compact />
                  ) : null}
                </View>
                <Text
                  className={cn(
                    "text-sm",
                    item.state === "active" ? "text-primary font-semibold" : "text-secText",
                  )}
                >
                  {item.time}
                </Text>
              </View>
              <Text className="text-sm text-secText mt-0.5 leading-5">{item.detail}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
