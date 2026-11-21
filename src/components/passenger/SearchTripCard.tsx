import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import type { Driver, Trip } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { RouteStrip } from "../ui/RouteStrip";

type Props = {
  trip: Trip;
  driver?: Driver;
  seatsAvailable: number;
  onOpen: () => void;
  onSelect: () => void;
};

export function SearchTripCard({ trip, driver, seatsAvailable, onOpen, onSelect }: Props) {
  const { t } = useTranslation();
  const soldOut = seatsAvailable <= 0;

  return (
    <Card className="p-0 overflow-hidden">
      <Pressable
        onPress={onOpen}
        accessibilityLabel={t("trip.title")}
        className="p-4"
        style={({ pressed }) => (pressed ? { opacity: 0.94 } : undefined)}
      >
        <View className="flex-row items-center gap-3">
          <Avatar initials={driver?.initials ?? "EH"} photo={driver?.photo} size="md" />
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-md font-bold text-text" numberOfLines={1}>
                {driver?.name ?? t("common.highwayCaptain")}
              </Text>
              <Icon name="verified" size={14} color={colors.primary} />
            </View>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Icon name="star" size={13} color={colors.warning} />
              <Text className="text-sm font-semibold text-text">
                {(driver?.rating ?? 4.9).toFixed(1)}
              </Text>
              <Text className="text-sm text-secText">({driver?.totalTrips ?? 184} trips)</Text>
            </View>
          </View>
        </View>

        <RouteStrip
          className="mt-3"
          fromCity={t(`common.${trip.from.toLowerCase()}`)}
          toCity={t(`common.${trip.to.toLowerCase()}`)}
          departTime={trip.departTime}
          departPeriod={trip.departPeriod}
          arriveTime={trip.arriveTime}
          arrivePeriod={trip.arrivePeriod}
          duration={trip.duration}
        />

        <View className="flex-row items-center gap-2.5 mt-3">
          <View className="w-9 h-9 rounded-base bg-primarySoft items-center justify-center">
            <Icon name="directions-car" size={18} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text">Toyota Fielder</Text>
            <Text className="text-sm text-secText">Plate: {trip.vehiclePlate}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Badge label={t("common.ac")} tone="slate" icon="ac-unit" compact />
            <Badge label={t("common.bags")} tone="slate" icon="luggage" compact />
          </View>
        </View>

        <View className="flex-row items-end justify-between mt-3.5">
          <View>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-bold text-text">
                {trip.price.toLocaleString("en-US")}
              </Text>
              <Text className="text-sm font-semibold text-secText">{t("common.afn")}</Text>
            </View>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Icon name="airline-seat-recline-normal" size={12} color={colors.error} />
              <Text className={cn("text-sm font-semibold", soldOut ? "text-error" : "text-error")}>
                {soldOut
                  ? t("common.soldOut")
                  : t("trip.seatsAvailable", { count: seatsAvailable })}
              </Text>
            </View>
          </View>

          <Ripple
            onPress={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            disabled={soldOut}
            accessibilityLabel={t("common.selectSeats")}
            className={cn(
              "flex-row items-center gap-1.5 rounded-full px-4 py-2.5",
              soldOut ? "bg-disable" : "bg-primary shadow-button shadow-buttonShadow",
            )}
          >
            <Text
              className={cn("text-base-lg font-bold", soldOut ? "text-muted" : "text-onPrimary")}
            >
              {t("common.selectSeats")}
            </Text>
            {!soldOut ? <Icon name="chevron-right" size={16} color={colors.onPrimary} /> : null}
          </Ripple>
        </View>
      </Pressable>
    </Card>
  );
}
