import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { HeaderIcon } from "@/components/ui/HeaderIcon";
import { BarChart, SplitBar } from "@/components/ui/Progress";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { Segmented, type SegmentOption } from "@/components/ui/Segmented";
import { StatTile } from "@/components/ui/StatTile";
import { showToast } from "@/components/ui/Toast";
import { OwnerStatsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { formatNumber } from "@/lib/format";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useOwnerStats, type StatsRange } from "@/lib/queries/statsQueries";
import { colors } from "@/utils/theme";

export default function OwnerStatsScreen() {
  const { t } = useTranslation();
  const [range, setRange] = useState<StatsRange>("month");
  const statsQuery = useOwnerStats(range);
  const driversQuery = useDrivers();
  const { data: stats } = statsQuery;
  const { data: drivers } = driversQuery;

  const RANGES: SegmentOption<StatsRange>[] = [
    { label: t("owner.rangeWeek"), value: "week" },
    { label: t("owner.rangeMonth"), value: "month" },
    { label: t("owner.rangeYear"), value: "year" },
  ];

  const revenue = stats?.revenue ?? 0;
  const driverPay = stats?.driverPay ?? 0;
  const net = revenue - driverPay;
  const trips = stats?.trips ?? 0;
  const monthName = (stats?.monthLabel ?? "").split("·")[1]?.trim() ?? "";

  if (statsQuery.isLoading) {
    return (
      <Screen contentClassName="px-4 pb-8">
        <View className="flex-row items-center justify-between pt-3 pb-2">
          <Text className="text-3xl font-bold text-text">{t("owner.statsTitle")}</Text>
          <HeaderIcon icon="file-download" accessibilityLabel={t("owner.download")} />
        </View>
        <OwnerStatsSkeleton />
      </Screen>
    );
  }

  return (
    <Screen
      contentClassName="px-4 pb-8"
      refreshing={statsQuery.isRefetching || driversQuery.isRefetching}
      onRefresh={() => {
        statsQuery.refetch();
        driversQuery.refetch();
      }}
    >
      <View className="flex-row items-center justify-between pt-3 pb-2">
        <Text className="text-3xl font-bold text-text">{t("owner.statsTitle")}</Text>
        <HeaderIcon
          icon="file-download"
          accessibilityLabel={t("owner.download")}
          onPress={() => showToast("info", t("owner.download"), t("owner.mockDisclaimer"))}
        />
      </View>

      <Segmented options={RANGES} value={range} onChange={(value) => setRange(value as StatsRange)} />

      <View className="mt-3 rounded-xl bg-primary p-4 shadow-card shadow-shadowColor">
        <Text className="text-2xs font-bold uppercase tracking-[1px] text-onPrimary/70">
          {stats?.monthLabel ?? ""}
        </Text>
        <View className="flex-row items-baseline gap-1.5 mt-1">
          <Text className="text-4xl font-bold text-onPrimary">{formatNumber(revenue)}</Text>
          <Text className="text-base-lg font-semibold text-onPrimary/80">{t("common.afn")}</Text>
        </View>
        <View className="flex-row gap-2 mt-3">
          <View className="flex-1 rounded-base bg-onPrimary/15 p-2.5">
            <Text className="text-2xs text-onPrimary/70">{t("owner.driverPay")}</Text>
            <Text className="text-base-lg font-bold text-onPrimary mt-0.5">
              {formatNumber(driverPay)} {t("common.afn")}
            </Text>
          </View>
          <View className="flex-1 rounded-base bg-onPrimary/15 p-2.5">
            <Text className="text-2xs text-onPrimary/70">{t("owner.netRetained")}</Text>
            <Text className="text-base-lg font-bold text-onPrimary mt-0.5">
              {formatNumber(net)} {t("common.afn")}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2.5 mt-3">
        <StatTile
          label={t("owner.statTrips")}
          value={trips}
          hint={t("owner.perCar", { value: (trips / 10).toFixed(1) })}
          className="flex-1"
        />
        <StatTile
          label={t("owner.statSeatsSold")}
          value={stats?.seatsSold ?? 0}
          hint={t("owner.ofSeats", { count: stats?.seatsCapacity ?? 0 })}
          className="flex-1"
        />
      </View>
      <View className="flex-row gap-2.5 mt-2.5">
        <StatTile
          label={t("owner.carsFull")}
          value={`${stats?.carsFullPct ?? 0}%`}
          hint={t("owner.averageSeatFill")}
          className="flex-1"
        />
        <StatTile
          label={t("owner.cancelled")}
          value={stats?.cancelled ?? 0}
          hint={t("owner.cancelledHint", { pct: stats?.cancelledPct ?? 0 })}
          className="flex-1"
        />
      </View>

      <Card className="mt-3 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-base-lg font-bold text-text">{t("owner.weeklyRevenue")}</Text>
          <Text className="text-sm text-muted">{t("owner.tapBar")}</Text>
        </View>
        <BarChart data={stats?.weekly ?? []} height={120} />
      </Card>

      <Card className="mt-3 gap-4">
        <View className="gap-2.5">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.revenueByService")}
          </Text>
          {(stats?.byService ?? []).map((item) => (
            <View key={item.label} className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-base-lg font-semibold text-text">{item.label}</Text>
                <Text className="text-sm text-secText">
                  {formatNumber(item.value)} {t("common.afn")} · {item.pct}%
                </Text>
              </View>
              <SplitBar pct={item.pct} tone="blue" />
            </View>
          ))}
        </View>

        <View className="gap-2.5">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.howPaid")}
          </Text>
          {(stats?.byPayment ?? []).map((item) => (
            <View key={item.label} className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-base-lg font-semibold text-text">{item.label}</Text>
                <Text className="text-sm text-secText">
                  {formatNumber(item.value)} {t("common.afn")} · {item.pct}%
                </Text>
              </View>
              <SplitBar pct={item.pct} tone="blue" />
            </View>
          ))}
        </View>

        <View className="gap-2.5">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.tripsByDirection")}
          </Text>
          {(stats?.byDirection ?? []).map((item) => (
            <View key={item.label} className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-base-lg font-semibold text-text">{item.label}</Text>
                <Text className="text-sm text-secText">
                  {item.value} {t("owner.tripsSuffix")} · {item.pct}%
                </Text>
              </View>
              <SplitBar pct={item.pct} tone="blue" />
            </View>
          ))}
        </View>
      </Card>

      <Card className="mt-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.topDriversLabel", { month: monthName })}
          </Text>
          <Ripple
            onPress={() => showToast("info", t("owner.driversTitle"), monthName)}
            accessibilityLabel={t("owner.allDrivers")}
          >
            <Text className="text-sm font-semibold text-primary">{t("owner.allDrivers")}</Text>
          </Ripple>
        </View>
        {(stats?.topDrivers ?? []).map((item, index) => {
          const driver = drivers?.find((entry) => entry.id === item.driverId);
          return (
            <View key={item.driverId} className="flex-row items-center gap-2.5 py-2">
              <Text className="w-4 text-sm font-semibold text-muted">{index + 1}</Text>
              <View className="w-9 h-9 rounded-full bg-primarySoft items-center justify-center">
                <Text className="text-sm font-bold text-primary">{driver?.initials ?? "—"}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base-lg font-semibold text-text" numberOfLines={1}>
                  {driver?.name ?? t("seats.driver")}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Icon name="star" size={10} color={colors.warning} />
                  <Text className="text-2xs text-secText">
                    {driver?.rating.toFixed(1) ?? "—"} · {driver?.plate ?? "—"}
                  </Text>
                </View>
              </View>
              <Text className="text-sm font-semibold text-secText">
                {item.value} {t("owner.tripsSuffix")}
              </Text>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}
