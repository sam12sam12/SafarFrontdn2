import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import type { Driver, Trip } from "@/lib/db/types";
import { formatRelativeDay } from "@/lib/dates";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { RouteStrip } from "../ui/RouteStrip";

export type TripCardVariant = "passenger" | "driver" | "owner";

type Props = {
  trip: Trip;
  driver?: Driver;
  /** same card everywhere; only the footer action changes with the role */
  variant?: TripCardVariant;
  seatsAvailable?: number;
  onPress: () => void;
  /** footer pill — select seats / manifest / manage (assign when needed) */
  onAction?: () => void;
  /** owner: trip still has no car */
  onAssign?: () => void;
  className?: string;
};

export function TripCard({
  trip,
  driver,
  variant = "passenger",
  seatsAvailable,
  onPress,
  onAction,
  onAssign,
  className,
}: Props) {
  const { t, i18n } = useTranslation();
  const freeSeats = seatsAvailable ?? Math.max(0, trip.seatsTotal - trip.seatsBooked);
  const vip = trip.service === "vip";
  const from = t(`common.${trip.from.toLowerCase()}`);
  const to = t(`common.${trip.to.toLowerCase()}`);
  const vehicleModel = (driver?.vehicleModel ?? "Toyota Fielder").replace(/\s+\d{4}$/, "");
  const plate = driver?.plate ?? trip.vehiclePlate;
  const action = onAction ?? onPress;
  const needsDriver = variant === "owner" && trip.status === "needs-driver";
  const bookingOpen = trip.status === "scheduled" && freeSeats > 0;

  // localized weekday + day + month, with Today / Tomorrow short-circuited
  const dateText = formatRelativeDay(trip.date, i18n.language);

  // Seats-remaining reads the same everywhere now — a soft-red pill like the
  // passenger home card — with on-road / boarding / sold-out as the exceptions.
  const statusLine =
    trip.status === "on-road"
      ? { label: t("owner.statusOnRoad"), tone: "text-success", icon: "navigation" as const }
      : trip.status === "boarding"
        ? { label: t("trip.boardingNow"), tone: "text-success", icon: "sensor-occupied" as const }
        : freeSeats <= 0
          ? { label: t("common.soldOut"), tone: "text-muted", icon: "block" as const }
          : {
              label:
                variant === "passenger"
                  ? t("trip.seatsAvailable", { count: freeSeats })
                  : t("trip.seatsEmpty", { count: freeSeats }),
              tone: "text-error",
              icon: "airline-seat-recline-normal" as const,
            };

  const statusColor =
    trip.status === "on-road" || trip.status === "boarding"
      ? colors.success
      : freeSeats <= 0
        ? colors.muted
        : colors.error;

  const statusBg =
    trip.status === "on-road" || trip.status === "boarding"
      ? "bg-successSoft"
      : freeSeats <= 0
        ? "bg-disable"
        : "bg-errorSoft";

  const actionLabel =
    variant === "owner"
      ? needsDriver
        ? t("owner.assignDriverCta")
        : t("trip.manage")
      : variant === "driver"
        ? t("trip.manifest")
        : bookingOpen
          ? t("common.selectSeats")
          : freeSeats <= 0
            ? t("common.soldOut")
            : t("trip.viewTrip");

  const actionDisabled = variant === "passenger" && (trip.status === "full" || freeSeats <= 0);
  const primaryAction = variant === "passenger" && !bookingOpen ? onPress : action;

  return (
    <Card className={cn("p-0 overflow-hidden", className)}>
      <Pressable
        onPress={onPress}
        accessibilityLabel={`${trip.code} ${from} ${to}`}
        className="p-4"
        style={({ pressed }) => (pressed ? { opacity: 0.94 } : undefined)}
      >
        {/* driver — name + rating on the left, service badge on the far right */}
        <View className="flex-row items-center gap-3">
          <Avatar initials={driver?.initials ?? "—"} photo={driver?.photo} size="md" />
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-md font-bold text-text" numberOfLines={1}>
                {driver?.name ?? t("owner.noDriverAssigned")}
              </Text>
              {driver && !needsDriver ? (
                <Icon name="verified" size={14} color={colors.primary} />
              ) : null}
            </View>
            {driver ? (
              <View className="flex-row items-center gap-1 mt-0.5">
                <Icon name="star" size={12} color={colors.warning} />
                <Text className="text-sm font-semibold text-text">
                  {driver.rating.toFixed(1)}
                </Text>
                <Text className="text-sm text-secText" numberOfLines={1}>
                  · {t("trip.tripsCount", { count: driver.totalTrips })}
                </Text>
              </View>
            ) : (
              <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
                {t("trip.plate", { plate: trip.vehiclePlate })}
              </Text>
            )}
          </View>
          <Badge
            label={vip ? t("driver.vipFamily") : t("driver.shared")}
            tone={vip ? "violet" : "blue"}
            compact
          />
        </View>

        <RouteStrip
          className="mt-3"
          fromCity={from}
          toCity={to}
          departTime={trip.departTime}
          departPeriod={trip.departPeriod}
          arriveTime={trip.arriveTime}
          arrivePeriod={trip.arrivePeriod}
          duration={trip.duration}
          dateText={dateText}
        />

        {/* car */}
        <View className="flex-row items-center gap-2.5 mt-3">
          <View className="w-9 h-9 rounded-base bg-primarySoft items-center justify-center">
            <Icon name="directions-car" size={18} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text">{vehicleModel}</Text>
            <Text className="text-sm text-secText">{t("trip.plate", { plate })}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Badge label={t("common.ac")} tone="slate" icon="ac-unit" compact />
            <Badge label={t("common.bags")} tone="slate" icon="luggage" compact />
          </View>
        </View>

        {/* fare + free seats, same row in every role */}
        <View className="flex-row items-end justify-between gap-2 mt-3.5">
          <View>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-bold text-text">
                {trip.price.toLocaleString("en-US")}
              </Text>
              <Text className="text-sm font-semibold text-secText">{t("common.afn")}</Text>
            </View>
            <View className={cn("flex-row items-center gap-1 mt-1 self-start rounded-full px-2 py-1", statusBg)}>
              <Icon name={statusLine.icon} size={12} color={statusColor} />
              <Text className={cn("text-xs font-bold", statusLine.tone)}>
                {statusLine.label}
              </Text>
            </View>
          </View>

          <Ripple
            onPress={needsDriver ? (onAssign ?? primaryAction) : primaryAction}
            disabled={actionDisabled}
            accessibilityLabel={actionLabel}
            className={cn(
              "flex-row items-center gap-1.5 rounded-full px-4 py-2.5",
              actionDisabled ? "bg-disable" : "bg-primary shadow-button shadow-buttonShadow",
            )}
          >
            <Text
              className={cn(
                "text-base-lg font-bold",
                actionDisabled ? "text-muted" : "text-onPrimary",
              )}
            >
              {actionLabel}
            </Text>
            {actionDisabled ? null : (
              <Icon name="chevron-right" size={16} color={colors.onPrimary} />
            )}
          </Ripple>
        </View>
      </Pressable>
    </Card>
  );
}
