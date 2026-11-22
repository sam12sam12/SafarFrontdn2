import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { FilterChips } from "@/components/ui/FilterChips";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { DriverRow } from "@/components/owner/DriverRow";
import { OwnerDriversSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

export default function OwnerDriversScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const driversQuery = useDrivers();
  const tripsQuery = useTrips();
  const { data: drivers } = driversQuery;
  const { data: trips } = tripsQuery;

  const counts = useMemo(() => {
    const all = drivers ?? [];
    return {
      all: all.length,
      onRoad: all.filter((driver) => driver.status === "on-road").length,
      tripToday: all.filter((driver) => driver.status === "trip-today").length,
      free: all.filter((driver) => driver.status === "free").length,
      rest: all.filter((driver) => driver.status === "rest").length,
      cars: new Set(all.map((driver) => driver.plate).filter((plate) => plate !== "—")).size,
    };
  }, [drivers]);

  const FILTERS = [
    { label: `${t("owner.filterAll")} · ${counts.all}`, value: "all" },
    { label: `${t("owner.countOnRoad")} · ${counts.onRoad}`, value: "on-road" },
    { label: `${t("owner.countTripToday")} · ${counts.tripToday}`, value: "trip-today" },
    { label: `${t("owner.countFree")} · ${counts.free}`, value: "free" },
    { label: `${t("owner.countRest")} · ${counts.rest}`, value: "rest" },
  ];

  const visible = useMemo(
    () =>
      (drivers ?? []).filter((driver) => {
        if (filter !== "all" && driver.status !== filter) return false;
        if (!search.trim()) return true;
        const needle = search.trim().toLowerCase();
        return (
          driver.name.toLowerCase().includes(needle) ||
          driver.plate.toLowerCase().includes(needle)
        );
      }),
    [drivers, filter, search],
  );

  const unassigned = (trips ?? []).find((trip) => trip.status === "needs-driver");
  const freeInCity = (drivers ?? []).filter(
    (driver) => driver.status === "free" && driver.base === unassigned?.from,
  );

  const header = (
    <View className="pt-3 pb-3">
      <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-primary">
        {t("owner.brandEyebrow")}
      </Text>
      <View className="flex-row items-end justify-between mt-1">
        <Text className="text-3xl font-bold text-text">{t("owner.driversTitle")}</Text>
        <Text className="text-sm text-secText">
          {t("owner.driversCars", { drivers: counts.all, cars: counts.cars })}
        </Text>
      </View>
    </View>
  );

  if (driversQuery.isLoading) {
    return (
      <Screen contentClassName="px-4 pb-8">
        {header}
        <OwnerDriversSkeleton />
      </Screen>
    );
  }

  return (
    <Screen
      contentClassName="px-4 pb-8"
      refreshing={driversQuery.isRefetching || tripsQuery.isRefetching}
      onRefresh={() => {
        driversQuery.refetch();
        tripsQuery.refetch();
      }}
      footer={
        <View className="items-end px-4 py-3">
          <Ripple
            onPress={() => router.push("/owner/add-driver")}
            accessibilityLabel={t("owner.addDriverCta")}
            className="flex-row items-center gap-1.5 rounded-full bg-primary px-4 py-3 shadow-button shadow-buttonShadow"
          >
            <Icon name="add" size={18} color={colors.onPrimary} />
            <Text className="text-base-lg font-bold text-onPrimary">{t("owner.addDriverCta")}</Text>
          </Ripple>
        </View>
      }
    >
      {header}

      <View className="flex-row items-center rounded-lg bg-primary px-2 py-3 shadow-card shadow-shadowColor">
        {[
          { label: t("owner.countOnRoad"), value: counts.onRoad },
          { label: t("owner.countTripToday"), value: counts.tripToday },
          { label: t("owner.countFree"), value: counts.free },
          { label: t("owner.countRest"), value: counts.rest },
        ].map((item, index) => (
          <View key={item.label} className="flex-1 items-center">
            <Text className="text-xl font-bold text-onPrimary">{item.value}</Text>
            <Text className="text-2xs text-onPrimary/75 mt-0.5 text-center" numberOfLines={1}>
              {item.label}
            </Text>
            {index < 3 ? (
              <View className="absolute right-0 top-1 bottom-1 w-[1px] bg-onPrimary/20" />
            ) : null}
          </View>
        ))}
      </View>

      {unassigned ? (
        <View className="mt-2.5 flex-row items-center gap-2.5 rounded-lg border border-warning/40 bg-warningSoft px-3 py-2.5">
          <Icon name="error-outline" size={17} color={colors.warning} />
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
              {t("owner.noDriverForTrip", {
                time: `${unassigned.departTime} ${unassigned.departPeriod}`,
                from: unassigned.from,
                to: unassigned.to,
              })}
            </Text>
            {freeInCity.length > 0 ? (
              <Text className="text-sm text-secText" numberOfLines={1}>
                {t("owner.freeDriversIn", {
                  names: freeInCity
                    .slice(0, 2)
                    .map((driver) => driver.name.replace("Ustad ", ""))
                    .join(` ${t("common.and")} `),
                  city: unassigned.from,
                })}
              </Text>
            ) : null}
          </View>
          <Ripple
            onPress={() =>
              router.push({ pathname: "/owner/trip/[id]", params: { id: unassigned.id } })
            }
            accessibilityLabel={t("owner.assign")}
            className="px-1 py-1"
          >
            <Text className="text-base-lg font-bold text-primary">{t("owner.assign")}</Text>
          </Ripple>
        </View>
      ) : null}

      <Field
        className="mt-3"
        placeholder={t("owner.searchDriver")}
        value={search}
        onChangeText={setSearch}
        icon="search"
      />

      <View className="mt-3">
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </View>

      <View className="gap-2.5 mt-3">
        {visible.map((driver) => (
          <DriverRow
            key={driver.id}
            driver={driver}
            onPress={() =>
              router.push({ pathname: "/owner/driver/[id]", params: { id: driver.id } })
            }
          />
        ))}
      </View>
    </Screen>
  );
}
