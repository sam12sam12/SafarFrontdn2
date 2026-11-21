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
import { colors } from "@/utils/theme";

export default function OwnerDriversScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const FILTERS = [
    { label: t("owner.filterAll"), value: "all" },
    { label: t("owner.countOnRoad"), value: "on-road" },
    { label: t("owner.countTripToday"), value: "trip-today" },
    { label: t("owner.countFree"), value: "free" },
    { label: t("owner.countRest"), value: "rest" },
  ];

  const driversQuery = useDrivers();
  const { data: drivers } = driversQuery;

  const counts = useMemo(() => {
    const all = drivers ?? [];
    return {
      onRoad: all.filter((driver) => driver.status === "on-road").length,
      tripToday: all.filter((driver) => driver.status === "trip-today").length,
      free: all.filter((driver) => driver.status === "free").length,
      rest: all.filter((driver) => driver.status === "rest").length,
      permits: all.filter(
        (driver) => driver.permitEndsInDays !== undefined && driver.permitEndsInDays < 30,
      ).length,
    };
  }, [drivers]);

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

  if (driversQuery.isLoading) {
    return (
      <Screen contentClassName="px-4 pb-8">
        <AppHeader
          title={t("owner.driversTitle")}
          showBack={false}
          subtitle={t("owner.driversSubtitle")}
          right={<Badge label={t("owner.agencyBadge")} tone="blue" compact />}
        />
        <OwnerDriversSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-4 pb-8">
      <AppHeader
        title={t("owner.driversTitle")}
        showBack={false}
        subtitle={t("owner.driversSubtitle")}
        right={<Badge label={t("owner.agencyBadge")} tone="blue" compact />}
      />

      <Card className="flex-row items-center justify-between py-3.5">
        {[
          { label: t("owner.countOnRoad"), value: counts.onRoad, tone: "text-success" },
          { label: t("owner.countTripToday"), value: counts.tripToday, tone: "text-primary" },
          { label: t("owner.countFree"), value: counts.free, tone: "text-text" },
          { label: t("owner.countRest"), value: counts.rest, tone: "text-warning" },
        ].map((item, index) => (
          <View key={item.label} className="flex-1 items-center">
            <Text className={`text-xl font-bold ${item.tone}`}>{item.value}</Text>
            <Text className="text-2xs text-secText mt-0.5 text-center">{item.label}</Text>
            {index < 3 ? <View className="absolute right-0 top-1 bottom-1 w-[1px] bg-secBorder" /> : null}
          </View>
        ))}
      </Card>

      {counts.permits > 0 ? (
        <Card className="mt-2.5 bg-warningSoft border-warning/40 flex-row items-center gap-2.5 py-3">
          <Icon name="error-outline" size={17} color={colors.warning} />
          <Text className="text-base text-text flex-1">
            <Text className="font-bold">{t("owner.permitExpiring", { count: counts.permits })}</Text>{" "}
            {t("owner.permitExpiringSuffix")}
          </Text>
          <Icon name="chevron-right" size={18} color={colors.warning} />
        </Card>
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

      <View className="gap-3 mt-3">
        {visible.map((driver) => (
          <DriverRow
            key={driver.id}
            driver={driver}
            onPress={() => router.push({ pathname: "/owner/driver/[id]", params: { id: driver.id } })}
          />
        ))}
      </View>

      <Ripple
        onPress={() => router.push("/owner/add-driver")}
        accessibilityLabel={t("owner.addADriver")}
        className="mt-4 flex-row items-center justify-between rounded-lg bg-primary px-4 py-3 shadow-button shadow-buttonShadow"
      >
        <View className="flex-row items-center gap-2.5">
          <Icon name="person-add" size={20} color={colors.onPrimary} />
          <View>
            <Text className="text-base-lg font-bold text-onPrimary">{t("owner.addADriver")}</Text>
            <Text className="text-sm text-onPrimary/70">{t("owner.onboardChauffeur")}</Text>
          </View>
        </View>
        <Icon name="arrow-forward" size={18} color={colors.onPrimary} />
      </Ripple>
    </Screen>
  );
}
