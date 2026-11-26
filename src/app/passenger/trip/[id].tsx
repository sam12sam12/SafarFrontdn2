import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { RouteTimeline } from "@/components/passenger/RouteTimeline";
import { TripMap } from "@/components/trip/TripMap";
import { TripRouteHero } from "@/components/trip/TripRouteHero";
import { TripDetailsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { seatAvailability } from "@/lib/db";
import type { TripStatus } from "@/lib/db/types";
import { useBookings } from "@/lib/queries/bookingsQueries";
import { useDriver } from "@/lib/queries/driversQueries";
import { useTrip } from "@/lib/queries/tripsQueries";
import { formatTripDate } from "@/lib/dates";
import { formatNumber } from "@/lib/format";
import { colors } from "@/utils/theme";

const STATUS_LABEL: Record<TripStatus, string> = {
  scheduled: "trip.scheduled",
  full: "common.soldOut",
  boarding: "trip.boardingNow",
  "on-road": "owner.statusOnRoad",
  completed: "trip.completed",
  draft: "owner.draftBadge",
  "needs-driver": "owner.needsDriverBadge",
};

const STATUS_TONE: Record<TripStatus, BadgeTone> = {
  scheduled: "blue",
  full: "amber",
  boarding: "green",
  "on-road": "green",
  completed: "slate",
  draft: "slate",
  "needs-driver": "amber",
};

type StopState = "done" | "passed" | "active" | "upcoming";

export default function TripDetailsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripQuery = useTrip(id);
  const { data: trip } = tripQuery;
  const { data: driver } = useDriver(trip?.driverId);
  const bookingsQuery = useBookings("passenger");

  const myBooking = bookingsQuery.data?.find(
    (booking) =>
      booking.tripId === id && (booking.status === "confirmed" || booking.status === "new"),
  );

  const available = trip ? seatAvailability(trip.id) : 0;
  const status: TripStatus = trip?.status ?? "scheduled";
  const bookable = status === "scheduled" && available > 0;
  const live = status === "on-road";
  const boarding = status === "boarding";
  const done = status === "completed";
  const fromCity = trip ? t(`common.${trip.from.toLowerCase()}`) : t("common.kandahar");
  const toCity = trip ? t(`common.${trip.to.toLowerCase()}`) : t("common.kabul");
  const departLabel = `${trip?.departTime ?? "06:30"} ${trip?.departPeriod ?? "AM"}`;
  const arriveLabel = `${trip?.arriveTime ?? "01:15"} ${trip?.arrivePeriod ?? "PM"}`;

  // Live trips walk the corridor; planned trips preview it; finished trips replay it.
  const stopStates: StopState[] = live
    ? ["done", "passed", "active", "upcoming"]
    : done
      ? ["done", "done", "done", "done"]
      : boarding
        ? ["active", "upcoming", "upcoming", "upcoming"]
        : ["upcoming", "upcoming", "upcoming", "upcoming"];

  const stops = [
    { city: fromCity, time: departLabel, state: stopStates[0] },
    { city: t("common.qalat"), time: "08:45 AM", state: stopStates[1] },
    {
      city: t("common.ghazni"),
      time: "11:00 AM",
      state: stopStates[2],
      note: stopStates[2] === "active" ? t("trip.stopBadge") : undefined,
    },
    { city: toCity, time: arriveLabel, state: stopStates[3] },
  ];

  const footer = trip ? (
    <View className="absolute left-0 right-0 bottom-0 bg-card border-t border-border px-4 py-3 flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-2xl font-bold text-text">
            {trip.price.toLocaleString("en-US")}
          </Text>
          <Text className="text-2xs font-semibold text-secText">{t("common.afn")}</Text>
        </View>
        <Text className="text-xs font-semibold text-secText mt-0.5" numberOfLines={1}>
          {live
            ? t("owner.statusOnRoad")
            : boarding
              ? t("trip.boardingNow")
              : done
                ? t("trip.completed")
                : available > 0
                  ? t("trip.seatsAvailable", { count: available })
                  : t("common.soldOut")}
        </Text>
      </View>
      {bookable ? (
        <AppButton
          label={t("common.selectSeats")}
          icon="chevron-right"
          className="min-w-[150px]"
          onPress={() => router.push({ pathname: "/passenger/seats/[id]", params: { id: trip.id } })}
        />
      ) : (
        <AppButton
          label={
            done
              ? t("trip.completed")
              : live
                ? t("owner.statusOnRoad")
                : boarding
                  ? t("trip.bookingClosed")
                  : t("common.soldOut")
          }
          disabled
          variant="secondary"
          className="min-w-[150px]"
        />
      )}
    </View>
  ) : null;

  return (
    <Screen
      refreshing={tripQuery.isRefetching}
      onRefresh={() => {
        tripQuery.refetch();
        bookingsQuery.refetch();
      }}
      contentClassName="pb-28"
      footer={footer}
    >
      <AppHeader
        title={t("trip.title")}
        subtitle={trip ? formatTripDate(trip.date, i18n.language) : undefined}
        right={trip ? <Badge label={t(STATUS_LABEL[status])} tone={STATUS_TONE[status]} /> : undefined}
      />

      {tripQuery.isLoading || !trip ? (
        <TripDetailsSkeleton />
      ) : (
        <View className="px-4 gap-3">
          <TripRouteHero
            trip={trip}
            driver={driver ?? undefined}
            onDriverPress={
              trip.driverId
                ? () =>
                    router.push({ pathname: "/passenger/driver/[id]", params: { id: trip.driverId! } })
                : undefined
            }
            dateText={formatTripDate(trip.date, i18n.language)}
            tiles={[
              {
                label: t("driver.service"),
                value: trip.service === "vip" ? t("driver.vipFamily") : t("driver.shared"),
              },
              { label: t("owner.vehicle"), value: trip.vehiclePlate },
            ]}
          />

          <TripMap height={190} driver={driver ?? undefined} />

          {live ? (
            <Card>
              <View className="flex-row items-start justify-between">
                <View>
                  <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
                    {t("trip.estArrival")}
                  </Text>
                  <View className="flex-row items-baseline gap-1.5 mt-1">
                    <Text className="text-3xl font-bold text-primary">{arriveLabel}</Text>
                    <Text className="text-xs text-secText">
                      {t("trip.timeLeft", { time: "2h 15m" })}
                    </Text>
                  </View>
                </View>
                <View className="items-end gap-1">
                  <View className="flex-row items-center gap-1">
                    <Icon name="speed" size={14} color={colors.secText} />
                    <Text className="text-sm font-semibold text-secText">85 km/h</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Icon name="wifi" size={14} color={colors.secText} />
                    <Text className="text-xs text-secText">{t("trip.liveCorridor")}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between mt-3 rounded-base bg-primarySoft/60 border border-secBorder px-3 py-2.5">
                <View className="flex-row items-center gap-1.5 flex-1">
                  <Icon name="local-cafe" size={15} color={colors.secText} />
                  <Text className="text-xs text-secText">
                    {t("trip.currentStop")}{" "}
                    <Text className="font-semibold text-text">{t("trip.stopName")}</Text>
                  </Text>
                </View>
                <Text className="text-xs font-bold text-primary">
                  {t("trip.minLeft", { count: 12 })}
                </Text>
              </View>
            </Card>
          ) : boarding ? (
            <Card className="flex-row items-center gap-3 border-success/40 bg-successSoft">
              <View className="w-10 h-10 rounded-full bg-card items-center justify-center">
                <Icon name="sensor-occupied" size={20} color={colors.success} />
              </View>
              <View className="flex-1">
                <Text className="text-base-lg font-bold text-text">{t("trip.boardingNow")}</Text>
                <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
                  {t("trip.boardAt", { point: trip.boardingPoint })}
                </Text>
              </View>
            </Card>
          ) : done ? (
            <Card className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-disable items-center justify-center">
                <Icon name="check" size={20} color={colors.secText} />
              </View>
              <View className="flex-1">
                <Text className="text-base-lg font-bold text-text">{t("trip.completed")}</Text>
                <Text className="text-sm text-secText mt-0.5">
                  {t("trip.arrivedAt", { time: arriveLabel })}
                </Text>
              </View>
            </Card>
          ) : (
            <Card className="flex-row items-center gap-3 py-3.5">
              <View className="w-10 h-10 rounded-full bg-primarySoft items-center justify-center">
                <Icon name="airline-seat-recline-normal" size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted">
                  {myBooking ? t("trip.bookedSeat") : t("trip.noSeat")}
                </Text>
                <Text className="text-base-lg font-bold text-text mt-0.5">
                  {myBooking
                    ? t("trip.seatFrontWindow", { seat: myBooking.seats[0] })
                    : available > 0
                      ? t("trip.chooseSeat")
                      : t("trip.allSeatsBooked")}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-text">
                  {myBooking?.passengerName ?? `${formatNumber(trip.price)} AFN`}
                </Text>
                <Text className="text-2xs text-secText mt-0.5">
                  {myBooking ? t("trip.ticketConfirmed") : t("trip.departsAt", { time: departLabel })}
                </Text>
              </View>
            </Card>
          )}

          <Card>
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-lg font-bold text-text">{t("trip.milestones")}</Text>
              <Text className="text-sm font-semibold text-primary">
                {live ? t("trip.liveLog") : done ? t("trip.completed") : t("trip.scheduled")}
              </Text>
            </View>
            {/* Brief, horizontal corridor strip — Kandahar · Qalat · Ghazni · Kabul */}
            <RouteTimeline stops={stops} />
          </Card>
        </View>
      )}
    </Screen>
  );
}
