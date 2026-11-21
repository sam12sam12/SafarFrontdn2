import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { OwnerBookingCard } from "@/components/owner/OwnerBookingCard";
import { OwnerBookingsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { FilterChips } from "@/components/ui/FilterChips";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { showToast } from "@/components/ui/Toast";
import {
  useAcceptBooking,
  useBookings,
  useDeclineBooking,
} from "@/lib/queries/bookingsQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { formatNumber } from "@/lib/format";

type Tab = "new" | "confirmed" | "cancelled";

export default function OwnerBookingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("new");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const bookingsQuery = useBookings("owner");
  const { data: bookings } = bookingsQuery;
  const { data: trips } = useTrips();
  const accept = useAcceptBooking();
  const decline = useDeclineBooking();

  const findTrip = (tripId: string) => trips?.find((trip) => trip.id === tripId);

  const counts = useMemo(() => {
    const all = bookings ?? [];
    return {
      new: all.filter((booking) => booking.status === "new").length,
      confirmed: all.filter((booking) => booking.status === "confirmed").length,
      cancelled: all.filter((booking) => booking.status === "cancelled").length,
    };
  }, [bookings]);

  const requests = (bookings ?? []).filter((booking) => booking.status === "new");
  const unpaid = requests.filter((booking) => booking.paymentStatus === "unpaid");
  const unpaidTotal = unpaid.reduce((sum, booking) => sum + booking.amount, 0);

  const TABS = [
    { label: t("owner.tabNew", { count: counts.new }), value: "new" as Tab },
    { label: `${t("owner.tabConfirmed")} (${counts.confirmed})`, value: "confirmed" as Tab },
    { label: `${t("owner.tabCancelled")} (${counts.cancelled})`, value: "cancelled" as Tab },
  ];

  const FILTERS = [
    { label: t("owner.bookingFilterAll"), value: "all" },
    { label: t("owner.filterSharedSeat"), value: "shared" },
    { label: t("owner.filterVipCar"), value: "vip" },
    { label: t("owner.filterUnpaid"), value: "unpaid" },
  ];

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (bookings ?? []).filter((booking) => {
      if (booking.status !== tab) return false;
      const trip = trips?.find((entry) => entry.id === booking.tripId);
      if (filter === "vip" && trip?.service !== "vip") return false;
      if (filter === "shared" && trip?.service !== "shared") return false;
      if (filter === "unpaid" && booking.paymentStatus !== "unpaid") return false;
      if (needle) {
        return (
          booking.passengerName.toLowerCase().includes(needle) ||
          booking.code.toLowerCase().includes(needle) ||
          booking.phone.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [bookings, tab, filter, search, trips]);

  const header = (
    <View className="pt-3 pb-3">
      <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-primary">
        {t("owner.brandEyebrow")}
      </Text>
      <Text className="text-3xl font-bold text-text mt-1">{t("owner.bookingsTitle")}</Text>
    </View>
  );

  if (bookingsQuery.isLoading) {
    return (
      <Screen contentClassName="px-4 pb-8">
        {header}
        <OwnerBookingsSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-4 pb-8">
      {header}

      <Field
        placeholder={t("owner.searchBooking")}
        value={search}
        onChangeText={setSearch}
        icon="search"
        className="mb-3"
      />

      <View className="flex-row gap-2.5">
        <View className="flex-1 rounded-lg bg-primary p-3.5 shadow-card shadow-shadowColor">
          <View className="flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-onPrimary" />
            <Text className="text-2xs font-bold uppercase tracking-[0.8px] text-onPrimary/80">
              {t("owner.newNeedsYou")}
            </Text>
          </View>
          <Text className="text-3xl font-bold text-onPrimary mt-1">{requests.length}</Text>
          <Text className="text-sm text-onPrimary/80 mt-1">{t("owner.acceptOrDecline")}</Text>
        </View>
        <Card className="flex-1 p-3.5 border-warning/50">
          <Text className="text-2xs font-bold uppercase tracking-[0.8px] text-warning">
            {t("owner.unpaidAtAgency")}
          </Text>
          <View className="flex-row items-baseline gap-1 mt-1">
            <Text className="text-3xl font-bold text-text">{formatNumber(unpaidTotal)}</Text>
            <Text className="text-sm font-semibold text-secText">{t("common.afn")}</Text>
          </View>
          <Text className="text-sm text-secText mt-1">
            {t("owner.toCollect", { count: unpaid.length })}
          </Text>
        </Card>
      </View>

      <View className="mt-3">
        <Segmented options={TABS} value={tab} onChange={setTab} />
      </View>

      <View className="mt-3">
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <View className="gap-3 mt-3">
        {visible.length === 0 ? (
          <EmptyState
            icon="inbox"
            title={tab === "new" ? t("owner.noPendingRequests") : t("owner.nothingHere")}
            message={t("owner.requestsEmptyBody")}
          />
        ) : (
          visible.map((booking) => (
            <OwnerBookingCard
              key={booking.id}
              booking={booking}
              trip={findTrip(booking.tripId)}
              busy={accept.isPending || decline.isPending}
              onOpen={() =>
                router.push({ pathname: "/owner/booking/[id]", params: { id: booking.id } })
              }
              onCall={() =>
                showToast("info", t("owner.calling"), `${booking.passengerName} · ${booking.phone}`)
              }
              onAccept={async () => {
                try {
                  await accept.mutateAsync(booking.id);
                  showToast(
                    "success",
                    t("owner.bookingAccepted"),
                    t("owner.bookingAcceptedSub", { code: booking.code }),
                  );
                } catch {
                  showToast("error", t("owner.couldNotAccept"), t("owner.tryAgain"));
                }
              }}
              onDecline={async () => {
                try {
                  await decline.mutateAsync(booking.id);
                  showToast(
                    "warning",
                    t("owner.bookingDeclined"),
                    t("owner.bookingDeclinedSub", { code: booking.code }),
                  );
                } catch {
                  showToast("error", t("owner.couldNotDecline"), t("owner.tryAgain"));
                }
              }}
            />
          ))
        )}
      </View>
    </Screen>
  );
}
