import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { DriverSeatMap } from "@/components/driver/DriverSeatMap";
import { TripRouteHero } from "@/components/trip/TripRouteHero";
import { DriverTripDetailsSkeleton } from "@/components/skeletons/DriverSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useDriver } from "@/lib/queries/driversQueries";
import { useSeatMap, useTrip } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";
import { formatTripDate } from "@/lib/dates";

export default function DriverTripManifestScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripQuery = useTrip(id);
  const seatsQuery = useSeatMap(id);
  const { data: trip } = tripQuery;
  const { data: seats, isLoading: seatsLoading } = seatsQuery;
  const { data: driver } = useDriver(trip?.driverId);

  const loading = tripQuery.isLoading || seatsLoading || !trip;

  const stops = [
    {
      title: trip?.boardingPoint ?? "Aino Mina Main Terminal",
      time: `${trip?.departTime ?? "06:30"} ${trip?.departPeriod ?? "AM"}`,
      detail: t("driver.stopBoarding"),
      badge: null,
      color: colors.primary,
    },
    {
      title: t("trip.qalat"),
      time: "~08:45 AM",
      detail: t("driver.stopSecurityNote"),
      badge: t("driver.security"),
      color: colors.primary,
    },
    {
      title: t("trip.ghazni"),
      time: "~11:00 AM",
      detail: t("driver.stopTeaNote"),
      badge: null,
      color: colors.primary,
    },
    {
      title: trip?.dropOffPoint ?? "Kabul Company Chowk Terminal",
      time: `~${trip?.arriveTime ?? "01:15"} ${trip?.arrivePeriod ?? "PM"}`,
      detail: t("driver.stopDrop"),
      badge: null,
      color: colors.success,
    },
  ];

  return (
    <Screen
      contentClassName="pb-4"
      refreshing={tripQuery.isRefetching || seatsQuery.isRefetching}
      onRefresh={() => {
        tripQuery.refetch();
        seatsQuery.refetch();
      }}
      footer={
        trip ? (
          <View className="bg-card border-t border-border px-4 pt-2.5 pb-3.5 flex-row gap-2.5">
            <AppButton
              label={t("driver.dispatch")}
              variant="secondary"
              icon="phone"
              iconPosition="left"
              compact
              className="flex-1"
              onPress={() => showToast("info", t("driver.dispatch"), "Kandahar desk · 8844")}
            />
            <AppButton
              label={t("driver.directions")}
              icon="navigation"
              compact
              className="flex-[1.45]"
              onPress={() => showToast("success", t("driver.directions"), t("driver.gateToast"))}
            />
          </View>
        ) : null
      }
    >
      <AppHeader
        title={t("driver.tripDetails")}
        subtitle={trip ? `#${trip.code} · ${formatTripDate(trip.date, i18n.language)}` : undefined}
        right={<Badge label={t("driver.upcoming")} tone="blue" compact />}
      />

      {loading ? (
        <DriverTripDetailsSkeleton />
      ) : (
        <View className="px-4 gap-3">
          <TripRouteHero
            trip={trip}
            dateText={formatTripDate(trip.date, i18n.language)}
            tiles={[
              {
                label: t("driver.service"),
                value: trip.service === "vip" ? t("driver.vipFamily") : t("driver.sharedVip"),
              },
              { label: t("driver.distance"), value: `${trip.distanceKm} km` },
            ]}
          />

          <Card>
            <View className="flex-row items-start justify-between gap-2">
              <View className="flex-1">
                <Text className="text-xl font-bold text-text">{t("driver.whoSits")}</Text>
                <Text className="text-xs text-secText mt-1">{t("driver.fleetCapacity")}</Text>
              </View>
              <Badge
                label={t("driver.bookedOf", {
                  booked: trip.seatsBooked,
                  total: trip.seatsTotal,
                })}
                tone="blue"
                icon="groups"
                compact
              />
            </View>

            <View className="flex-row items-center justify-between mt-3">
              <Text className="text-xs font-semibold text-secText">{t("driver.blueprint")}</Text>
              <View className="flex-row items-center gap-1 rounded-full bg-disable px-2 py-1">
                <Icon name="ac-unit" size={12} color={colors.secText} />
                <Text className="text-2xs font-semibold text-secText">{t("driver.dualAc")}</Text>
              </View>
            </View>

            <DriverSeatMap seats={seats ?? []} driverName={driver?.name ?? "Ustad Ahmad Wali"} />

            <View className="flex-row items-center justify-around rounded-full bg-elevated border border-secBorder py-2 mt-2">
              <Legend color={colors.primary} label={t("driver.legendPaid")} />
              <Legend color={colors.warning} label={t("driver.legendDue")} />
              <Legend color="#CBD5E1" label={t("driver.legendWalkIn")} dashed />
              <Legend color={colors.text} label={t("driver.legendDriver")} />
            </View>
          </Card>

          <Card>
            <Text className="text-xl font-bold text-text">{t("driver.routeStops")}</Text>
            <Text className="text-xs text-secText mt-1">{t("driver.routeSub")}</Text>

            <View className="mt-3">
              {stops.map((stop, index) => (
                <View key={stop.title} className="flex-row gap-3">
                  <View className="items-center w-4">
                    <View
                      className="w-4 h-4 rounded-full border-2 border-card items-center justify-center"
                      style={{ backgroundColor: stop.color }}
                    >
                      <View className="w-1.5 h-1.5 rounded-full bg-card" />
                    </View>
                    {index < stops.length - 1 ? (
                      <View className="w-[1px] flex-1 bg-border my-0.5" />
                    ) : null}
                  </View>
                  <View
                    className={
                      index < stops.length - 1
                        ? "flex-1 flex-row justify-between gap-2 pb-4"
                        : "flex-1 flex-row justify-between gap-2"
                    }
                  >
                    <View className="flex-1">
                      <View className="flex-row items-center gap-1.5 flex-wrap">
                        <Text className="text-base-lg font-bold text-text">{stop.title}</Text>
                        {stop.badge ? (
                          <Badge label={stop.badge} tone="slate" compact />
                        ) : null}
                      </View>
                      <Text className="text-xs text-secText mt-0.5 leading-4">{stop.detail}</Text>
                    </View>
                    <Text className="text-xs font-semibold text-text mt-0.5">{stop.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          <Card className="bg-primarySoft border-primaryBorder flex-row gap-2.5">
            <View className="w-8 h-8 rounded-full bg-card items-center justify-center">
              <Icon name="campaign" size={18} color={colors.primary} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-bold text-primary">{t("driver.dispatchNote")}</Text>
                <Text className="text-2xs font-semibold text-primary/70">04:10</Text>
              </View>
              <Text className="text-sm text-primary leading-5 mt-1">
                {trip.dispatchNote ?? "Confirm every seat before departure and call the desk for gaps."}
              </Text>
            </View>
          </Card>
        </View>
      )}
    </Screen>
  );
}

function Legend({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-1">
      <View
        className="w-2.5 h-2.5 rounded-[2px]"
        style={{
          backgroundColor: dashed ? "transparent" : color,
          borderWidth: dashed ? 1 : 0,
          borderColor: color,
        }}
      />
      <Text className="text-2xs font-semibold text-secText">{label}</Text>
    </View>
  );
}
