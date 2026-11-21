import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { BoardingPassCard } from "@/components/passenger/BoardingPassCard";
import { BookedSeatCard } from "@/components/passenger/BookedSeatCard";
import { MilestoneList } from "@/components/passenger/MilestoneList";
import { TripSummaryCard } from "@/components/passenger/TripSummaryCard";
import { TripDetailsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { useBooking } from "@/lib/queries/bookingsQueries";
import { useDriver } from "@/lib/queries/driversQueries";
import { useTrip } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

export default function BookingConfirmedScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookingQuery = useBooking(id);
  const { data: booking } = bookingQuery;
  const tripQuery = useTrip(booking?.tripId);
  const { data: trip } = tripQuery;
  const { data: driver } = useDriver(trip?.driverId);

  const [primaryLight, primary, primaryDark] = useCSSVariable([
    "--color-primaryLight",
    "--color-primary",
    "--color-primaryDark",
  ]) as string[];

  const fromCity = trip ? t(`common.${trip.from.toLowerCase()}`) : t("common.kandahar");
  const toCity = trip ? t(`common.${trip.to.toLowerCase()}`) : t("common.kabul");

  return (
    <Screen
      contentClassName="pb-10"
      refreshing={bookingQuery.isRefetching || tripQuery.isRefetching}
      onRefresh={() => {
        bookingQuery.refetch();
        tripQuery.refetch();
      }}
    >
      <LinearGradient
        colors={["#E8F1FF", "#F5F8FD"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 430 }}
      />

      <AppHeader title={t("trip.title")} />

      {bookingQuery.isLoading || tripQuery.isLoading ? (
        <TripDetailsSkeleton />
      ) : (
        <View className="px-4">
          <View className="items-center">
            <View className="w-[104px] h-[104px] rounded-full bg-primarySoft items-center justify-center">
              <LinearGradient
                colors={[primaryLight, primary, primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 82, height: 82, borderRadius: 41 }}
              >
                <View className="flex-1 items-center justify-center">
                  <Icon name="check" size={42} color={colors.onPrimary} />
                </View>
              </LinearGradient>
            </View>

            <View className="flex-row items-center gap-1.5 rounded-full bg-card border border-primaryBorder px-3 py-1.5 mt-4 shadow-sm shadow-shadowColor">
              <Icon name="verified" size={13} color={colors.primary} />
              <Text className="text-2xs font-bold uppercase tracking-[1px] text-primary">
                {t("confirmed.badge")}
              </Text>
            </View>

            <Text className="text-3xl font-bold text-text text-center mt-3">
              {t("confirmed.title")}
            </Text>
            <Text className="text-base text-secText text-center mt-2 leading-5 max-w-[300px]">
              {t("confirmed.subtitle", { from: fromCity, to: toCity })}
            </Text>
          </View>

          {trip ? (
            <View className="gap-3 mt-5">
              <TripSummaryCard trip={trip} driver={driver ?? undefined} />

              {booking ? (
                <BookedSeatCard
                  seat={booking.seats[0] ?? "02"}
                  name={booking.passengerName}
                />
              ) : null}

              {booking ? <BoardingPassCard booking={booking} trip={trip} /> : null}

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
          ) : null}
        </View>
      )}
    </Screen>
  );
}
