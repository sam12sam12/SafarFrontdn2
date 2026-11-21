import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { SeatTile } from "@/components/ui/SeatTile";
import { showToast } from "@/components/ui/Toast";
import { OwnerManageTripSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { seatAvailability } from "@/lib/db";
import { useBookings } from "@/lib/queries/bookingsQueries";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useAssignDriver, useSeatMap, useTrip } from "@/lib/queries/tripsQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

export default function ManageTripScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripQuery = useTrip(id);
  const { data: trip } = tripQuery;
  const { data: seats } = useSeatMap(id);
  const { data: bookings } = useBookings("owner");
  const { data: drivers } = useDrivers();
  const assign = useAssignDriver();

  const driver = drivers?.find((entry) => entry.id === trip?.driverId);
  const tripBookings = (bookings ?? []).filter(
    (booking) => booking.tripId === id && booking.status !== "cancelled",
  );
  const revenue = trip ? trip.seatsBooked * trip.price : 0;
  const candidates = (drivers ?? []).filter(
    (entry) => entry.status === "free" || entry.status === "trip-today",
  );

  if (tripQuery.isLoading || !trip) {
    return (
      <Screen contentClassName="pb-8">
        <AppHeader title={t("owner.manageTripTitle")} />
        <OwnerManageTripSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="pb-8">
      <AppHeader
        title={t("owner.manageTripTitle")}
        subtitle={`${trip.code} · ${trip.dateLabel}`}
        right={<Badge label={trip.status === "on-road" ? t("owner.onRoadBadge") : t("owner.scheduledBadge")} tone="blue" />}
      />

      <View className="px-4 gap-3">
        <Card>
          <View className="flex-row items-baseline justify-between">
            <View>
              <Text className="text-2xl font-bold text-text">
                {trip.departTime} <Text className="text-sm text-secText">{trip.departPeriod}</Text>
              </Text>
              <Text className="text-base-lg font-semibold text-primary">{t(`common.${trip.from.toLowerCase()}`)}</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-muted">{trip.duration}</Text>
              <View className="flex-row items-center gap-1 my-1">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <View className="w-12 h-[2px] bg-primaryBorder" />
                <Icon name="directions-car" size={14} color={colors.primary} />
                <View className="w-12 h-[2px] bg-primaryBorder" />
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
              </View>
              <Text className="text-xs text-secText">{trip.distanceKm} km</Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-text">
                {trip.arriveTime} <Text className="text-sm text-secText">{trip.arrivePeriod}</Text>
              </Text>
              <Text className="text-base-lg font-semibold text-primary">{t(`common.${trip.to.toLowerCase()}`)}</Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-3">
            <Badge label={trip.service === "vip" ? t("owner.vipWholeCar") : t("owner.bookingFilterShared")} tone={trip.service === "vip" ? "teal" : "blue"} />
            <Badge label={`${trip.seatsBooked}/${trip.seatsTotal} ${t("owner.seatsSuffix")}`} tone="slate" icon="groups" />
            <Badge label={`${seatAvailability(id ?? "")} ${t("owner.freeSuffix")}`} tone="green" />
          </View>
        </Card>

        <Card className="flex-row items-center gap-3">
          <Avatar initials={driver?.initials ?? "?"} photo={driver?.photo} size="md" verified={Boolean(driver)} />
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text">{driver?.name ?? t("owner.noDriverAssigned")}</Text>
            <Text className="text-sm text-secText mt-0.5">
              {driver ? `${driver.vehicleModel} · ${driver.plate}` : t("owner.assignFreeChauffeur")}
            </Text>
          </View>
          <Badge label={driver ? t("owner.assigned") : t("owner.needsDriverBadge")} tone={driver ? "green" : "amber"} compact />
        </Card>

        <Card>
          <Text className="text-lg font-bold text-text mb-2.5">{t("owner.seatMap")}</Text>
          <View className="gap-2">
            <View className="flex-row gap-2">
              {(seats ?? []).slice(0, 2).map((seat) => (
                <SeatTile key={seat.id} seat={seat} compact />
              ))}
            </View>
            <View className="flex-row gap-2">
              {(seats ?? []).slice(2, 4).map((seat) => (
                <SeatTile key={seat.id} seat={seat} compact />
              ))}
            </View>
          </View>
          <View className="h-[1px] bg-secBorder my-3" />
          <DetailRow label={t("owner.bookedRevenue")} value={`${revenue.toLocaleString("en-US")} ${t("common.afn")}`} />
          <DetailRow label={t("owner.passengers")} value={`${tripBookings.length}`} />
          <DetailRow label={t("owner.boarding")} value={trip.boardingPoint} />
        </Card>

        <Card>
          <Text className="text-lg font-bold text-text mb-2">{t("owner.passengerManifest")}</Text>
          {tripBookings.length === 0 ? (
            <Text className="text-base text-muted py-2">{t("owner.noPassengersYet")}</Text>
          ) : (
            tripBookings.map((booking, index) => (
              <View key={booking.id}>
                <View className="flex-row items-center gap-2.5 py-2.5">
                  <Avatar initials={booking.initials} size="sm" />
                  <View className="flex-1">
                    <Text className="text-base-lg font-semibold text-text">{booking.passengerName}</Text>
                    <Text className="text-sm text-secText mt-0.5">
                      {t("common.seat")} {booking.seats.join(", ")} · {booking.phone}
                    </Text>
                  </View>
                  <Badge
                    label={booking.paymentStatus === "paid" ? t("common.paid") : t("owner.collectCash")}
                    tone={booking.paymentStatus === "paid" ? "green" : "amber"}
                    compact
                  />
                </View>
                {index < tripBookings.length - 1 ? <View className="h-[1px] bg-secBorder" /> : null}
              </View>
            ))
          )}
        </Card>

        <Card>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-bold text-text">{t("owner.reassignDriver")}</Text>
            <Badge label={t("owner.freeFirst")} tone="slate" compact />
          </View>
          <View className="gap-2">
            {candidates.slice(0, 4).map((entry) => {
              const active = entry.id === trip.driverId;
              return (
                <Ripple
                  key={entry.id}
                  onPress={async () => {
                    try {
                      await assign.mutateAsync({ tripId: trip.id, driverId: entry.id });
                      showToast("success", t("owner.driverAssigned"), `${entry.name} → ${trip.code}`);
                    } catch {
                      showToast("error", t("owner.couldNotAssign"), t("owner.tryAnotherDriver"));
                    }
                  }}
                  accessibilityLabel={`${t("owner.assignDriver")}: ${entry.name}`}
                  className={cn(
                    "flex-row items-center gap-2.5 rounded-base border px-3 py-2.5",
                    active ? "border-primary bg-primarySoft" : "border-border bg-card",
                  )}
                >
                  <View className="w-8 h-8 rounded-full bg-card border border-border items-center justify-center">
                    <Text className="text-sm font-bold text-primary">{entry.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base-lg font-semibold text-text">{entry.name}</Text>
                    <Text className="text-sm text-secText">
                      {entry.base} · {entry.plate}
                    </Text>
                  </View>
                  <Icon
                    name={active ? "check-circle" : "radio-button-unchecked"}
                    size={18}
                    color={active ? colors.primary : colors.slate}
                  />
                </Ripple>
              );
            })}
          </View>
        </Card>

        <View className="flex-row gap-2.5">
          <AppButton
            label={t("owner.callDriver")}
            variant="secondary"
            icon="phone"
            iconPosition="left"
            className="flex-1"
            onPress={() => showToast("info", t("owner.calling"), driver?.phone ?? t("owner.noDriverYet"))}
          />
          <AppButton
            label={t("owner.openManifest")}
            icon="groups"
            iconPosition="left"
            className="flex-1"
            onPress={() => showToast("info", t("owner.manifestToast"), t("owner.manifestToastSub", { count: tripBookings.length }))}
          />
        </View>
      </View>
    </Screen>
  );
}
