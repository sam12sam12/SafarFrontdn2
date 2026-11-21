import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { BoardingPassCard } from "@/components/passenger/BoardingPassCard";
import { CompletedBookingCard } from "@/components/passenger/CompletedBookingCard";
import { NextTripCard } from "@/components/passenger/NextTripCard";
import { BookingsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { showToast } from "@/components/ui/Toast";
import { useBookings } from "@/lib/queries/bookingsQueries";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";

type Tab = "all" | "upcoming" | "completed" | "cancelled";

export default function PassengerBookingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("all");

  const bookingsQuery = useBookings("passenger");
  const tripsQuery = useTrips();
  const { data: drivers } = useDrivers();

  const bookings = bookingsQuery.data;
  const trips = tripsQuery.data;
  const next = useMemo(
    () =>
      (bookings ?? []).find(
        (booking) => booking.status === "confirmed" || booking.status === "new",
      ),
    [bookings],
  );
  const completed = useMemo(
    () => (bookings ?? []).filter((booking) => booking.status === "completed"),
    [bookings],
  );
  const cancelled = useMemo(
    () => (bookings ?? []).filter((booking) => booking.status === "cancelled"),
    [bookings],
  );

  const findTrip = (tripId: string) => trips?.find((trip) => trip.id === tripId);
  const nextTrip = next ? findTrip(next.tripId) : undefined;
  const nextDriver = drivers?.find((driver) => driver.id === nextTrip?.driverId);

  const tabs = [
    { label: t("bookings.tabAll"), value: "all" as Tab },
    { label: t("bookings.tabUpcoming"), value: "upcoming" as Tab },
    { label: t("bookings.tabCompleted"), value: "completed" as Tab },
    { label: t("bookings.tabCancelled"), value: "cancelled" as Tab },
  ];

  const refreshing = bookingsQuery.isRefetching || tripsQuery.isRefetching;
  const refresh = () => {
    bookingsQuery.refetch();
    tripsQuery.refetch();
  };

  const nextTab = tab === "all" || tab === "upcoming";
  const showCompleted = tab === "all" || tab === "completed";

  return (
    <Screen refreshing={refreshing} onRefresh={refresh} contentClassName="pb-8">
      <View className="px-4 pt-4 pb-3">
        <Text className="text-xl font-bold text-text">{t("bookings.title")}</Text>
      </View>

      <View className="px-4">
        <Segmented options={tabs} value={tab} onChange={setTab} compact />
        <Text className="text-2xs text-muted text-right mt-2">
          {t("bookings.count", { count: (bookings ?? []).filter((b) => b.status === "confirmed" || b.status === "new").length })}
        </Text>
      </View>

      {bookingsQuery.isLoading ? (
        <View className="mt-2">
          <BookingsSkeleton />
        </View>
      ) : (
        <View className="px-4 mt-2 gap-3">
          {nextTab && next && nextTrip ? (
            <>
              <NextTripCard
                booking={next}
                trip={nextTrip}
                driver={nextDriver}
                onCall={() =>
                  showToast("info", t("common.callDriver"), nextDriver?.phone ?? t("common.highwayCaptain"))
                }
                onShare={() =>
                  showToast("success", t("common.shareTrip"), t("tracking.shareSuccessSub"))
                }
                onOpen={() =>
                  router.push({ pathname: "/passenger/trip/[id]", params: { id: nextTrip.id } })
                }
              />
              <BoardingPassCard booking={next} trip={nextTrip} />
              <Card className="flex-row items-center gap-3 py-3.5">
                <View className="w-9 h-9 rounded-full bg-primarySoft items-center justify-center">
                  <Icon name="event-repeat" size={17} color="#1D4ED8" />
                </View>
                <View className="flex-1">
                  <Text className="text-base-lg font-bold text-text">
                    {t("bookings.freeCancellation")}
                  </Text>
                  <Text className="text-sm text-secText mt-0.5">
                    {t("bookings.freeCancellationSub")}
                  </Text>
                </View>
                <Icon name="chevron-right" size={18} color="#94A3B8" />
              </Card>
              <Card className="flex-row items-center gap-3 py-3.5">
                <View className="w-9 h-9 rounded-full bg-successSoft items-center justify-center">
                  <Icon name="shield" size={17} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-base-lg font-bold text-text">{t("bookings.security")}</Text>
                  <Text className="text-sm text-secText mt-0.5 leading-4">
                    {t("bookings.securitySub")}
                  </Text>
                </View>
              </Card>
            </>
          ) : null}

          {nextTab && !next ? (
            <EmptyState
              icon="confirmation-number"
              title={t("bookings.emptyTitle")}
              message={t("bookings.emptyMessage")}
              actionLabel={t("common.allTrips")}
              onAction={() => router.push("/passenger/search")}
            />
          ) : null}

          {showCompleted && completed.length > 0 ? (
            <View className="gap-3 mt-2">
              <Text className="text-2xs text-muted text-right">
                {t("bookings.completed", { count: completed.length })}
              </Text>
              {completed.map((booking) => {
                const trip = findTrip(booking.tripId);
                if (!trip) return null;
                return (
                  <CompletedBookingCard
                    key={booking.id}
                    booking={booking}
                    trip={trip}
                    driver={drivers?.find((driver) => driver.id === trip.driverId)}
                    onReceipt={() =>
                      showToast("success", t("bookings.receipt"), `${booking.code} · PDF ready.`)
                    }
                    onBookAgain={() => undefined}
                  />
                );
              })}
            </View>
          ) : null}

          {tab === "cancelled" && cancelled.length === 0 ? (
            <EmptyState
              icon="cancel"
              title={t("bookings.tabCancelled")}
              message="No cancelled bookings on this account."
            />
          ) : null}

          {tab === "completed" && completed.length === 0 ? (
            <EmptyState icon="check-circle" title={t("bookings.tabCompleted")} message={t("bookings.emptyMessage")} />
          ) : null}

          <Ripple
            onPress={() => router.push("/passenger/search")}
            accessibilityLabel={t("common.allTrips")}
            className="flex-row items-center justify-center gap-2 rounded-full border border-primaryBorder py-3 mt-1"
          >
            <Icon name="search" size={16} color="#1D4ED8" />
            <Text className="text-base-lg font-bold text-primary">{t("home.checkAvailable")}</Text>
          </Ripple>
        </View>
      )}
    </Screen>
  );
}
