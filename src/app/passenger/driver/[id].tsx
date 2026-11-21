import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

import { DriverDetailsSkeleton as DriverSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useDriver } from "@/lib/queries/driversQueries";
import { colors } from "@/utils/theme";

const CHECKS = [
  {
    icon: "check-circle" as const,
    tone: "bg-successSoft",
    color: colors.success,
    titleKey: "driverDetails.mot",
    detailKey: "driverDetails.motDetail",
    badgeKey: "driverDetails.motBadge",
    badgeTone: "green" as const,
  },
  {
    icon: "fingerprint" as const,
    tone: "bg-primarySoft",
    color: colors.primary,
    titleKey: "driverDetails.nsia",
    detailKey: "driverDetails.nsiaDetail",
    badgeKey: "driverDetails.nsiaBadge",
    badgeTone: "blue" as const,
  },
  {
    icon: "shield" as const,
    tone: "bg-primarySoft",
    color: colors.primary,
    titleKey: "driverDetails.infractions",
    detailKey: "driverDetails.infractionsDetail",
    badgeKey: undefined,
    badgeTone: undefined,
  },
];

export default function DriverDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const driverQuery = useDriver(id);
  const { data: driver } = driverQuery;

  const reviews = driver?.reviews ?? (driver?.review ? [driver.review] : []);

  return (
    <Screen
      contentClassName="pb-10"
      refreshing={driverQuery.isRefetching}
      onRefresh={driverQuery.refetch}
    >
      <AppHeader title={t("driverDetails.title")} />

      {driverQuery.isLoading || !driver ? (
        <DriverSkeleton />
      ) : (
        <View className="px-4">
          <Card>
            <View className="flex-row items-center gap-4">
              <Avatar initials={driver.initials} photo={driver.photo} size="2xl" verified />
              <View className="flex-1">
                <Text className="text-xl font-bold text-text" numberOfLines={1}>
                  {driver.name}
                </Text>
                <Text className="text-sm text-secText mt-1">{t("driverDetails.role")}</Text>
                <View className="flex-row items-center gap-1.5 mt-1">
                  <Icon name="star" size={14} color={colors.warning} />
                  <Text className="text-base-lg font-bold text-text">
                    {driver.rating.toFixed(1)}
                  </Text>
                  <Text className="text-xs text-secText">
                    • {t("driverDetails.tripsCompleted", { count: driver.totalTrips })}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-2.5 w-full mt-4">
              <Ripple
                onPress={() => showToast("info", t("driverDetails.call"), driver.phone)}
                accessibilityLabel={t("driverDetails.call")}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-md border border-primaryBorder py-3.5"
              >
                <Icon name="phone" size={17} color={colors.muted} />
                <Text className="text-base-lg font-semibold text-muted">
                  {t("driverDetails.call")}
                </Text>
              </Ripple>
              <Ripple
                onPress={() =>
                  showToast("success", t("driverDetails.message"), t("driverDetails.role"))
                }
                accessibilityLabel={t("driverDetails.message")}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-md border border-border py-3.5"
              >
                <Icon name="chat-bubble-outline" size={17} color={colors.secText} />
                <Text className="text-base-lg font-semibold text-secText">
                  {t("driverDetails.message")}
                </Text>
              </Ripple>
            </View>
          </Card>

          <Card className="p-3 mt-3">
            <View className="rounded-base overflow-hidden">
              <Image
                source={require("@/assets/images/car-hero.jpg")}
                style={{ width: "100%", height: 158 }}
                contentFit="cover"
              />
              <View className="absolute right-2.5 bottom-2.5 flex-row items-center gap-1.5 bg-card/95 rounded-full px-2.5 py-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text className="text-sm font-semibold text-text">
                  {t("home.liveTransit")}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-3 px-1">
              <View>
                <Text className="text-base-lg font-bold text-text">Toyota Fielder X 2018</Text>
                <Text className="text-sm text-secText mt-0.5">{t("home.fleetSpec")}</Text>
              </View>
              <Badge label={t("home.vettedDriver")} tone="blue" icon="verified-user" />
            </View>

            <View className="flex-row items-start justify-between mt-3 px-1 mb-1">
              <View>
                <Text className="text-2xs font-bold text-muted">{t("home.transitWindow")}</Text>
                <Text className="text-base-lg font-bold text-primary mt-0.5">
                  {t("home.transitTime")}
                </Text>
              </View>
              <View>
                <Text className="text-2xs font-bold text-muted">{t("home.passengerCap")}</Text>
                <Text className="text-base-lg font-bold text-text mt-0.5">
                  {t("home.maxSeats")}
                </Text>
              </View>
              <View>
                <Text className="text-2xs font-bold text-muted">{t("home.startingRate")}</Text>
                <Text className="text-base-lg font-bold text-text mt-0.5">AFN 1,200</Text>
              </View>
            </View>
          </Card>

          <Card className="py-0 px-4 mt-3">
            {CHECKS.map((check, index) => (
              <View key={check.titleKey}>
                <View className="flex-row items-center gap-3 py-3.5">
                  <View
                    className={`w-9 h-9 rounded-full items-center justify-center ${check.tone}`}
                  >
                    <Icon name={check.icon} size={18} color={check.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base-lg font-semibold text-text">
                      {t(check.titleKey)}
                    </Text>
                    <Text className="text-sm text-secText mt-0.5 leading-4">
                      {t(check.detailKey)}
                    </Text>
                  </View>
                  {check.badgeKey ? (
                    <Badge label={t(check.badgeKey)} tone={check.badgeTone} compact />
                  ) : null}
                </View>
                {index < CHECKS.length - 1 ? <View className="h-[1px] bg-secBorder ml-12" /> : null}
              </View>
            ))}
          </Card>

          <View className="flex-row items-center justify-between mt-5 mb-2.5 px-1">
            <View className="flex-row items-center gap-2">
              <Icon name="star-border" size={19} color={colors.primary} />
              <Text className="text-lg font-bold text-text">{t("driverDetails.reviews")}</Text>
            </View>
            <Ripple
              onPress={() =>
                showToast("info", t("driverDetails.reviews"), t("driverDetails.seeAll"))
              }
              accessibilityLabel={t("driverDetails.seeAll")}
            >
              <Text className="text-sm font-bold text-primary">{t("driverDetails.seeAll")}</Text>
            </Ripple>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 pr-4"
          >
            {reviews.map((review, index) => (
              <Card key={`${review.author}-${index}`} className="p-4" style={{ width: 282 }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Avatar initials={review.initials} size="sm" />
                    <Text className="text-base-lg font-bold text-text">{review.author}</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Icon name="star" size={12} color={colors.warning} />
                    <Text className="text-sm font-bold text-warning">
                      {review.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>

                <Text className="text-sm text-secText italic leading-5 mt-2.5">
                  “{review.text}”
                </Text>

                <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-secBorder">
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <Text className="text-xs text-secText">{review.route}</Text>
                  </View>
                  <Text className="text-xs text-muted">{review.ago}</Text>
                </View>
              </Card>
            ))}
          </ScrollView>

          <View className="flex-row items-center justify-center gap-1.5 mt-4">
            <Icon name="shield" size={13} color={colors.muted} />
            <Text className="text-sm text-muted">{t("driverDetails.footer")}</Text>
          </View>
        </View>
      )}
    </Screen>
  );
}
