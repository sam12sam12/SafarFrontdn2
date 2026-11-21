import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FilterChips } from "@/components/ui/FilterChips";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { OwnerTripCard } from "@/components/owner/OwnerTripCard";
import { OwnerTripsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

const DAYS = [
  { label: "Today", value: "2026-11-19", caption: "Thu 19" },
  { label: "Fri", value: "2026-11-20", caption: "20 Nov" },
  { label: "Sat", value: "2026-11-21", caption: "21 Nov" },
  { label: "Mon", value: "2026-11-23", caption: "23 Nov" },
];

export default function OwnerTripsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [day, setDay] = useState("2026-11-19");

  const FILTERS = [
    { label: t("owner.filterAll"), value: "all" },
    { label: t("owner.filterOnRoad"), value: "on-road" },
    { label: t("owner.filterBoarding"), value: "boarding" },
    { label: t("owner.filterScheduled"), value: "scheduled" },
    { label: t("owner.filterNeedsDriver"), value: "needs-driver" },
  ];

  const tripsQuery = useTrips();
  const driversQuery = useDrivers();
  const { data: trips } = tripsQuery;
  const { data: drivers } = driversQuery;

  const today = useMemo(
    () => (trips ?? []).filter((trip) => trip.date === day && trip.status !== "completed"),
    [trips, day],
  );

  const visible = useMemo(
    () => today.filter((trip) => filter === "all" || trip.status === filter),
    [today, filter],
  );

  const seatsSold = today.reduce((sum, trip) => sum + trip.seatsBooked, 0);
  const seatsTotal = today.reduce((sum, trip) => sum + trip.seatsTotal, 0);
  const revenue = today.reduce((sum, trip) => sum + trip.seatsBooked * trip.price, 0);
  const onRoad = today.filter((trip) => trip.status === "on-road").length;

  const header = (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center gap-2.5">
        <View className="w-10 h-10 rounded-base bg-primary items-center justify-center">
          <Icon name="route" size={21} color={colors.onPrimary} />
        </View>
        <View>
          <Text className="text-md font-bold text-text">Express Highway</Text>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-secText">
              {t("owner.roleTag")}
            </Text>
            <Badge label={t("owner.roleBadge")} tone="blue" compact />
          </View>
        </View>
      </View>
      <View className="flex-row items-center gap-2">
        <IconButton
          icon="notifications-none"
          accessibilityLabel={t("driver.notifications")}
          variant="white"
          size="sm"
          onPress={() => showToast("info", t("owner.newRequestsToast", { count: 4 }), t("owner.newRequestsToastSub"))}
        />
        <Avatar initials="SM" size="md" />
      </View>
    </View>
  );

  if (tripsQuery.isLoading) {
    return (
      <Screen contentClassName="px-4 pb-8">
        {header}
        <OwnerTripsSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-4 pb-8">
      {header}

      <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mt-2 mb-2">
        {t("owner.networkOverview", { day: DAYS.find((item) => item.value === day)?.label })}
      </Text>
      <View className="flex-row gap-2.5">
        <Card className="flex-1 p-3.5">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">{t("owner.statTrips")}</Text>
          <Text className="text-2xl font-bold text-text mt-1">{today.length}</Text>
          <Text className="text-sm text-secText">{t("owner.statTripsHint")}</Text>
        </Card>
        <Card className="flex-1 p-3.5">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">{t("owner.statSeatsSold")}</Text>
          <Text className="text-2xl font-bold text-text mt-1">
            {seatsSold}
            <Text className="text-sm text-secText">/{seatsTotal}</Text>
          </Text>
          <Text className="text-sm text-secText">{t("owner.statSeatsSoldHint")}</Text>
        </Card>
      </View>
      <View className="flex-row gap-2.5 mt-2.5">
        <Card className="flex-1 p-3.5">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">{t("owner.statRevenue")}</Text>
          <Text className="text-2xl font-bold text-success mt-1">
            {revenue.toLocaleString("en-US")}
          </Text>
          <Text className="text-sm text-secText">{t("owner.statRevenueHint")}</Text>
        </Card>
        <Card className="flex-1 p-3.5">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">{t("owner.statOnRoad")}</Text>
          <Text className="text-2xl font-bold text-primary mt-1">{onRoad}</Text>
          <Text className="text-sm text-secText">{t("owner.statOnRoadHint")}</Text>
        </Card>
      </View>

      <View className="flex-row gap-2 mt-4">
        {DAYS.map((item) => (
          <FilterChipsSingle
            key={item.value}
            active={day === item.value}
            label={item.label}
            caption={item.caption}
            onPress={() => setDay(item.value)}
          />
        ))}
      </View>

      <View className="mt-3">
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <View className="gap-3 mt-3">
        {visible.length === 0 ? (
          <Card className="items-center py-10">
            <Text className="text-base text-muted">{t("owner.emptyFilter")}</Text>
          </Card>
        ) : (
          visible.map((trip) => (
            <OwnerTripCard
              key={trip.id}
              trip={trip}
              driver={drivers?.find((driver) => driver.id === trip.driverId)}
              onPress={() => router.push({ pathname: "/owner/trip/[id]", params: { id: trip.id } })}
            />
          ))
        )}
      </View>

      <View className="flex-row gap-2.5 mt-4">
        <Card className="flex-1 flex-row items-center gap-2 py-3">
          <Icon name="gps-fixed" size={16} color={colors.primary} />
          <Text className="text-sm text-secText flex-1">{t("owner.gpsActive")}</Text>
        </Card>
        <Card className="flex-1 flex-row items-center gap-2 py-3">
          <Icon name="verified" size={16} color={colors.success} />
          <Text className="text-sm text-secText flex-1">{t("owner.permitsValid")}</Text>
        </Card>
      </View>

      <View className="flex-row items-center justify-between mt-4 rounded-lg bg-primary px-4 py-3 shadow-button shadow-buttonShadow">
        <View className="flex-row items-center gap-2.5">
          <Icon name="add-circle-outline" size={22} color={colors.onPrimary} />
          <View>
            <Text className="text-base-lg font-bold text-onPrimary">{t("owner.scheduleTrip")}</Text>
            <Text className="text-sm text-onPrimary/70">{t("owner.scheduleTripSub")}</Text>
          </View>
        </View>
        <IconButton
          icon="arrow-forward"
          accessibilityLabel={t("owner.scheduleTrip")}
          variant="primary"
          size="sm"
          onPress={() => router.push("/owner/schedule")}
          className="bg-card/20"
        />
      </View>
    </Screen>
  );
}

function FilterChipsSingle({
  active,
  label,
  caption,
  onPress,
}: {
  active: boolean;
  label: string;
  caption: string;
  onPress: () => void;
}) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={`${label} ${caption}`}
      className={`flex-1 rounded-base border px-2 py-2 items-center ${
        active ? "bg-primary border-primary" : "bg-card border-border"
      }`}
    >
      <Text className={`text-base-lg font-bold ${active ? "text-onPrimary" : "text-text"}`}>
        {label}
      </Text>
      <Text className={`text-2xs ${active ? "text-onPrimary/70" : "text-secText"}`}>{caption}</Text>
    </Ripple>
  );
}
