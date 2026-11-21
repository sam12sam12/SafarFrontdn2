import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { OwnerLiveTripCard } from "@/components/owner/OwnerLiveTripCard";
import { OwnerTripCard } from "@/components/owner/OwnerTripCard";
import { OwnerTripsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { FilterChips } from "@/components/ui/FilterChips";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { formatNumber, MOCK_TODAY } from "@/lib/format";
import { colors } from "@/utils/theme";

const DAYS = ["2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23"];

export default function OwnerTripsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [day, setDay] = useState(MOCK_TODAY);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const tripsQuery = useTrips({
    status: ["scheduled", "boarding", "on-road", "full", "needs-driver", "draft"],
  });
  const driversQuery = useDrivers();
  const { data: trips } = tripsQuery;
  const { data: drivers } = driversQuery;

  const today = useMemo(
    () => (trips ?? []).filter((trip) => trip.date === day && trip.status !== "completed"),
    [trips, day],
  );

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return today.filter((trip) => {
      if (filter === "to-kabul" && !(trip.from === "Kandahar" && trip.to === "Kabul")) return false;
      if (filter === "to-kandahar" && !(trip.from === "Kabul" && trip.to === "Kandahar")) return false;
      if (!needle) return true;
      const driver = drivers?.find((item) => item.id === trip.driverId);
      return (
        trip.code.toLowerCase().includes(needle) ||
        trip.from.toLowerCase().includes(needle) ||
        trip.to.toLowerCase().includes(needle) ||
        Boolean(driver?.name.toLowerCase().includes(needle))
      );
    });
  }, [today, filter, search, drivers]);

  const onRoadTrips = today.filter((trip) => trip.status === "on-road");
  const liveTrip = onRoadTrips[0];

  const seatsSold = today.reduce((sum, trip) => sum + trip.seatsBooked, 0);
  const seatsTotal = today.reduce((sum, trip) => sum + trip.seatsTotal, 0);
  const revenue = today.reduce((sum, trip) => sum + trip.seatsBooked * trip.price, 0);
  const carsOnRoad = onRoadTrips.length;
  const carsTotal = drivers?.length ?? 0;

  const FILTERS = [
    { label: `${t("owner.filterAll")} · ${today.length}`, value: "all" },
    {
      label: `${t("common.kandahar")} → ${t("common.kabul")} · ${today.filter((trip) => trip.from === "Kandahar").length}`,
      value: "to-kabul",
    },
    {
      label: `${t("common.kabul")} → ${t("common.kandahar")} · ${today.filter((trip) => trip.from === "Kabul").length}`,
      value: "to-kandahar",
    },
  ];

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

      <View className="flex-row gap-2.5">
        <Card className="flex-1 p-3.5 gap-1">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
            {t("owner.tripsToday")}
          </Text>
          <Text className="text-2xl font-bold text-text">{today.length}</Text>
        </Card>
        <Card className="flex-1 p-3.5 gap-1">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
            {t("owner.statSeatsSold")}
          </Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-text">{seatsSold}</Text>
            <Text className="text-sm font-semibold text-secText">/ {seatsTotal}</Text>
          </View>
        </Card>
      </View>
      <View className="flex-row gap-2.5 mt-2.5">
        <Card className="flex-1 p-3.5 gap-1">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
            {t("owner.carsOnRoad")}
          </Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-text">{carsOnRoad}</Text>
            <Text className="text-sm font-semibold text-secText">/ {carsTotal}</Text>
          </View>
        </Card>
        <Card className="flex-1 p-3.5 gap-1">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
            {t("owner.revenueToday")}
          </Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-text">{formatNumber(revenue)}</Text>
            <Text className="text-2xs font-semibold text-secText">{t("common.afn")}</Text>
          </View>
        </Card>
      </View>

      <View className="flex-row gap-1.5 mt-4">
        {DAYS.map((item) => {
          const active = day === item;
          const date = new Date(`${item}T00:00:00`);
          const weekday = new Intl.DateTimeFormat(
            i18n.language === "ps" ? "ps-AF" : i18n.language === "fa" ? "fa-AF" : "en-US",
            { weekday: "short" },
          ).format(date);
          return (
            <Ripple
              key={item}
              onPress={() => setDay(item)}
              accessibilityLabel={`${weekday} ${date.getDate()}`}
              accessibilityState={{ selected: active }}
              className={`flex-1 items-center rounded-base border py-2 ${
                active ? "bg-primary border-primary" : "bg-card border-border"
              }`}
            >
              <Text
                className={`text-2xs font-bold uppercase ${
                  active ? "text-onPrimary/80" : "text-muted"
                }`}
              >
                {weekday}
              </Text>
              <Text className={`text-md font-bold mt-0.5 ${active ? "text-onPrimary" : "text-text"}`}>
                {date.getDate()}
              </Text>
            </Ripple>
          );
        })}
      </View>

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
              onAssign={() => router.push({ pathname: "/owner/trip/[id]", params: { id: trip.id } })}
            />
          ))
        )}
      </View>
    </Screen>
  );
}
