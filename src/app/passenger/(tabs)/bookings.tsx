import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { CancelledBookingCard } from "@/components/passenger/CancelledBookingCard";
import { CompletedBookingCard } from "@/components/passenger/CompletedBookingCard";
import { NextTripCard } from "@/components/passenger/NextTripCard";
import { BookingsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { Section } from "@/components/ui/Section";
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
  const upcomingCount = useMemo(
    () =>
      (bookings ?? []).filter(
        (booking) => booking.status === "confirmed" || booking.status === "new",
      ).length,
    [bookings],
  );
  const tabCount =
    tab === "all"
      ? (bookings ?? []).length
      : tab === "completed"
        ? completed.length
        : tab === "cancelled"
          ? cancelled.length
          : upcomingCount;

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
  const showCancelled = tab === "all" || tab === "cancelled";

  return (
    <Screen refreshing={refreshing} onRefresh={refresh} contentClassName="pb-8">
      <View className="px-4 pt-4 pb-1">
        <Text className="text-xl font-bold text-text">{t("bookings.title")}</Text>
      </View>

      {bookingsQuery.isLoading ? (
        <View className="mt-2">
          <BookingsSkeleton />
        </View>
      ) : (
        <View className="px-4 gap-3">
          {/* upcoming trip sits above the tabs */}
          {nextTab && next && nextTrip ? (
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

          <View className="mt-1">
            <Segmented options={tabs} value={tab} onChange={setTab} compact />
            <Text className="text-2xs text-muted text-right mt-2">
              {t("bookings.count", { count: tabCount })}
            </Text>
          </View>

          {showCompleted && completed.length > 0 ? (
            <Section title={t("bookings.tabCompleted")} count={completed.length}>
              {completed.map((booking) => {
                const trip = findTrip(booking.tripId);
                if (!trip) return null;
                return (
                  <CompletedBookingCard
                    key={booking.id}
                    booking={booking}
                    trip={trip}
                    driver={drivers?.find((driver) => driver.id === trip.driverId)}
                  />
                );
              })}
            </Section>
          ) : null}

          {showCancelled && cancelled.length > 0 ? (
            <Section title={t("bookings.tabCancelled")} count={cancelled.length}>
              {cancelled.map((booking) => {
                const trip = findTrip(booking.tripId);
                if (!trip) return null;
                return (
                  <CancelledBookingCard
                    key={booking.id}
                    booking={booking}
                    trip={trip}
                    driver={drivers?.find((driver) => driver.id === trip.driverId)}
                    onBookAgain={() =>
                      router.push({
                        pathname: "/passenger/search",
                        params: { from: trip.from, to: trip.to },
                      })
                    }
                  />
                );
              })}
            </Section>
          ) : null}

          {tab === "cancelled" && cancelled.length === 0 ? (
            <EmptyState
              icon="cancel"
              title={t("bookings.tabCancelled")}
              message={t("bookings.emptyCancelled")}
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
