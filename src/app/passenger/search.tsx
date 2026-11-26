import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { SearchTripCard } from "@/components/passenger/SearchTripCard";
import { SearchResultsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { seatAvailability } from "@/lib/db";
import type { City, ServiceType } from "@/lib/db/types";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type FilterValue = "earliest" | "price" | "ac";

const FILTERS: { labelKey: string; value: FilterValue; icon: IconName }[] = [
  { labelKey: "search.earliest", value: "earliest", icon: "bolt" },
  { labelKey: "search.lowestPrice", value: "price", icon: "payments" },
  { labelKey: "search.acDeluxe", value: "ac", icon: "ac-unit" },
];

export default function SearchTripsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{
    from?: string;
    to?: string;
    service?: string;
    seats?: string;
  }>();

  const from = (params.from as City) ?? "Kandahar";
  const to = (params.to as City) ?? "Kabul";
  const service = (params.service as ServiceType) ?? "shared";
  const seats = Math.min(Math.max(Number(params.seats ?? 1) || 1, 1), 4);

  const [filter, setFilter] = useState<FilterValue>("earliest");

  const tripsQuery = useTrips({ from, to, service });
  const driversQuery = useDrivers();
  const { data: trips, isLoading } = tripsQuery;
  const { data: drivers } = driversQuery;

  const results = useMemo(() => {
    const items = (trips ?? []).filter((trip) => {
      // Only open departures that can seat the whole party.
      if (trip.status !== "scheduled" || seatAvailability(trip.id) < seats) return false;
      // "AC Deluxe" is the VIP whole-car class — the only deluxe mode on this corridor.
      if (filter === "ac" && trip.service !== "vip") return false;
      return true;
    });
    return filter === "price"
      ? [...items].sort((a, b) => a.price - b.price)
      : [...items].sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            a.departTime.localeCompare(b.departTime) ||
            a.code.localeCompare(b.code),
        );
  }, [trips, filter, seats]);

  const openSeats = (tripId: string) => {
    router.push({
      pathname: "/passenger/seats/[id]",
      params: { id: tripId, seats: String(seats) },
    });
  };

  const showEmpty = results.length === 0;

  return (
    <Screen
      contentClassName="pb-8"
      refreshing={tripsQuery.isRefetching || driversQuery.isRefetching}
      onRefresh={() => {
        tripsQuery.refetch();
        driversQuery.refetch();
      }}
    >
      <AppHeader title={t("search.title")} />

      {/* what was searched — direction + party size */}
      <View className="px-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-sm font-bold text-text">{t(`common.${from.toLowerCase()}`)}</Text>
          <Icon name="arrow-forward" size={13} color={colors.secText} />
          <Text className="text-sm font-bold text-text">{t(`common.${to.toLowerCase()}`)}</Text>
          <Text className="text-xs text-secText">
            · {seats} {t("common.seats")}
          </Text>
        </View>
        <Text className="text-2xs font-semibold text-muted">
          {t("search.results", { count: results.length })}
        </Text>
      </View>

      <View className="px-4 mt-3">
        <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mb-2.5">
          {t("search.quickFilters")}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 pr-4"
        >
          {FILTERS.map((option) => {
            const active = option.value === filter;
            return (
              <Ripple
                key={option.value}
                onPress={() => setFilter(option.value)}
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
                    "text-base-lg font-semibold",
                    active ? "text-onPrimary" : "text-secText",
                  )}
                >
                  {t(option.labelKey)}
                </Text>
              </Ripple>
            );
          })}
        </ScrollView>

      </View>

      <View className="px-4 gap-3 mt-3">
        {isLoading ? (
          <SearchResultsSkeleton />
        ) : showEmpty ? (
          <Card className="py-2">
            <EmptyState
              icon="search-off"
              title={t("search.emptyTitle")}
              message={t("search.emptyMessage")}
              actionLabel={filter === "ac" ? t("common.clearAll") : undefined}
              onAction={filter === "ac" ? () => setFilter("earliest") : undefined}
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
                router.push({
                  pathname: "/passenger/trip/[id]",
                  params: { id: trip.id },
                })
              }
              onSelect={() => openSeats(trip.id)}
            />
          ))
        )}

        <Card flat className="rounded-lg bg-disable border-transparent flex-row items-center gap-3 p-3.5">
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
    </Screen>
  );
}
