import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { BarChart, SplitBar } from "@/components/ui/Progress";
import { Screen } from "@/components/ui/Screen";
import { Segmented, type SegmentOption } from "@/components/ui/Segmented";
import { StatTile } from "@/components/ui/StatTile";
import { OwnerStatsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { formatNumber } from "@/lib/format";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useOwnerStats, type StatsRange } from "@/lib/queries/statsQueries";
import { colors } from "@/utils/theme";

export default function OwnerStatsScreen() {
  const { t } = useTranslation();
  const [range, setRange] = useState<StatsRange>("month");
  const statsQuery = useOwnerStats(range);
  const { data: stats } = statsQuery;
  const { data: drivers } = useDrivers();

  const RANGES: SegmentOption<StatsRange>[] = [
    { label: t("owner.rangeWeek"), value: "week" },
    { label: t("owner.rangeMonth"), value: "month" },
    { label: t("owner.rangeYear"), value: "year" },
  ];

  const net = (stats?.revenue ?? 0) - (stats?.driverPay ?? 0);

  if (statsQuery.isLoading) {
    return (
      <Screen contentClassName="px-4 pb-8">
        <AppHeader
          title={t("owner.statsTitle")}
          showBack={false}
          subtitle={t("owner.statsSubtitle")}
          right={<Badge label={t("owner.agencyBadge")} tone="blue" compact />}
        />
        <OwnerStatsSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-4 pb-8">
      <AppHeader
        title={t("owner.statsTitle")}
        showBack={false}
        subtitle={t("owner.statsSubtitle")}
        right={<Badge label={t("owner.agencyBadge")} tone="blue" compact />}
      />

      <Segmented options={RANGES} value={range} onChange={(value) => setRange(value as StatsRange)} compact />

      <Card className="mt-3 bg-primary border-primary rounded-xl">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-onPrimary/70">
            {stats?.monthLabel ?? "Revenue · November 1–18"}
          </Text>
          <Badge label={t("common.afn")} tone="dark" solid compact className="bg-card/20" />
        </View>
        <Text className="text-4xl font-bold text-onPrimary mt-2">
          {formatNumber(stats?.revenue ?? 427200)}
        </Text>
        <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-card/20">
          <View>
            <Text className="text-2xs uppercase tracking-[1px] text-onPrimary/60">{t("owner.driverPay")}</Text>
            <Text className="text-base-lg font-bold text-onPrimary">
              {formatNumber(stats?.driverPay ?? 162000)} {t("common.afn")}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-2xs uppercase tracking-[1px] text-onPrimary/60">{t("owner.netRetained")}</Text>
            <Text className="text-base-lg font-bold text-onPrimary">
              {formatNumber(net)} {t("common.afn")}
            </Text>
          </View>
        </View>
      </Card>

      <View className="flex-row gap-2.5 mt-3">
        <StatTile label={t("owner.statTrips")} value={stats?.trips ?? 108} hint={t("owner.statTripsHint")} className="flex-1" />
        <StatTile
          label={t("owner.statSeatsSold")}
          value={stats?.seatsSold ?? 351}
          hint={t("owner.ofSeats", { count: stats?.seatsCapacity ?? 432 })}
          className="flex-1"
        />
      </View>
      <View className="flex-row gap-2.5 mt-2.5">
        <StatTile label={t("owner.carsFull")} value={`${stats?.carsFullPct ?? 81}%`} hint={t("owner.carsFullHint")} className="flex-1" tone="success" />
        <StatTile
          label={t("owner.cancelled")}
          value={stats?.cancelled ?? 14}
          hint={t("owner.cancelledHint", { pct: stats?.cancelledPct ?? 3.8 })}
          className="flex-1"
        />
      </View>

      <Card className="mt-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-text">{t("owner.weeklyRevenue")}</Text>
          <Badge label={t("owner.afnThousands")} tone="slate" compact />
        </View>
        <BarChart className="mt-4" data={stats?.weekly ?? []} caption={t("owner.weeklyRevenue")} />
      </Card>

      <Card className="mt-3 gap-4">
        <View>
          <Text className="text-base-lg font-bold text-text mb-2.5">{t("owner.revenueByService")}</Text>
          {(stats?.byService ?? []).map((item, index) => (
            <View key={item.label} className="mb-2.5">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-base text-secText">{item.label}</Text>
                <Text className="text-base font-semibold text-text">
                  {formatNumber(item.value)} {t("common.afn")} · {item.pct}%
                </Text>
              </View>
              <SplitBar pct={item.pct} tone={index === 0 ? "blue" : "teal"} />
            </View>
          ))}
        </View>

        <View>
          <Text className="text-base-lg font-bold text-text mb-2.5">{t("owner.collections")}</Text>
          {(stats?.byPayment ?? []).map((item, index) => (
            <View key={item.label} className="mb-2.5">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-base text-secText">{item.label}</Text>
                <Text className="text-base font-semibold text-text">{item.pct}%</Text>
              </View>
              <SplitBar pct={item.pct} tone={index === 0 ? "success" : "amber"} />
            </View>
          ))}
        </View>

        <View>
          <Text className="text-base-lg font-bold text-text mb-2.5">{t("owner.directionBalance")}</Text>
          {(stats?.byDirection ?? []).map((item) => (
            <View key={item.label} className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center gap-2">
                <Icon name="swap-horiz" size={15} color={colors.muted} />
                <Text className="text-base text-secText">{item.label}</Text>
              </View>
              <Text className="text-base font-semibold text-text">
                {item.value} {t("owner.tripsSuffix")} · {item.pct}%
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card className="mt-3">
        <Text className="text-lg font-bold text-text mb-2">{t("owner.topDrivers")}</Text>
        {(stats?.topDrivers ?? []).map((item, index) => {
          const driver = drivers?.find((entry) => entry.id === item.driverId);
          return (
            <View key={item.driverId}>
              <View className="flex-row items-center gap-3 py-2.5">
                <View className="w-6 items-center">
                  <Text className="text-sm font-bold text-muted">{index + 1}</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-primarySoft items-center justify-center">
                  <Text className="text-sm font-bold text-primary">{driver?.initials ?? "—"}</Text>
                </View>
                <Text className="text-base-lg font-semibold text-text flex-1">
                  {driver?.name ?? t("seats.driver")}
                </Text>
                <Text className="text-base font-semibold text-secText">{item.value} {t("owner.tripsSuffix")}</Text>
              </View>
              {index < (stats?.topDrivers.length ?? 0) - 1 ? (
                <View className="h-[1px] bg-secBorder" />
              ) : null}
            </View>
          );
        })}
      </Card>

      <Text className="text-sm text-muted text-center mt-3">{t("owner.mockDisclaimer")}</Text>
    </Screen>
  );
}
