import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Driver, Trip } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { SeatProgress } from "../ui/Progress";
import { Ripple } from "../ui/Ripple";

type Props = {
  trip: Trip;
  driver?: Driver;
  onPress: () => void;
  onAssign?: () => void;
};

const TONE = {
  "on-road": "green",
  boarding: "blue",
  scheduled: "slate",
  full: "slate",
  "needs-driver": "amber",
  completed: "slate",
  draft: "slate",
} as const;

const LABEL_KEY = {
  "on-road": "owner.statusOnRoad",
  boarding: "owner.boarding",
  scheduled: "owner.scheduledBadge",
  full: "owner.fullBadge",
  "needs-driver": "owner.needsDriverBadge",
  completed: "owner.completedBadge",
  draft: "owner.draftBadge",
} as const;

export function OwnerTripCard({ trip, driver, onPress, onAssign }: Props) {
  const { t } = useTranslation();
  const needsDriver = trip.status === "needs-driver";
  const wholeCar = trip.service === "vip";

  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={`${trip.code} ${trip.from} ${trip.to}`}
      className="rounded-lg"
    >
      <Card className={cn("gap-3 p-3.5 rounded-lg", needsDriver && "border-warning/60")}>
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-row items-start gap-3 flex-1">
            <View className="items-center w-11">
              <Text className="text-xl font-bold text-text">{trip.departTime}</Text>
              <Text className="text-2xs font-semibold text-muted uppercase">{trip.departPeriod}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-md font-bold text-text">{trip.from}</Text>
                <Icon name="arrow-forward" size={13} color={colors.muted} />
                <Text className="text-md font-bold text-text">{trip.to}</Text>
              </View>
              <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
                {wholeCar ? `${t("owner.serviceVip")} · ${t("owner.wholeCar")}` : t("owner.bookingFilterShared")}
                {" · #"}
                {trip.code}
              </Text>
            </View>
          </View>
          <Badge label={t(LABEL_KEY[trip.status])} tone={TONE[trip.status]} compact />
        </View>

        <View className="flex-row items-center gap-3">
          <SeatProgress
            total={trip.seatsTotal}
            filled={trip.seatsBooked}
            tone={wholeCar ? "teal" : "blue"}
            className="flex-1"
          />
          <Text className="text-sm font-semibold text-text">
            {wholeCar
              ? t("owner.wholeCar")
              : t("owner.seatsOfTotal", { booked: trip.seatsBooked, total: trip.seatsTotal })}
          </Text>
        </View>

        {needsDriver ? (
          <View className="flex-row items-center justify-between gap-2 pt-0.5">
            <View className="flex-row items-center gap-1.5 flex-1">
              <Icon name="error-outline" size={15} color={colors.warning} />
              <Text className="text-sm font-medium text-warning" numberOfLines={1}>
                {t("owner.noDriverCar")}
              </Text>
            </View>
            <Ripple
              onPress={onAssign ?? onPress}
              accessibilityLabel={t("owner.assignDriverCta")}
              className="rounded-full bg-text px-3.5 py-2"
            >
              <Text className="text-sm font-bold text-onPrimary">{t("owner.assignDriverCta")}</Text>
            </Ripple>
          </View>
        ) : (
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2 flex-1">
              <Avatar initials={driver?.initials ?? "—"} size="xs" />
              <Text className="text-sm font-semibold text-text flex-1" numberOfLines={1}>
                {driver?.name ?? t("owner.noDriverAssigned")}
              </Text>
            </View>
            <Text className="text-2xs font-medium text-muted">{trip.vehiclePlate}</Text>
          </View>
        )}
      </Card>
    </Ripple>
  );
}
