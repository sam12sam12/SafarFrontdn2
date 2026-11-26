import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressTrack } from "@/components/ui/Progress";
import { Rating } from "@/components/ui/Rating";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { MapPanel } from "@/components/passenger/MapPanel";
import { MilestoneList } from "@/components/passenger/MilestoneList";
import { TrackingSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { corridorStops } from "@/lib/corridor";
import { useDriver } from "@/lib/queries/driversQueries";
import { useTrip } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

export default function TrackingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripQuery = useTrip(id);
  const { data: trip } = tripQuery;
  const driverQuery = useDriver(trip?.driverId);
  const { data: driver } = driverQuery;

  const progress = trip?.progress ?? 45;
  // Milestones walk the corridor in this leg's direction, not a fixed Kanadahar → Kabul list.
  const milestones = (trip ? corridorStops(trip) : []).map((stop, index, all) => ({
    title:
      stop.role === "origin"
        ? t("trip.boarded")
        : stop.role === "checkpoint"
          ? t("trip.qalat")
          : stop.role === "rest"
            ? t("trip.ghazni")
            : t("trip.terminalTitle", { city: t(`common.${stop.city.toLowerCase()}`) }),
    detail:
      stop.role === "origin"
        ? trip!.boardingPoint
        : stop.role === "checkpoint"
          ? t("trip.qalatDetail")
          : stop.role === "rest"
            ? t("trip.ghazniDetail")
            : t("trip.terminalDetail"),
    time: `${stop.time} ${stop.period}`,
    state:
      index === 0
        ? ("done" as const)
        : index === all.length - 1
          ? ("upcoming" as const)
          : index === 2
            ? ("active" as const)
            : ("done" as const),
  }));

  if (tripQuery.isLoading || !trip) {
    return (
      <Screen contentClassName="pb-8">
        <AppHeader title={t("tracking.title")} />
        <TrackingSkeleton />
      </Screen>
    );
  }

  return (
    <Screen
      contentClassName="pb-8"
      refreshing={tripQuery.isRefetching || driverQuery.isRefetching}
      onRefresh={() => {
        tripQuery.refetch();
        driverQuery.refetch();
      }}
    >
      <AppHeader title={t("tracking.title")} subtitle={t("tracking.subtitle", { code: trip.code })} />

      <View className="px-4 gap-3">
        <MapPanel progress={progress} location={trip?.locationLabel} />

        <Card>
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
                {t("tracking.estimatedArrival")}
              </Text>
              <View className="flex-row items-baseline gap-1.5 mt-1">
                <Text className="text-3xl font-bold text-primary">
                  {trip.arriveTime} {trip.arrivePeriod}
                </Text>
                <Text className="text-sm text-secText">{t("trip.timeLeft", { time: "2h 15m" })}</Text>
              </View>
            </View>
            <Badge label={t("tracking.onTheRoad")} tone="green" icon="gps-fixed" />
          </View>

          <ProgressTrack value={progress} showDot className="mt-4" height="base" />

          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-sm font-semibold text-text">{t(`common.${trip.from.toLowerCase()}`)}</Text>
              <Text className="text-2xs text-muted">{trip.departTime} {trip.departPeriod}</Text>
            </View>
            <Text className="text-sm font-semibold text-primary">{t("tracking.percentComplete", { pct: progress })}</Text>
            <View className="items-end">
              <Text className="text-sm font-semibold text-text">{t(`common.${trip.to.toLowerCase()}`)}</Text>
              <Text className="text-2xs text-muted">{trip.arriveTime} {trip.arrivePeriod}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2 mt-3 rounded-base bg-elevated border border-secBorder px-3 py-2.5">
            <Icon name="location-on" size={16} color={colors.primary} />
            <Text className="text-sm text-secText flex-1">
              {trip.locationLabel ??
                t("tracking.approxLocation", { city: t(`common.${trip.to.toLowerCase()}`) })}
            </Text>
            <Text className="text-sm font-bold text-text">85 km/h</Text>
          </View>
        </Card>

        <Card>
          <View className="flex-row items-center gap-3">
            <Avatar
              initials={driver?.initials ?? "AW"}
              photo={driver?.photo}
              size="md"
              verified={Boolean(driver)}
            />
            <View className="flex-1">
              <Text className="text-base-lg font-bold text-text">{driver?.name ?? t("common.highwayCaptain")}</Text>
              <View className="flex-row items-center gap-2 mt-0.5">
                <Rating value={driver?.rating ?? 4.9} size={12} />
                <Text className="text-sm text-secText">· {driver?.vehicleModel ?? "Toyota Fielder"}</Text>
              </View>
              <Text className="text-sm text-secText mt-0.5">Plate {trip.vehiclePlate}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <IconButton
                icon="phone"
                accessibilityLabel={t("common.callDriver")}
                variant="soft"
                onPress={() => showToast("info", t("tracking.callingCaptain"), driver?.phone ?? t("tracking.callingCaptainSub"))}
              />
              <IconButton
                icon="sms"
                accessibilityLabel={t("driverDetails.message")}
                variant="white"
                onPress={() => showToast("info", t("tracking.messageSent"), t("tracking.messageSentSub"))}
              />
            </View>
          </View>
        </Card>

        <Card>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-text">{t("trip.milestones")}</Text>
            <Text className="text-sm font-semibold text-primary">{t("trip.liveLog")}</Text>
          </View>
          <MilestoneList items={milestones} />
        </Card>

        <View className="flex-row gap-2.5">
          <AppButton
            label={t("common.shareTrip")}
            variant="secondary"
            icon="share"
            iconPosition="left"
            className="flex-1"
            onPress={() => showToast("success", t("tracking.shareSuccess"), t("tracking.shareSuccessSub"))}
          />
          <AppButton
            label={t("common.tripDetails")}
            icon="chevron-right"
            className="flex-1"
            onPress={() => router.push({ pathname: "/passenger/trip/[id]", params: { id: trip.id } })}
          />
        </View>
      </View>
    </Screen>
  );
}
