import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { MilestoneList } from "@/components/passenger/MilestoneList";
import { RouteTimeline } from "@/components/passenger/RouteTimeline";
import { TripDetailsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Rating } from "@/components/ui/Rating";
import { Ripple } from "@/components/ui/Ripple";
import { RouteStrip } from "@/components/ui/RouteStrip";
import { Screen } from "@/components/ui/Screen";
import { seatAvailability } from "@/lib/db";
import { useBookings } from "@/lib/queries/bookingsQueries";
import { useDriver } from "@/lib/queries/driversQueries";
import { useTrip } from "@/lib/queries/tripsQueries";

export default function TripDetailsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
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
  const fromCity = trip ? t(`common.${trip.from.toLowerCase()}`) : t("common.kandahar");
  const toCity = trip ? t(`common.${trip.to.toLowerCase()}`) : t("common.kabul");

  const stops = [
    { city: fromCity, time: `${trip?.departTime ?? "06:30"} ${trip?.departPeriod ?? "AM"}`, state: "done" as const },
    { city: "Qalat", time: "08:45 AM", state: "passed" as const },
    {
      city: "Ghazni",
      time: "11:00 AM",
      state: "active" as const,
      note: t("trip.stopBadge"),
    },
    { city: toCity, time: `${trip?.arriveTime ?? "01:15"} ${trip?.arrivePeriod ?? "PM"}`, state: "upcoming" as const },
  ];

  return (
    <Screen
      refreshing={tripQuery.isRefetching}
      onRefresh={() => {
        tripQuery.refetch();
        bookingsQuery.refetch();
      }}
      contentClassName="pb-28"
      footer={
        trip ? (
          <View className="absolute left-0 right-0 bottom-0 bg-card border-t border-border px-4 py-3 flex-row items-center justify-between">
            <View>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-2xl font-bold text-text">
                  {trip.price.toLocaleString("en-US")}
                </Text>
                <Text className="text-2xs font-semibold text-secText">{t("common.afn")}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Icon name="airline-seat-recline-normal" size={11} color="#EF4444" />
                <Text className="text-xs font-semibold text-error">
                  {t("trip.seatsAvailable", { count: available })}
                </Text>
              </View>
            </View>
            <AppButton
              label={t("common.selectSeats")}
              icon="chevron-right"
              className="min-w-[150px]"
              onPress={() =>
                router.push({ pathname: "/passenger/seats/[id]", params: { id: trip.id } })
              }
            />
          </View>
        ) : null
      }
    >
      <AppHeader title={t("trip.title")} />

      {tripQuery.isLoading || !trip ? (
        <TripDetailsSkeleton />
      ) : (
        <View className="px-4 gap-3">
          <Card>
            <Ripple
              onPress={() => {
                if (trip.driverId) {
                  router.push({
                    pathname: "/passenger/driver/[id]",
                    params: { id: trip.driverId },
                  });
                }
              }}
              accessibilityLabel={driver?.name ?? t("driverDetails.title")}
              className="flex-row items-center gap-3"
            >
              <Avatar
                initials={driver?.initials ?? "AW"}
                photo={driver?.photo}
                size="lg"
                verified={Boolean(driver)}
              />
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-md font-bold text-text" numberOfLines={1}>
                    {driver?.name ?? "Ustad Ahmad Wali"}
                  </Text>
                  <Icon name="verified" size={14} color="#1D4ED8" />
                </View>
                <Rating
                  value={driver?.rating ?? 4.9}
                  count={`(${driver?.totalTrips ?? 184} trips)`}
                  className="mt-1"
                />
              </View>
            </Ripple>

            <RouteStrip
              className="mt-3"
              fromCity={fromCity}
              toCity={toCity}
              departTime={trip.departTime}
              departPeriod={trip.departPeriod}
              arriveTime={trip.arriveTime}
              arrivePeriod={trip.arrivePeriod}
              duration={trip.duration}
            />

            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center gap-2">
                <View className="w-9 h-9 rounded-base bg-primarySoft items-center justify-center">
                  <Icon name="directions-car" size={18} color="#1D4ED8" />
                </View>
                <View>
                  <Text className="text-base font-bold text-text">Toyota Fielder</Text>
                  <Text className="text-xs text-secText">Plate: {trip.vehiclePlate}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Badge label={t("common.ac")} tone="slate" icon="ac-unit" compact />
                <Badge label={t("common.bags")} tone="slate" icon="luggage" compact />
              </View>
            </View>
          </Card>

          <Card className="flex-row items-center gap-3 py-3.5">
            <View className="w-10 h-10 rounded-full bg-primarySoft items-center justify-center">
              <Icon name="airline-seat-recline-normal" size={20} color="#1D4ED8" />
            </View>
            <View className="flex-1">
              <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted">
                {myBooking ? t("trip.bookedSeat") : t("trip.noSeat")}
              </Text>
              <Text className="text-base font-bold text-text mt-0.5">
                {myBooking
                  ? t("trip.seatFrontWindow", { seat: myBooking.seats[0] })
                  : t("trip.chooseSeat")}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-bold text-text">
                {myBooking?.passengerName ?? "—"}
              </Text>
              <Text className="text-2xs text-secText mt-0.5">
                {myBooking ? t("trip.ticketConfirmed") : t("trip.scheduled")}
              </Text>
            </View>
          </Card>

          <Card>
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
                  {t("trip.estArrival")}
                </Text>
                <View className="flex-row items-baseline gap-1.5 mt-1">
                  <Text className="text-3xl font-bold text-primary">
                    {trip.arriveTime} {trip.arrivePeriod}
                  </Text>
                  <Text className="text-xs text-secText">
                    {t("trip.timeLeft", { time: "2h 15m" })}
                  </Text>
                </View>
              </View>
              <View className="items-end gap-1">
                <View className="flex-row items-center gap-1">
                  <Icon name="speed" size={14} color="#64748B" />
                  <Text className="text-sm font-semibold text-secText">85 km/h</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Icon name="wifi" size={14} color="#64748B" />
                  <Text className="text-xs text-secText">{t("trip.liveCorridor")}</Text>
                </View>
              </View>
            </View>

            <View className="rounded-base bg-primarySoft/60 border border-secBorder p-3 mt-3">
              <RouteTimeline stops={stops} className="mt-0" />
            </View>

            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center gap-1.5 flex-1">
                <Icon name="local-cafe" size={15} color="#64748B" />
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

          <Card>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-text">{t("trip.milestones")}</Text>
              <Text className="text-sm font-semibold text-primary">{t("trip.liveLog")}</Text>
            </View>
            <MilestoneList
              items={[
                {
                  title: t("trip.boarded"),
                  detail: trip.boardingPoint,
                  time: `${trip.departTime} ${trip.departPeriod}`,
                  state: "done",
                },
                {
                  title: t("trip.qalat"),
                  detail: t("trip.qalatDetail"),
                  time: "08:45 AM",
                  state: "done",
                },
                {
                  title: t("trip.ghazni"),
                  detail: t("trip.ghazniDetail"),
                  time: "11:00 AM",
                  state: "active",
                },
                {
                  title: t("trip.kabulTerminal"),
                  detail: t("trip.kabulDetail"),
                  time: `~${trip.arriveTime} ${trip.arrivePeriod}`,
                  state: "upcoming",
                },
              ]}
            />
          </Card>
        </View>
      )}

    </Screen>
  );
}
