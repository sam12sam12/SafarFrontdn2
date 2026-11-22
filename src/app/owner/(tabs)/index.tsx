import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { OwnerLiveTripCard } from "@/components/owner/OwnerLiveTripCard";
import { OwnerTripCard } from "@/components/owner/OwnerTripCard";
import {
  KindFilterSheet,
  RouteFilterSheet,
  StatusFilterSheet,
  type KindFilter,
  type RouteFilter,
  type StatusFilter,
} from "@/components/owner/OwnerTripFilterSheets";
import { OwnerTripsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { Card } from "@/components/ui/Card";
import { DatePickerSheet } from "@/components/ui/DatePickerSheet";
import { Field } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { DEMO_TODAY, formatRelativeDay } from "@/lib/dates";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const KIND_LABEL_KEY: Record<Exclude<KindFilter, "all">, string> = {
  shared: "owner.bookingFilterShared",
  vip: "owner.bookingFilterVip",
};

const STATUS_LABEL_KEY: Record<Exclude<StatusFilter, "all">, string> = {
  "on-road": "owner.filterOnRoad",
  boarding: "owner.filterBoarding",
  scheduled: "owner.filterScheduled",
  full: "owner.filterFull",
  "needs-driver": "owner.filterNeedsDriver",
};

export default function OwnerTripsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [day, setDay] = useState(DEMO_TODAY);
  const [routeFilter, setRouteFilter] = useState<RouteFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [dateSheet, setDateSheet] = useState(false);
  const [routeSheet, setRouteSheet] = useState(false);
  const [kindSheet, setKindSheet] = useState(false);
  const [statusSheet, setStatusSheet] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const tripsQuery = useTrips({
    status: ["scheduled", "boarding", "on-road", "full", "needs-driver", "draft"],
  });
  const driversQuery = useDrivers();
  const { data: trips } = tripsQuery;
  const { data: drivers } = driversQuery;

  const onDay = useMemo(
    () => (trips ?? []).filter((trip) => trip.date === day && trip.status !== "completed"),
    [trips, day],
  );

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return onDay.filter((trip) => {
      if (routeFilter === "to-kabul" && !(trip.from === "Kandahar" && trip.to === "Kabul")) return false;
      if (routeFilter === "to-kandahar" && !(trip.from === "Kabul" && trip.to === "Kandahar")) return false;
      if (kindFilter !== "all" && trip.service !== kindFilter) return false;
      if (statusFilter !== "all" && trip.status !== statusFilter) return false;

      if (!needle) return true;
      const driver = drivers?.find((item) => item.id === trip.driverId);
      return (
        trip.code.toLowerCase().includes(needle) ||
        trip.from.toLowerCase().includes(needle) ||
        trip.to.toLowerCase().includes(needle) ||
        Boolean(driver?.name.toLowerCase().includes(needle))
      );
    });
  }, [onDay, routeFilter, kindFilter, statusFilter, search, drivers]);

  const liveTrip = onDay.find((trip) => trip.status === "on-road");

  const routeChipLabel =
    routeFilter === "all"
      ? t("owner.filterRoute")
      : routeFilter === "to-kabul"
        ? `${t("common.kandahar")} → ${t("common.kabul")}`
        : `${t("common.kabul")} → ${t("common.kandahar")}`;

  const kindChipLabel =
    kindFilter === "all" ? t("owner.filterKind") : t(KIND_LABEL_KEY[kindFilter]);

  const statusChipLabel =
    statusFilter === "all" ? t("owner.filterStatus") : t(STATUS_LABEL_KEY[statusFilter]);

  const header = (
    <View className="pt-3 pb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-primary">
            {t("owner.brandEyebrow")}
          </Text>
          <Text className="text-3xl font-bold text-text mt-1">{t("owner.tripsTitle")}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <IconButton
            icon="search"
            accessibilityLabel={t("owner.searchTrips")}
            variant="white"
            size="md"
            onPress={() => setSearchOpen((open) => !open)}
          />
          <View>
            <IconButton
              icon="notifications-none"
              accessibilityLabel={t("driver.notifications")}
              variant="white"
              size="md"
              onPress={() =>
                showToast(
                  "info",
                  t("owner.newRequestsToast", { count: 4 }),
                  t("owner.newRequestsToastSub"),
                )
              }
            />
            <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error border border-card" />
          </View>
        </View>
      </View>
      {searchOpen ? (
        <Field
          className="mt-3"
          placeholder={t("owner.searchTrips")}
          value={search}
          onChangeText={setSearch}
          icon="search"
        />
      ) : null}
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
    <Screen
      contentClassName="px-4 pb-8"
      footer={
        <View className="items-center py-3">
          <Ripple
            onPress={() => router.push("/owner/schedule")}
            accessibilityLabel={t("owner.scheduleTripCta")}
            className="flex-row items-center gap-2 rounded-full bg-primary px-5 py-3 shadow-button shadow-buttonShadow"
          >
            <Icon name="add" size={19} color={colors.onPrimary} />
            <Text className="text-md font-bold text-onPrimary">{t("owner.scheduleTripCta")}</Text>
          </Ripple>
        </View>
      }
    >
      {header}

      {/* Filters — date, route and status are menus, not inline grids */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 pr-4 items-center"
      >
        <FilterChip
          icon="calendar-today"
          label={formatRelativeDay(day, i18n.language)}
          active
          onPress={() => setDateSheet(true)}
        />
        <FilterChip
          icon="alt-route"
          label={routeChipLabel}
          active={routeFilter !== "all"}
          onPress={() => setRouteSheet(true)}
        />
        <FilterChip
          icon="sell"
          label={kindChipLabel}
          active={kindFilter !== "all"}
          onPress={() => setKindSheet(true)}
        />
        <FilterChip
          icon="filter-list"
          label={statusChipLabel}
          active={statusFilter !== "all"}
          onPress={() => setStatusSheet(true)}
        />
      </ScrollView>

      {liveTrip ? (
        <View className="mt-3">
          <OwnerLiveTripCard
            trip={liveTrip}
            driver={drivers?.find((driver) => driver.id === liveTrip.driverId)}
            onPress={() => router.push({ pathname: "/owner/trip/[id]", params: { id: liveTrip.id } })}
            onCall={() => showToast("info", t("owner.calling"), t("owner.callDriver"))}
          />
        </View>
      ) : null}

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
              onAssign={() => router.push({ pathname: "/owner/trip/[id]", params: { id: trip.id } })}
            />
          ))
        )}
      </View>

      <DatePickerSheet
        visible={dateSheet}
        onClose={() => setDateSheet(false)}
        value={day}
        onChange={setDay}
        minDate="2026-11-01"
      />
      <RouteFilterSheet
        visible={routeSheet}
        onClose={() => setRouteSheet(false)}
        value={routeFilter}
        onSelect={setRouteFilter}
      />
      <KindFilterSheet
        visible={kindSheet}
        onClose={() => setKindSheet(false)}
        value={kindFilter}
        onSelect={setKindFilter}
      />
      <StatusFilterSheet
        visible={statusSheet}
        onClose={() => setStatusSheet(false)}
        value={statusFilter}
        onSelect={setStatusFilter}
      />
    </Screen>
  );
}

function FilterChip({
  icon,
  label,
  active,
  onPress,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={label}
      className={cn(
        "flex-row items-center gap-1.5 rounded-full border px-3.5 py-2",
        active ? "bg-primary border-primary" : "bg-card border-border",
      )}
    >
      <Icon name={icon} size={14} color={active ? colors.onPrimary : colors.secText} />
      <Text
        className={cn(
          "text-base-lg font-semibold whitespace-nowrap",
          active ? "text-onPrimary" : "text-secText",
        )}
      >
        {label}
      </Text>
      <Icon name="expand-more" size={16} color={active ? colors.onPrimary : colors.secText} />
    </Ripple>
  );
}
