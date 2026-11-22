import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { RoutePicker } from "@/components/passenger/RoutePicker";
import { SearchTripCard } from "@/components/passenger/SearchTripCard";
import { SeatsPicker } from "@/components/passenger/SeatsPicker";
import { HomeSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon, type IconName } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { seatAvailability } from "@/lib/db";
import type { City, ServiceType } from "@/lib/db/types";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type SortValue = "earliest" | "price" | "ac";
type ServiceFilter = ServiceType | "all";

const SORTS: { labelKey: string; value: SortValue; icon: IconName }[] = [
  { labelKey: "search.earliest", value: "earliest", icon: "bolt" },
  { labelKey: "search.lowestPrice", value: "price", icon: "payments" },
  { labelKey: "search.acDeluxe", value: "ac", icon: "ac-unit" },
];

export default function PassengerHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [from, setFrom] = useState<City>("Kandahar");
  const [to, setTo] = useState<City>("Kabul");
  const [service, setService] = useState<ServiceFilter>("all");
  const [seats, setSeats] = useState(1);
  const [sort, setSort] = useState<SortValue>("earliest");
  const [routePickerOpen, setRoutePickerOpen] = useState(false);
  const [seatsPickerOpen, setSeatsPickerOpen] = useState(false);

  const [primaryDark, primary, primaryLight] = useCSSVariable([
    "--color-primaryDark",
    "--color-primary",
    "--color-primaryLight",
  ]) as string[];

  const tripsQuery = useTrips({ from, to });
  const driversQuery = useDrivers();
  const { data: trips, isLoading, isRefetching, refetch } = tripsQuery;
  const { data: drivers } = driversQuery;

  const SERVICE_FILTERS = [
    { label: t("owner.filterAll"), value: "all" as ServiceFilter },
    { label: t("home.shared"), value: "shared" as ServiceFilter },
    { label: "VIP", value: "vip" as ServiceFilter },
  ];

  const results = useMemo(() => {
    // The home feed shows every departure on the corridor: shared and VIP,
    // today and later, sold out and already on the road. Live trips lead it.
    const items = (trips ?? []).filter(
      (trip) =>
        trip.status !== "draft" &&
        trip.status !== "needs-driver" &&
        trip.status !== "completed" &&
        (service === "all" || trip.service === service),
    );
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
  }, [trips, sort, service]);

  const openSeats = (tripId: string) => {
    router.push({
      pathname: "/passenger/seats/[id]",
      params: { id: tripId, seats: String(seats) },
    });
  };

  const routeLabel = `${t(`common.${from.toLowerCase()}`)} → ${t(`common.${to.toLowerCase()}`)}`;

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
          {/* Banner — a compact, purely descriptive brand strip (not tied to the
              direction filter below it) */}
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
                  onPress={() => router.push({ pathname: "/passenger/search", params: { from, to } })}
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

          {/* Filters — route, service and seats all shape the result set below,
              in a single scrollable row */}
          <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mt-4 mb-2">
            {t("home.filtersLabel")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 pr-4 items-center"
          >
            <Ripple
              onPress={() => setRoutePickerOpen(true)}
              accessibilityLabel={t("home.chooseRoute")}
              className="flex-row items-center gap-1 rounded-full border border-border bg-card px-3.5 py-2"
            >
              <Text className="text-base-lg font-semibold text-text whitespace-nowrap">
                {routeLabel}
              </Text>
              <Icon name="expand-more" size={16} color={colors.secText} />
            </Ripple>

            <View className="w-px h-5 bg-border" />

            {SERVICE_FILTERS.map((option) => {
              const active = option.value === service;
              return (
                <Ripple
                  key={option.value}
                  onPress={() => setService(option.value)}
                  accessibilityRole="tab"
                  accessibilityLabel={option.label}
                  className={cn(
                    "rounded-full px-3.5 py-2 border",
                    active ? "bg-text border-text" : "bg-card border-border",
                  )}
                >
                  <Text
                    className={cn(
                      "text-base-lg font-semibold whitespace-nowrap",
                      active ? "text-onPrimary" : "text-secText",
                    )}
                  >
                    {option.label}
                  </Text>
                </Ripple>
              );
            })}

            <Ripple
              onPress={() => setSeatsPickerOpen(true)}
              accessibilityLabel={t("home.seatsTitle")}
              className="flex-row items-center gap-1 rounded-full border border-border bg-card px-3.5 py-2"
            >
              <Icon name="airline-seat-recline-normal" size={14} color={colors.secText} />
              <Text className="text-base-lg font-semibold text-text">
                {seats} {t("common.seats")}
              </Text>
              <Icon name="expand-more" size={16} color={colors.secText} />
            </Ripple>

            <View className="w-px h-5 bg-border" />

            {SORTS.map((option) => {
              const active = option.value === sort;
              return (
                <Ripple
                  key={option.value}
                  onPress={() => setSort(option.value)}
                  accessibilityRole="tab"
                  accessibilityLabel={t(option.labelKey)}
                  className={cn(
                    "flex-row items-center gap-1.5 rounded-full border px-3.5 py-2",
                    active
                      ? "bg-primary border-primary shadow-button shadow-buttonShadow"
                      : "bg-card border-border",
                  )}
                >
                  <Icon
                    name={option.icon}
                    size={14}
                    color={active ? colors.onPrimary : colors.secText}
                  />
                  <Text
                    className={cn(
                      "text-base-lg font-semibold whitespace-nowrap",
                      active ? "text-onPrimary" : "text-secText",
                    )}
                  >
                    {t(option.labelKey)}
                  </Text>
                </Ripple>
              );
            })}
          </ScrollView>

          {/* Trips — same cards as the Search Trips screen */}
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
              <Text className="text-base-lg font-bold text-text">
                {t("search.guaranteeTitle")}
              </Text>
              <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
                {t("search.guaranteeSub")}
              </Text>
            </View>
          </Card>
        </View>
      )}

      <RoutePicker
        visible={routePickerOpen}
        onClose={() => setRoutePickerOpen(false)}
        from={from}
        onSelect={(nextFrom, nextTo) => {
          setFrom(nextFrom);
          setTo(nextTo);
        }}
      />
      <SeatsPicker
        visible={seatsPickerOpen}
        onClose={() => setSeatsPickerOpen(false)}
        value={seats}
        onChange={setSeats}
      />
    </Screen>
  );
}
