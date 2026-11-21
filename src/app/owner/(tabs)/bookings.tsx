import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { FilterChips } from "@/components/ui/FilterChips";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { showToast } from "@/components/ui/Toast";
import { OwnerBookingCard } from "@/components/owner/OwnerBookingCard";
import { OwnerBookingsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import {
  useAcceptBooking,
  useBookings,
  useDeclineBooking,
} from "@/lib/queries/bookingsQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

type Tab = "new" | "confirmed" | "cancelled";

export default function OwnerBookingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("new");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const TABS = [
    { label: t("owner.tabRequests"), value: "new" as Tab },
    { label: t("owner.tabConfirmed"), value: "confirmed" as Tab },
    { label: t("owner.tabCancelled"), value: "cancelled" as Tab },
  ];

  const FILTERS = [
    { label: t("owner.bookingFilterAll"), value: "all" },
    { label: t("owner.bookingFilterVip"), value: "vip" },
    { label: t("owner.bookingFilterShared"), value: "shared" },
    { label: t("owner.bookingFilterCash"), value: "cash" },
  ];

  const bookingsQuery = useBookings("owner");
  const { data: bookings } = bookingsQuery;
  const { data: trips } = useTrips();
  const accept = useAcceptBooking();
  const decline = useDeclineBooking();

  const findTrip = (tripId: string) => trips?.find((trip) => trip.id === tripId);

  const visible = useMemo(() => {
    return (bookings ?? []).filter((booking) => {
      if (booking.status !== tab) return false;
      const trip = trips?.find((entry) => entry.id === booking.tripId);
      if (filter === "vip" && trip?.service !== "vip") return false;
      if (filter === "shared" && trip?.service !== "shared") return false;
      if (filter === "cash" && booking.payment !== "cash") return false;
      if (search.trim()) {
        const needle = search.trim().toLowerCase();
        return (
          booking.passengerName.toLowerCase().includes(needle) ||
          booking.code.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [bookings, tab, filter, search, trips]);

  const requests = (bookings ?? []).filter((booking) => booking.status === "new");
  const paidToday = requests
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.amount, 0);

  if (bookingsQuery.isLoading) {
    return (
      <Screen contentClassName="px-4 pb-8">
        <AppHeader
          title={t("owner.bookingsTitle")}
          showBack={false}
          subtitle={t("owner.bookingsSubtitle")}
          right={<Badge label={t("owner.agencyBadge")} tone="blue" compact />}
        />
        <OwnerBookingsSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-4 pb-8">
      <AppHeader
        title={t("owner.bookingsTitle")}
        showBack={false}
        subtitle={t("owner.bookingsSubtitle")}
        right={<Badge label={t("owner.agencyBadge")} tone="blue" compact />}
      />

      <Field
        placeholder={t("owner.searchBooking")}
        value={search}
        onChangeText={setSearch}
        icon="search"
      />

      <View className="flex-row gap-2.5 mt-3">
        <Card className="flex-1 p-3.5 bg-warningSoft border-warning/40">
          <View className="flex-row items-center gap-1.5">
            <Icon name="pending-actions" size={15} color={colors.warning} />
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-warning">
              {t("owner.awaitingApproval")}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-text mt-1">{requests.length}</Text>
          <Text className="text-sm text-secText">{t("owner.newRequests")}</Text>
        </Card>
        <Card className="flex-1 p-3.5">
          <View className="flex-row items-center gap-1.5">
            <Icon name="payments" size={15} color={colors.success} />
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-success">
              {t("owner.paidToday")}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-text mt-1">
            {paidToday.toLocaleString("en-US")}
          </Text>
          <Text className="text-sm text-secText">{t("owner.paidTodayHint")}</Text>
        </Card>
      </View>

      <View className="mt-4">
        <Segmented options={TABS} value={tab} onChange={setTab} compact />
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
              onAccept={async () => {
                try {
                  await accept.mutateAsync(booking.id);
                  showToast("success", t("owner.bookingAccepted"), t("owner.bookingAcceptedSub", { code: booking.code }));
                } catch {
                  showToast("error", t("owner.couldNotAccept"), t("owner.tryAgain"));
                }
              }}
              onDecline={async () => {
                try {
                  await decline.mutateAsync(booking.id);
                  showToast("warning", t("owner.bookingDeclined"), t("owner.bookingDeclinedSub", { code: booking.code }));
                } catch {
                  showToast("error", t("owner.couldNotDecline"), t("owner.tryAgain"));
                }
              }}
            />
          ))
        )}
      </View>

      <View className="flex-row items-center justify-center gap-2 mt-4">
        <Badge label={t("owner.hesabpaySettled")} tone="green" icon="bolt" compact />
        <Badge label={t("owner.cashAtGate")} tone="amber" icon="payments" compact />
      </View>
    </Screen>
  );
}
