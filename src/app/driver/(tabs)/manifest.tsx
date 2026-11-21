import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { DriverManifestSkeleton } from "@/components/skeletons/DriverSkeletons";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { seatAvailability } from "@/lib/db";
import { useTrips } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

const DRIVER_ID = "d-wali";

export default function DriverManifestTab() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: trips, isLoading } = useTrips({ status: ["boarding", "scheduled", "on-road"] });

  const manifests = (trips ?? []).filter((trip) => trip.driverId === DRIVER_ID);

  return (
    <Screen contentClassName="pb-8">
      <View className="px-4">
        <View className="mt-4">
          <Text className="text-2xs font-bold uppercase tracking-[1.1px] text-muted">
            {t("driver.portal")}
          </Text>
          <Text className="text-2xl font-bold text-text mt-1">{t("driver.nav.manifest")}</Text>
          <Text className="text-xs text-secText mt-1">{t("driver.manifestSub")}</Text>
        </View>

        {isLoading ? (
          <DriverManifestSkeleton />
        ) : manifests.length === 0 ? (
          <Card className="items-center py-8 mt-3">
            <View className="w-11 h-11 rounded-full bg-primarySoft items-center justify-center">
              <Icon name="groups" size={22} color={colors.primary} />
            </View>
            <Text className="text-base-lg font-bold text-text mt-3">{t("driver.manifestEmpty")}</Text>
            <Text className="text-sm text-muted text-center mt-1">
              {t("driver.manifestEmptySub")}
            </Text>
          </Card>
        ) : (
          <View className="gap-3 mt-3">
            {manifests.map((trip) => {
              const free = seatAvailability(trip.id);
              const [day, date] = trip.dateLabel.split(" ");
              const tone: BadgeTone =
                trip.status === "boarding" ? "blue" : trip.status === "on-road" ? "green" : "slate";
              const status =
                trip.status === "boarding"
                  ? t("driver.status.boarding")
                  : trip.status === "on-road"
                    ? t("driver.status.departed")
                    : t("driver.status.scheduled");

              return (
                <Ripple
                  key={trip.id}
                  onPress={() =>
                    router.push({ pathname: "/driver/trip/[id]", params: { id: trip.id } })
                  }
                  accessibilityLabel={t("driver.openManifest", { code: trip.code })}
                >
                  <Card className="p-3.5">
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-14 rounded-md bg-mainBack items-center justify-center">
                        <Text className="text-2xs font-bold uppercase tracking-[0.5px] text-muted">
                          {day}
                        </Text>
                        <Text className="text-xl font-bold text-text mt-0.5">{date}</Text>
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center justify-between gap-2">
                          <Text className="text-base-lg font-bold text-text">{trip.code}</Text>
                          <Badge label={status} tone={tone} compact />
                        </View>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <Text className="text-sm font-semibold text-text">
                            {t(`common.${trip.from.toLowerCase()}`)}
                          </Text>
                          <Icon name="arrow-forward" size={11} color={colors.muted} />
                          <Text className="text-sm font-semibold text-text">
                            {t(`common.${trip.to.toLowerCase()}`)}
                          </Text>
                        </View>
                        <Text className="text-xs text-secText mt-0.5">
                          {trip.dateLabel} · {trip.departTime} {trip.departPeriod}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-border pt-2.5 mt-2.5">
                      <Text className="text-xs font-semibold text-text">
                        {trip.seatsBooked} / {trip.seatsTotal}
                      </Text>
                      <Text className="text-xs text-secText">
                        {t("driver.freeSeats", { count: free })}
                      </Text>
                    </View>
                  </Card>
                </Ripple>
              );
            })}
          </View>
        )}

        <Card className="mt-4 bg-primarySoft border-primaryBorder flex-row gap-2.5">
          <Icon name="info-outline" size={18} color={colors.primary} />
          <Text className="text-sm text-primary flex-1 leading-5">{t("driver.manifestHint")}</Text>
        </Card>
      </View>
    </Screen>
  );
}
