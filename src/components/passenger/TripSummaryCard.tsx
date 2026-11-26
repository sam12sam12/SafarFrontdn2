import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Driver, Trip } from "@/lib/db/types";
import { formatRelativeDay } from "@/lib/dates";
import { colors } from "@/utils/theme";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Rating } from "../ui/Rating";
import { RouteStrip } from "../ui/RouteStrip";

type Props = {
  trip: Trip;
  driver?: Driver;
  className?: string;
};

export function TripSummaryCard({ trip, driver, className }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <Card className={className}>
      <View className="flex-row items-center gap-3">
        <Avatar initials={driver?.initials ?? "AW"} photo={driver?.photo} size="md" />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-md font-bold text-text" numberOfLines={1}>
              {driver?.name ?? "Ustad Ahmad Wali"}
            </Text>
            <Icon name="verified" size={14} color={colors.primary} />
          </View>
          <Rating
            value={driver?.rating ?? 4.9}
            count={`(${driver?.totalTrips ?? 184} trips)`}
            className="mt-1"
          />
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
        dateText={formatRelativeDay(trip.date, i18n.language)}
      />

      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-base bg-primarySoft items-center justify-center">
            <Icon name="directions-car" size={18} color={colors.primary} />
          </View>
          <View>
            <Text className="text-base font-bold text-text">Toyota Fielder</Text>
            <Text className="text-sm text-secText">Plate: {trip.vehiclePlate}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Badge label={t("common.ac")} tone="slate" icon="ac-unit" compact />
          <Badge label={t("common.bags")} tone="slate" icon="luggage" compact />
        </View>
      </View>
    </Card>
  );
}
