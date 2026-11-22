import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { DriverStatsSkeleton } from "@/components/skeletons/DriverSkeletons";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { Segmented, type SegmentOption } from "@/components/ui/Segmented";
import { showToast } from "@/components/ui/Toast";
import { useDriverStats, type StatsRange } from "@/lib/queries/statsQueries";
import { formatNumber } from "@/lib/format";
import { colors } from "@/utils/theme";

export default function DriverStatsScreen() {
  const { t } = useTranslation();
  const [range, setRange] = useState<StatsRange>("month");
  const statsQuery = useDriverStats(range);
  const { data: stats, isLoading } = statsQuery;

  const options: SegmentOption<StatsRange>[] = [
    { label: t("driver.range.week"), value: "week" },
    { label: t("driver.range.month"), value: "month" },
    { label: t("driver.range.year"), value: "year" },
  ];

  if (isLoading || !stats) {
    return (
      <Screen contentClassName="pb-8">
        <DriverStatsSkeleton />
      </Screen>
    );
  }

  const baseRate = Math.round(stats.earned / Math.max(stats.trips, 1));
  const period = stats.monthLabel.toUpperCase().replace(" · ", " • ");

  return (
    <Screen
      contentClassName="pb-8"
      refreshing={statsQuery.isRefetching}
      onRefresh={() => statsQuery.refetch()}
    >
      <View className="px-4">
        <View className="flex-row items-start justify-between mt-4">
          <View>
            <Text className="text-2xs font-bold uppercase tracking-[1.1px] text-muted">
              {t("driver.statsKicker")}
            </Text>
            <Text className="text-2xl font-bold text-text mt-1">{t("driver.statsTitle")}</Text>
          </View>
          <Ripple
            onPress={() => showToast("info", t("driver.statement"), t("driver.statementBody"))}
            accessibilityLabel={t("driver.statement")}
            className="flex-row items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2"
          >
            <Icon name="receipt-long" size={15} color={colors.primary} />
            <Text className="text-xs font-semibold text-text">{t("driver.statement")}</Text>
          </Ripple>
        </View>

        <Segmented
          options={options}
          value={range}
          onChange={(value) => setRange(value as StatsRange)}
          className="mt-4"
          compact
        />

        <LinearGradient
          colors={["#2563EB", "#1D4ED8", "#1E40AF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 18, padding: 15, marginTop: 12 }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-white/70">
              {period}
            </Text>
            <View className="rounded-full border border-white/30 bg-white/10 px-2 py-1">
              <Text className="text-2xs font-bold text-white/80">{t("driver.activePeriod")}</Text>
            </View>
          </View>

          <View className="flex-row items-baseline gap-1.5 mt-2">
            <Text className="text-4xl font-bold text-white">{formatNumber(stats.earned)}</Text>
            <Text className="text-base-lg font-bold text-white/85">AFN</Text>
          </View>
          <Text className="text-xs text-white/75 mt-1">
            {t("driver.basePerTrip", {
              trips: stats.trips,
              rate: formatNumber(baseRate),
            })}
          </Text>

          <View className="flex-row gap-2 mt-4">
            <View className="flex-1 rounded-md bg-white/10 border border-white/15 px-2.5 py-2">
              <Text className="text-2xs text-white/60">{t("driver.paidToYou")}</Text>
              <Text className="text-xl font-bold text-white mt-1">
                {formatNumber(stats.paid)} <Text className="text-xs font-semibold">AFN</Text>
              </Text>
            </View>
            <View className="flex-1 rounded-md bg-white/10 border border-white/15 px-2.5 py-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xs text-white/60">
                  {t("driver.nextPayout", { date: stats.nextPayoutDate })}
                </Text>
                <View className="w-1.5 h-1.5 rounded-full bg-success" />
              </View>
              <Text className="text-base-lg font-bold text-white mt-1">
                {formatNumber(stats.earned)} AFN
              </Text>
              <Text className="text-2xs text-white/60 mt-0.5">{t("driver.payoutMethod")}</Text>
            </View>
          </View>
        </LinearGradient>

        <View className="flex-row gap-2 mt-3">
          <Metric label={t("driver.metricTrips")} value={String(stats.trips)} />
          <Metric label={t("driver.metricPassengers")} value={String(stats.passengers)} />
          <Metric label={t("driver.metricKm")} value={formatNumber(stats.km)} />
        </View>
        <View className="flex-row gap-2 mt-2">
          <Metric label={t("driver.metricHours")} value={String(stats.hours)} />
          <Metric
            label={t("driver.metricRating")}
            value={`${stats.rating.toFixed(1)} ★`}
            valueClass="text-text"
          />
          <Metric
            label={t("driver.metricOnTime")}
            value={`${stats.onTimePct}%`}
            valueClass="text-success"
          />
        </View>

        <Card className="mt-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text">{t("driver.tripsCompleted")}</Text>
            <Text className="text-2xs text-muted">
              {t("driver.tapBar", { count: stats.trips })}
            </Text>
          </View>
          <DriverBars data={stats.weekly} />
        </Card>

        <View className="flex-row gap-2.5 mt-3">
          <Breakdown label={t("driver.byDirection")} rows={stats.byDirection} />
          <Breakdown label={t("driver.byService")} rows={stats.byService} split />
        </View>

        <Card className="mt-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
              {t("driver.payoutHistory")}
            </Text>
            <Text className="text-xs font-semibold text-primary">{t("driver.sarafiLedger")}</Text>
          </View>

          {stats.payouts.map((payout, index) => (
            <View key={payout.id}>
              <View className="flex-row items-center gap-2.5 py-3">
                <View className="w-8 h-8 rounded-full bg-successSoft items-center justify-center">
                  <Icon name="check" size={16} color={colors.success} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-text">{payout.label}</Text>
                  <Text className="text-2xs text-muted mt-0.5">{payout.meta}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-base-lg font-bold text-text">
                    {formatNumber(payout.amount)}
                  </Text>
                  <Text className="text-2xs text-muted">AFN</Text>
                </View>
              </View>
              {index < stats.payouts.length - 1 ? (
                <View className="h-[1px] bg-secBorder ml-10" />
              ) : null}
            </View>
          ))}
        </Card>

        <Text className="text-xs text-muted text-center mt-4">
          {t("driver.lifetime", {
            trips: stats.lifetimeTrips,
            km: formatNumber(stats.lifetimeKm),
          })}
        </Text>
      </View>
    </Screen>
  );
}

function Metric({
  label,
  value,
  valueClass = "text-text",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <Card className="flex-1 px-3 py-2.5" flat>
      <Text className="text-2xs font-bold uppercase tracking-[0.6px] text-muted" numberOfLines={1}>
        {label}
      </Text>
      <Text className={`text-xl font-bold mt-1 ${valueClass}`} numberOfLines={1}>
        {value}
      </Text>
    </Card>
  );
}

function DriverBars({ data }: { data: { label: string; value: number }[] }) {
  const { t } = useTranslation();
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <View className="mt-4">
      <View className="h-[128px] justify-end relative">
        {[0.33, 0.66, 1].map((line) => (
          <View
            key={line}
            className="absolute left-0 right-0 border-t border-dashed border-border"
            style={{ bottom: `${line * 100}%` }}
          />
        ))}
        <View className="flex-row items-end justify-between gap-3 h-full px-1">
          {data.map((item) => {
            const height = item.value === 0 ? 3 : Math.max(10, (item.value / max) * 112);
            return (
              <Ripple
                key={item.label}
                onPress={() =>
                  showToast("info", item.label, `${item.value} · ${t("driver.tripsCompleted")}`)
                }
                accessibilityLabel={`${item.label}: ${item.value}`}
                className="flex-1 items-center justify-end"
              >
                <View
                  className={`w-full max-w-[36px] rounded-t-[5px] ${
                    item.value === 0 ? "bg-disable" : "bg-primary"
                  }`}
                  style={{ height }}
                />
              </Ripple>
            );
          })}
        </View>
      </View>
      <View className="flex-row justify-between gap-3 mt-2">
        {data.map((item) => (
          <Text key={item.label} className="flex-1 text-center text-xs text-secText">
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function Breakdown({
  label,
  rows,
  split,
}: {
  label: string;
  rows: { label: string; value: number }[];
  split?: boolean;
}) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  return (
    <Card className="flex-1 p-3">
      <Text className="text-2xs font-bold uppercase tracking-[0.8px] text-muted">{label}</Text>
      <View className="mt-2 gap-2">
        {rows.map((row) => (
          <View key={row.label} className="flex-row items-center justify-between gap-1">
            <Text className="text-2xs text-secText flex-1" numberOfLines={1}>
              {row.label}
            </Text>
            <Text className="text-xs font-bold text-text">{row.value}</Text>
          </View>
        ))}
      </View>
      <View className="flex-row h-1.5 rounded-full bg-disable overflow-hidden mt-3">
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={{ width: `${(row.value / total) * 100}%` }}
            className={
              split
                ? index === 0
                  ? "bg-primary"
                  : "bg-warning"
                : index === 0
                  ? "bg-primary"
                  : "bg-primaryLight"
            }
          />
        ))}
      </View>
    </Card>
  );
}
