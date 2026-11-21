import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { DriverAvatar } from "@/components/driver/DriverAvatar";
import { DriverHeroCard, DriverScheduleCard } from "@/components/driver/DriverTripCards";
import { DriverTripsSkeleton } from "@/components/skeletons/DriverSkeletons";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import type { Trip } from "@/lib/db/types";
import { useDriver } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const DRIVER_ID = "d-wali";
type TabKey = "upcoming" | "completed" | "cancelled";

const UPCOMING_WINDOW_END = "2026-11-25";

export default function DriverTripsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("upcoming");

  const driverQuery = useDriver(DRIVER_ID);
  const tripsQuery = useTrips();
  const { data: driver } = driverQuery;
  const { data: trips, isLoading } = tripsQuery;

  const mine = useMemo(
    () => (trips ?? []).filter((trip) => trip.driverId === DRIVER_ID),
    [trips],
  );

  const nextTrip = useMemo(() => {
    const active = mine.filter((trip) => trip.status !== "completed");
    return (
      active.find((trip) => trip.status === "boarding") ??
      [...active].sort(sortByDeparture)[0]
    );
  }, [mine]);

  const upcoming = useMemo(
    () =>
      mine
        .filter(
          (trip) =>
            trip.id !== nextTrip?.id &&
            trip.status !== "completed" &&
            trip.date <= UPCOMING_WINDOW_END,
        )
        .sort(sortByDeparture),
    [mine, nextTrip],
  );

  const completed = useMemo(
    () => mine.filter((trip) => trip.status === "completed"),
    [mine],
  );

  const openTrip = (trip: Trip) =>
    router.push({ pathname: "/driver/trip/[id]", params: { id: trip.id } });

  const metaDate = nextTrip
    ? `${nextTrip.dateLabel.split(" ")[0]}, ${nextTrip.dateLabel.split(" ").slice(1).join(" ")}`
    : "";

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    {
      key: "upcoming",
      label: t("driver.tabs.upcoming", { count: upcoming.length }),
      count: upcoming.length,
    },
    { key: "completed", label: t("driver.tabs.completed") },
    { key: "cancelled", label: t("driver.tabs.cancelled") },
  ];

  const visible =
    tab === "upcoming" ? upcoming : tab === "completed" ? completed : [];

  return (
    <Screen contentClassName="pb-8">
      {isLoading || !driver ? (
        <DriverTripsSkeleton />
      ) : (
        <View className="px-4">
          <View className="flex-row items-center justify-between py-2 border-b border-border">
            <View className="flex-row items-center gap-1.5 rounded-full bg-successSoft border border-success/20 px-2.5 py-1">
              <View className="w-1.5 h-1.5 rounded-full bg-success" />
              <Text className="text-2xs font-semibold text-success">
                {t("driver.status.gps")}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Icon name="cloud-done" size={14} color={colors.primary} />
              <Text className="text-2xs font-semibold text-secText">
                {t("driver.status.synced")}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 py-3.5">
            <DriverAvatar initials={driver.initials} size={50} online={driver.online} />
            <View className="flex-1">
              <Text className="text-2xs font-bold uppercase tracking-[0.7px] text-muted" numberOfLines={1}>
                {metaDate} • {driver.base.toUpperCase()} BASE
              </Text>
              <Text className="text-lg font-bold text-text mt-0.5" numberOfLines={1}>
                {t("driver.salaam", { name: driver.name })}
              </Text>
            </View>
            <Ripple
              onPress={() =>
                showToast("info", t("driver.notifications"), t("driver.notificationsBody"))
              }
              accessibilityLabel={t("driver.notifications")}
              className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
            >
              <Icon name="notifications-none" size={21} color={colors.text} />
              <View className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-warning border border-card" />
            </Ripple>
          </View>

          {nextTrip ? (
            <DriverHeroCard trip={nextTrip} driver={driver} onPress={() => openTrip(nextTrip)} />
          ) : null}

          <View className="flex-row items-center bg-disable rounded-full p-1 mt-3">
            {tabs.map((item) => {
              const active = tab === item.key;
              return (
                <Ripple
                  key={item.key}
                  onPress={() => setTab(item.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={item.label}
                  className={cn(
                    "flex-1 rounded-full py-1.5 items-center justify-center",
                    active && "bg-card shadow-sm shadow-shadowColor",
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm font-semibold",
                      active ? "text-primary" : "text-secText",
                    )}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </Ripple>
              );
            })}
          </View>

          <View className="gap-3 mt-3">
            {visible.length === 0 ? (
              <Card className="items-center py-8">
                <View className="w-11 h-11 rounded-full bg-primarySoft items-center justify-center">
                  <Icon name="event-busy" size={22} color={colors.primary} />
                </View>
                <Text className="text-base-lg font-bold text-text mt-3">
                  {t("driver.noTrips")}
                </Text>
                <Text className="text-sm text-muted text-center mt-1">
                  {t("driver.noTripsSub")}
                </Text>
              </Card>
            ) : (
              visible.map((trip) => (
                <DriverScheduleCard key={trip.id} trip={trip} onPress={() => openTrip(trip)} />
              ))
            )}
          </View>
        </View>
      )}
    </Screen>
  );
}

function sortByDeparture(a: Trip, b: Trip) {
  return (
    a.date.localeCompare(b.date) ||
    a.departTime.localeCompare(b.departTime) ||
    a.code.localeCompare(b.code)
  );
}
