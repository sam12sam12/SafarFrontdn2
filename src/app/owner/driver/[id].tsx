import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import { OwnerDriverProfileSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { useDriver } from "@/lib/queries/driversQueries";
import { useOwnerStats, useDriverStats } from "@/lib/queries/statsQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { formatDayNumber, formatWeekday } from "@/lib/dates";
import { formatNumber } from "@/lib/format";
import { colors } from "@/utils/theme";

const TODAY = "2026-11-19";

export default function OwnerDriverProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const driverQuery = useDriver(id);
  const { data: driver } = driverQuery;
  const { data: stats } = useDriverStats("month");
  const { data: trips } = useTrips();
  const [canTakeTrips, setCanTakeTrips] = useState(true);
  const [paidThisMonth, setPaidThisMonth] = useState(false);

  if (driverQuery.isLoading || !driver) {
    return (
      <Screen contentClassName="pb-8">
        <View className="px-4 pt-3">
          <Text className="text-xl font-bold text-text">{t("owner.driverProfileTitle")}</Text>
        </View>
        <OwnerDriverProfileSkeleton />
      </Screen>
    );
  }

  const month = (stats?.monthLabel ?? "").split("·")[1]?.trim() ?? "";
  const nextTrips = (trips ?? [])
    .filter((trip) => trip.driverId === driver.id && trip.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const perTrip = stats?.trips ? Math.round(stats.earned / stats.trips) : 1500;
  const joinedYear = driver.joinedLabel.replace(/[^0-9]/g, "");
  const permitDays = driver.permitEndsInDays;
  const lastPayout = stats?.payouts?.[0];

  return (
    <Screen
      contentClassName="pb-8"
      refreshing={driverQuery.isRefetching}
      onRefresh={() => driverQuery.refetch()}
    >
      <View className="flex-row items-center gap-3 px-4 pt-3 pb-3">
        <Ripple
          onPress={() => router.back()}
          accessibilityLabel={t("owner.driverProfileTitle")}
          className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
        >
          <Icon name="arrow-back" size={19} color={colors.text} />
        </Ripple>
        <Text className="text-xl font-bold text-text flex-1">{t("seats.driver")}</Text>
        <Ripple
          onPress={() => showToast("info", t("owner.edit"), t("owner.mockDisclaimer"))}
          accessibilityLabel={t("owner.edit")}
          className="flex-row items-center gap-1 rounded-full border border-primaryBorder px-3 py-1.5"
        >
          <Icon name="edit" size={14} color={colors.primary} />
          <Text className="text-sm font-semibold text-primary">{t("owner.edit")}</Text>
        </Ripple>
      </View>

      <View className="px-4 gap-3">
        <View className="rounded-xl bg-primary p-4 gap-3 shadow-card shadow-shadowColor">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-card items-center justify-center">
              <Text className="text-lg font-bold text-primary">{driver.initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-onPrimary" numberOfLines={1}>
                {driver.name}
              </Text>
              <Text className="text-sm text-onPrimary/80">{driver.phone}</Text>
              <Text className="text-2xs text-onPrimary/70">
                {driver.base} base ·{" "}
                {t("owner.drivingSince", { year: joinedYear.length === 2 ? `20${joinedYear}` : joinedYear })}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2 rounded-base bg-onPrimary/15 px-2.5 py-2">
            <View className="w-1.5 h-1.5 rounded-full bg-success" />
            <Text className="text-2xs text-onPrimary/85 flex-1" numberOfLines={1}>
              {t("owner.nowLabel")}: {driver.statusNote}
            </Text>
            <View className="rounded-full bg-onPrimary/20 px-2 py-0.5">
              <Text className="text-2xs font-semibold text-onPrimary">
                {driver.status === "trip-today"
                  ? t("owner.statusTripToday")
                  : driver.status === "on-road"
                    ? t("owner.statusOnRoad")
                    : driver.status === "free"
                      ? t("owner.statusFree")
                      : t("owner.statusRest")}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            {[
              { icon: "phone" as const, label: t("owner.call"), onPress: () => showToast("info", t("owner.calling"), driver.phone) },
              { icon: "sms" as const, label: t("owner.message"), onPress: () => showToast("success", t("owner.smsSent"), driver.phone) },
              { icon: "add" as const, label: t("owner.giveTrip"), onPress: () => router.push("/owner/schedule") },
            ].map((action) => (
              <Ripple
                key={action.label}
                onPress={action.onPress}
                accessibilityLabel={action.label}
                className="flex-1 items-center gap-1 rounded-base bg-onPrimary/15 py-2.5"
              >
                <Icon name={action.icon} size={18} color={colors.onPrimary} />
                <Text className="text-2xs font-semibold text-onPrimary">{action.label}</Text>
              </Ripple>
            ))}
          </View>
        </View>

        <Card className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text">{t("owner.canTakeTrips")}</Text>
            <Text className="text-sm text-secText mt-0.5">{t("owner.canTakeTripsSub")}</Text>
          </View>
          <Toggle
            value={canTakeTrips}
            onChange={setCanTakeTrips}
            accessibilityLabel={t("owner.canTakeTrips")}
          />
        </Card>

        <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mt-1">
          {t("owner.monthSoFar", { month })}
        </Text>
        <View className="flex-row gap-2.5">
          <Card className="flex-1 p-3.5 gap-1">
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
              {t("owner.statTrips")}
            </Text>
            <Text className="text-2xl font-bold text-text">{driver.tripsThisMonth}</Text>
          </Card>
          <Card className="flex-1 p-3.5 gap-1">
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
              {t("owner.ratingLabel")}
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-bold text-text">{driver.rating.toFixed(1)}</Text>
              <Icon name="star" size={14} color={colors.warning} />
            </View>
          </Card>
        </View>
        <View className="flex-row gap-2.5">
          <Card className="flex-1 p-3.5 gap-1">
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
              {t("driver.metricOnTime")}
            </Text>
            <Text className="text-2xl font-bold text-text">{stats?.onTimePct ?? 0}%</Text>
          </Card>
          <Card className="flex-1 p-3.5 gap-1">
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
              {t("owner.passengers")}
            </Text>
            <Text className="text-2xl font-bold text-text">{stats?.passengers ?? 0}</Text>
          </Card>
        </View>

        <Card className="gap-2.5">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              {t("owner.payMonth", { month })}
            </Text>
            <Text className="text-sm text-secText">
              {t("owner.perTrip", { amount: formatNumber(perTrip) })}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-4xl font-bold text-text">{formatNumber(stats?.earned ?? 0)}</Text>
              <Text className="text-base-lg font-semibold text-secText">{t("common.afn")}</Text>
            </View>
            <Badge label={t("owner.dueDate", { date: stats?.nextPayoutDate ?? "" })} tone="amber" />
          </View>
          <AppButton
            label={paidThisMonth ? t("owner.markPaidDone", { month }) : t("owner.markPaid", { month })}
            variant="dark"
            onPress={() => {
              setPaidThisMonth(true);
              showToast("success", t("owner.markPaid", { month }), t("owner.mockDisclaimer"));
            }}
          />
          {lastPayout ? (
            <Text className="text-2xs text-muted text-center">
              {t("owner.paidHistory", {
                month: lastPayout.label.split(" ")[0],
                amount: formatNumber(lastPayout.amount),
                date: lastPayout.meta.split("·")[0]?.replace("Paid ", "").trim(),
              })}
            </Text>
          ) : null}
        </Card>

        <Card className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              {t("owner.nextTrips")}
            </Text>
            <Ripple
              onPress={() => router.push("/owner/schedule")}
              accessibilityLabel={t("owner.giveTrip")}
            >
              <Text className="text-sm font-semibold text-primary">{t("owner.giveTrip")}</Text>
            </Ripple>
          </View>
          {nextTrips.map((trip) => {
            const weekday = formatWeekday(trip.date, i18n.language)
              .toUpperCase();
            return (
              <Ripple
                key={trip.id}
                onPress={() => router.push({ pathname: "/owner/trip/[id]", params: { id: trip.id } })}
                accessibilityLabel={trip.code}
                className="flex-row items-center gap-2.5 py-2 border-t border-secBorder"
              >
                <View className="w-10 items-center rounded-sm bg-elevated py-1">
                  <Text className="text-2xs font-semibold text-muted">{weekday}</Text>
                  <Text className="text-base-lg font-bold text-text">{formatDayNumber(trip.date, i18n.language)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base-lg font-semibold text-text">
                    {trip.from} → {trip.to}
                  </Text>
                  <Text className="text-2xs text-secText">
                    {trip.departTime} {trip.departPeriod} ·{" "}
                    {trip.service === "vip" ? `${t("owner.serviceVip")} · ${t("owner.wholeCar")}` : t("owner.bookingFilterShared")} ·{" "}
                    {trip.seatsBooked}/{trip.seatsTotal} {t("common.seats")}
                  </Text>
                </View>
              </Ripple>
            );
          })}
        </Card>

        <Card className="gap-0">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted mb-1">
            {t("owner.carDocuments")}
          </Text>
          {[
            {
              title: `${driver.vehicleModel} · ${driver.plate}`,
              subtitle: t("owner.inspectionLine", {
                date: driver.motValid ?? "—",
                km: formatNumber(driver.inspectionKm ?? 0),
              }),
              badge: t("owner.ok"),
              tone: "green" as const,
            },
            {
              title: t("owner.tazkira"),
              subtitle: t("owner.tazkiraSub"),
              badge: t("owner.verified"),
              tone: "green" as const,
            },
            {
              title: t("owner.drivingLicence"),
              subtitle: t("owner.licenceSub", { date: driver.licenceValid ?? "—" }),
              badge: t("owner.valid"),
              tone: "green" as const,
            },
            {
              title: t("owner.routePermit"),
              subtitle: t("owner.permitSub", { date: driver.permitExpiry ?? "—" }),
              badge: permitDays ? t("owner.daysLeft", { count: permitDays }) : t("owner.valid"),
              tone: permitDays ? ("amber" as const) : ("green" as const),
            },
          ].map((row) => (
            <View key={row.title} className="flex-row items-center gap-2 py-2.5 border-t border-secBorder">
              <View className="flex-1">
                <Text className="text-base-lg font-semibold text-text" numberOfLines={1}>
                  {row.title}
                </Text>
                <Text className="text-2xs text-secText mt-0.5" numberOfLines={1}>
                  {row.subtitle}
                </Text>
              </View>
              <Badge label={row.badge} tone={row.tone} compact />
            </View>
          ))}
          <Ripple
            onPress={() =>
              showToast("info", t("owner.remindRenew"), driver.phone)
            }
            accessibilityLabel={t("owner.remindRenew")}
            className="rounded-base border border-warning/50 py-2.5 items-center mt-2"
          >
            <Text className="text-base-lg font-semibold text-warning">{t("owner.remindRenew")}</Text>
          </Ripple>
        </Card>

        {driver.review ? (
          <Card className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
                {t("owner.latestReview")}
              </Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-bold text-warning">{driver.review.rating.toFixed(1)}</Text>
                <Icon name="star" size={13} color={colors.warning} />
              </View>
            </View>
            <Text className="text-base text-secText italic leading-5">“{driver.review.text}”</Text>
            <Text className="text-sm text-muted">
              {driver.review.author} · {driver.review.route}
            </Text>
          </Card>
        ) : null}

        <AppButton
          label={t("owner.removeFleet")}
          variant="danger"
          onPress={() => showToast("warning", t("owner.removeFleet"), t("owner.mockDisclaimer"))}
        />
      </View>
    </Screen>
  );
}
