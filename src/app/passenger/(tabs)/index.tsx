import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { SearchTripCard } from "@/components/passenger/SearchTripCard";
import { SeatsPicker } from "@/components/passenger/SeatsPicker";
import { HomeSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterTriggerChip } from "@/components/ui/FilterTriggerChip";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { SelectMenuSheet, type SelectOption } from "@/components/ui/SelectMenuSheet";
import {
  WhenFilterSheet,
  timeValueToMinutes,
  type WhenValue,
} from "@/components/ui/WhenFilterSheet";
import { seatAvailability } from "@/lib/db";
import type { City, ServiceType } from "@/lib/db/types";
import { formatRelativeDay, isPastDay, isSameDay } from "@/lib/dates";
import { to24Hour } from "@/lib/format";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

type SortValue = "earliest" | "price";
type ServiceFilter = ServiceType | "all";
type RouteFilter = "all" | "to-kabul" | "to-kandahar";

function tripDepartMinutes(time: string, period: string) {
  const [h, m] = to24Hour(time, period).split(":").map(Number);
  return h * 60 + m;
}

export default function PassengerHomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [route, setRoute] = useState<RouteFilter>("all");
  const [service, setService] = useState<ServiceFilter>("all");
  const [seats, setSeats] = useState(1);
  const [when, setWhen] = useState<WhenValue>({ date: null, time: null });
  const [sort, setSort] = useState<SortValue>("earliest");

  const [routeSheet, setRouteSheet] = useState(false);
  const [serviceSheet, setServiceSheet] = useState(false);
  const [seatsSheet, setSeatsSheet] = useState(false);
  const [whenSheet, setWhenSheet] = useState(false);
  const [sortSheet, setSortSheet] = useState(false);

  const [primaryDark, primary, primaryLight] = useCSSVariable([
    "--color-primaryDark",
    "--color-primary",
    "--color-primaryLight",
  ]) as string[];

  const tripsQuery = useTrips();
  const driversQuery = useDrivers();
  const { data: trips, isLoading, isRefetching, refetch } = tripsQuery;
  const { data: drivers } = driversQuery;

  // The route filter doubles as the from/to used when navigating into search.
  const [navFrom, navTo]: [City, City] =
    route === "to-kandahar" ? ["Kabul", "Kandahar"] : ["Kandahar", "Kabul"];

  const ROUTE_OPTIONS: SelectOption<RouteFilter>[] = [
    { value: "all", label: t("home.allDirections"), icon: "swap-horiz" },
    { value: "to-kabul", label: `${t("common.kandahar")} → ${t("common.kabul")}`, icon: "arrow-forward" },
    { value: "to-kandahar", label: `${t("common.kabul")} → ${t("common.kandahar")}`, icon: "arrow-forward" },
  ];

  const SERVICE_OPTIONS: SelectOption<ServiceFilter>[] = [
    { value: "all", label: t("home.allServices"), icon: "filter-list" },
    { value: "shared", label: t("home.shared"), icon: "groups" },
    { value: "vip", label: "VIP", icon: "star" },
  ];

  const SORT_OPTIONS: SelectOption<SortValue>[] = [
    { value: "earliest", label: t("search.earliest"), icon: "bolt" },
    { value: "price", label: t("search.lowestPrice"), icon: "payments" },
  ];

  const results = useMemo(() => {
    const afterMinutes = timeValueToMinutes(when.time);
    const items = (trips ?? []).filter((trip) => {
      if (trip.status === "draft" || trip.status === "needs-driver" || trip.status === "completed")
        return false;
      if (isPastDay(trip.date)) return false; // only now / future, never past
      if (route === "to-kabul" && !(trip.from === "Kandahar" && trip.to === "Kabul")) return false;
      if (route === "to-kandahar" && !(trip.from === "Kabul" && trip.to === "Kandahar")) return false;
      if (service !== "all" && trip.service !== service) return false;
      if (seatAvailability(trip.id) < seats) return false;
      if (when.date && !isSameDay(trip.date, when.date)) return false;
      if (afterMinutes !== null && tripDepartMinutes(trip.departTime, trip.departPeriod) < afterMinutes)
        return false;
      return true;
    });
    const liveRank = (status: string) =>
      status === "on-road" ? 0 : status === "boarding" ? 1 : 2;
    return [...items].sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : liveRank(a.status) - liveRank(b.status) ||
          a.date.localeCompare(b.date) ||
          a.departTime.localeCompare(b.departTime) ||
          a.code.localeCompare(b.code),
    );
  }, [trips, sort, route, service, seats, when]);

  const openSeats = (tripId: string) => {
    router.push({
      pathname: "/passenger/seats/[id]",
      params: { id: tripId, seats: String(seats) },
    });
  };

  const routeLabel =
    route === "all"
      ? t("home.routeTitle")
      : route === "to-kabul"
        ? `${t("common.kandahar")} → ${t("common.kabul")}`
        : `${t("common.kabul")} → ${t("common.kandahar")}`;
  const serviceLabel =
    service === "all" ? t("home.serviceTitle") : service === "vip" ? "VIP" : t("home.shared");
  const sortLabel = sort === "price" ? t("search.lowestPrice") : t("search.earliest");
  const whenActive = when.date !== null || when.time !== null;
  const timeText = when.time ? `${when.time.time} ${when.time.period}` : null;
  const whenLabel = !whenActive
    ? t("home.whenTitle")
    : when.date && timeText
      ? `${formatRelativeDay(when.date, i18n.language)} · ${timeText}`
      : when.date
        ? formatRelativeDay(when.date, i18n.language)
        : t("home.afterTime", { time: timeText });

  return (
    <Screen
      refreshing={isRefetching || driversQuery.isRefetching}
      onRefresh={() => {
        refetch();
        driversQuery.refetch();
      }}
      contentClassName="pb-8"
    >
      {/* Brand bar */}
      <View className="bg-card border-b border-border px-4 pb-3 flex-row items-center justify-between" style={{ paddingTop: 6 }}>
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-lg bg-primary items-center justify-center">
            <Icon name="route" size={20} color="#FFFFFF" />
          </View>
          <Text className="text-lg font-bold text-text">Express Highway</Text>
        </View>
        <IconButton
          icon="notifications-none"
          accessibilityLabel={t("driver.notifications")}
          variant="white"
          size="sm"
        />
      </View>

      {isLoading && !trips ? (
        <HomeSkeleton />
      ) : (
        <View className="px-4">
          {/* Banner */}
          <LinearGradient
            colors={[primaryDark, primary, primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mt-3 overflow-hidden"
            style={{ borderRadius: 18 }}
          >
            <View className="flex-row items-center">
              <View className="flex-1 p-4 gap-1.5">
                <View className="flex-row items-center gap-1.5 self-start rounded-full bg-card/15 border border-card/20 px-2.5 py-1">
                  <Icon name="directions-car" size={11} color="#FFFFFF" />
                  <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-onPrimary">
                    {t("common.directExpress")}
                  </Text>
                </View>
                <Text className="text-xl font-bold text-onPrimary leading-6 mt-1">
                  {t("home.bannerTitle")}
                </Text>
                <Text className="text-xs text-onPrimary/75" numberOfLines={1}>
                  {t("home.fleetSubtitle")}
                </Text>
                <Ripple
                  onPress={() =>
                    router.push({ pathname: "/passenger/search", params: { from: navFrom, to: navTo } })
                  }
                  accessibilityLabel={t("common.allTrips")}
                  className="self-start flex-row items-center gap-1.5 rounded-full bg-card px-3.5 py-2 mt-2 shadow-button shadow-buttonShadow"
                >
                  <Text className="text-sm font-bold text-primary">{t("common.allTrips")}</Text>
                  <Icon name="arrow-forward" size={13} color={primary} />
                </Ripple>
              </View>

              <View style={{ width: 132, height: 132 }}>
                <Image
                  source={require("@/assets/images/car-hero.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>
            </View>
          </LinearGradient>

          {/* Filters */}
          <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mt-4 mb-2">
            {t("home.filtersLabel")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pr-4 items-center"
          >
            <FilterTriggerChip icon="swap-horiz" label={routeLabel} active={route !== "all"} onPress={() => setRouteSheet(true)} />
            <FilterTriggerChip icon="sell" label={serviceLabel} active={service !== "all"} onPress={() => setServiceSheet(true)} />
            <FilterTriggerChip
              icon="airline-seat-recline-normal"
              label={`${seats} ${t("common.seats")}`}
              active={seats > 1}
              onPress={() => setSeatsSheet(true)}
            />
            <FilterTriggerChip icon="event" label={whenLabel} active={whenActive} onPress={() => setWhenSheet(true)} />
            <FilterTriggerChip icon="sort" label={sortLabel} active={sort !== "earliest"} onPress={() => setSortSheet(true)} />
          </ScrollView>

          {/* Trips */}
          <View className="gap-3 mt-3">
            {results.length === 0 ? (
              <Card className="py-2">
                <EmptyState
                  icon="search-off"
                  title={t("search.emptyTitle")}
                  message={t("search.emptyMessage")}
                />
              </Card>
            ) : (
              results.map((trip) => (
                <SearchTripCard
                  key={trip.id}
                  trip={trip}
                  driver={drivers?.find((driver) => driver.id === trip.driverId)}
                  seatsAvailable={seatAvailability(trip.id)}
                  onOpen={() =>
                    router.push({ pathname: "/passenger/trip/[id]", params: { id: trip.id } })
                  }
                  onSelect={() => openSeats(trip.id)}
                />
              ))
            )}
          </View>

          <Card flat className="mt-3 rounded-lg bg-disable border-transparent flex-row items-center gap-3 p-3.5">
            <View className="w-10 h-10 rounded-full bg-text items-center justify-center">
              <Icon name="account-balance" size={19} color={colors.onPrimary} />
            </View>
            <View className="flex-1">
              <Text className="text-base-lg font-bold text-text">{t("search.guaranteeTitle")}</Text>
              <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
                {t("search.guaranteeSub")}
              </Text>
            </View>
          </Card>
        </View>
      )}

      <SelectMenuSheet
        visible={routeSheet}
        onClose={() => setRouteSheet(false)}
        title={t("home.routeTitle")}
        options={ROUTE_OPTIONS}
        value={route}
        onSelect={setRoute}
        clearTo="all"
      />
      <SelectMenuSheet
        visible={serviceSheet}
        onClose={() => setServiceSheet(false)}
        title={t("home.serviceTitle")}
        options={SERVICE_OPTIONS}
        value={service}
        onSelect={setService}
        clearTo="all"
      />
      <SeatsPicker
        visible={seatsSheet}
        onClose={() => setSeatsSheet(false)}
        value={seats}
        onChange={setSeats}
      />
      <WhenFilterSheet
        visible={whenSheet}
        onClose={() => setWhenSheet(false)}
        value={when}
        onApply={setWhen}
      />
      <SelectMenuSheet
        visible={sortSheet}
        onClose={() => setSortSheet(false)}
        title={t("home.sortTitle")}
        options={SORT_OPTIONS}
        value={sort}
        onSelect={setSort}
        clearTo="earliest"
      />
    </Screen>
  );
}
