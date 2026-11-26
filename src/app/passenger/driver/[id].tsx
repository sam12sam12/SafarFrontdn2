import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { DriverDetailsSkeleton as DriverSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { Section } from "@/components/ui/Section";
import { showToast } from "@/components/ui/Toast";
import { useDriver } from "@/lib/queries/driversQueries";
import { colors } from "@/utils/theme";

const CHECKS = [
  {
    icon: "verified-user" as const,
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
  const reviewCount = driver?.reviewCount ?? reviews.length;

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
          {/* Captain card: identity, trust signals, then the two actions. */}
          <Card className="items-center pt-5">
            <Avatar
              initials={driver.initials}
              photo={driver.photo}
              size="2xl"
              verified
              online={driver.online}
            />

            <Text className="text-xl font-bold text-text mt-3 text-center" numberOfLines={1}>
              {driver.name}
            </Text>
            <Text className="text-sm text-secText mt-1">{t("driverDetails.role")}</Text>

            <View className="flex-row items-center gap-2 mt-2.5">
              <Badge
                label={t(`common.${driver.base.toLowerCase()}`)}
                tone="slate"
                icon="place"
                compact
              />
              <Badge
                label={driver.joinedLabel}
                tone="blue"
                icon="workspace-premium"
                compact
              />
            </View>

            <View className="flex-row items-stretch w-full mt-4 rounded-base bg-elevated border border-secBorder">
              <Stat
                label={t("driverDetails.statRating")}
                value={driver.rating.toFixed(1)}
                icon="star"
                iconColor={colors.warning}
              />
              <View className="w-[1px] bg-secBorder my-2.5" />
              <Stat
                label={t("driverDetails.statTrips")}
                value={String(driver.totalTrips)}
              />
              <View className="w-[1px] bg-secBorder my-2.5" />
              <Stat
                label={t("driverDetails.statReviews")}
                value={String(reviewCount)}
              />
            </View>

            <View className="flex-row gap-2.5 w-full mt-4 mb-1">
              <AppButton
                className="flex-1"
                label={t("driverDetails.call")}
                icon="phone"
                iconPosition="left"
                onPress={() =>
                  showToast("info", t("driverDetails.call"), driver.phone)
                }
              />
              <AppButton
                className="flex-1"
                variant="ghost"
                label={t("driverDetails.message")}
                icon="chat-bubble-outline"
                iconPosition="left"
                onPress={() =>
                  showToast("success", t("driverDetails.message"), t("driverDetails.messageSub"))
                }
              />
            </View>
          </Card>

          {/* Contact & base — the practical details a passenger needs. */}
          <Section title={t("driverDetails.contact")}>
            <Card className="py-0 px-4">
              <InfoRow
                icon="phone"
                tone="bg-primarySoft"
                color={colors.primary}
                label={t("driverDetails.phone")}
                value={driver.phone}
              />
              <Divider />
              <InfoRow
                icon="place"
                tone="bg-primarySoft"
                color={colors.primary}
                label={t("driverDetails.base")}
                value={t(`common.${driver.base.toLowerCase()}`)}
              />
              <Divider />
              <InfoRow
                icon="home-work"
                tone="bg-disable"
                color={colors.secText}
                label={t("driverDetails.terminal")}
                value={driver.homeTerminal}
              />
            </Card>
          </Section>

          {/* Compliance: the checks that make the captain trustworthy. */}
          <Section title={t("driverDetails.compliance")}>
            <Card className="py-0 px-4">
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
                  {index < CHECKS.length - 1 ? <Divider /> : null}
                </View>
              ))}
            </Card>
          </Section>

          <Section
            title={t("driverDetails.reviews")}
            action={reviews.length > 1 ? t("driverDetails.seeAll") : undefined}
            onAction={() => showToast("info", t("driverDetails.reviews"), driver.name)}
          >
            {reviews.length === 0 ? (
              <Card flat>
                <Text className="text-sm text-secText">{t("driverDetails.noReviews")}</Text>
              </Card>
            ) : (
              reviews.map((review, index) => (
                <Card key={`${review.author}-${index}`} className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <Avatar initials={review.initials} size="sm" />
                      <View>
                        <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
                          {review.author}
                        </Text>
                        <Text className="text-xs text-secText mt-0.5">{review.ago}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Icon name="star" size={13} color={colors.warning} />
                      <Text className="text-sm font-bold text-text">{review.rating.toFixed(1)}</Text>
                    </View>
                  </View>

                  <Text className="text-sm text-secText leading-5 mt-2.5">“{review.text}”</Text>

                  <View className="flex-row items-center gap-1.5 mt-3 pt-2.5 border-t border-secBorder">
                    <Icon name="route" size={12} color={colors.muted} />
                    <Text className="text-xs text-secText">{review.route}</Text>
                  </View>
                </Card>
              ))
            )}
          </Section>

          <View className="flex-row items-center justify-center gap-1.5 mt-5">
            <Icon name="shield" size={13} color={colors.muted} />
            <Text className="text-sm text-muted text-center">{t("driverDetails.footer")}</Text>
          </View>
        </View>
      )}
    </Screen>
  );
}

function Stat({
  label,
  value,
  icon,
  iconColor,
}: {
  label: string;
  value: string;
  icon?: IconName;
  iconColor?: string;
}) {
  return (
    <View className="flex-1 items-center py-2.5">
      <View className="flex-row items-center gap-1">
        {icon ? <Icon name={icon} size={12} color={iconColor ?? colors.secText} /> : null}
        <Text className="text-base-lg font-bold text-text">{value}</Text>
      </View>
      <Text className="text-2xs font-semibold text-secText mt-0.5" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  tone,
  color,
  label,
  value,
}: {
  icon: IconName;
  tone: string;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-3 py-3.5">
      <View className={`w-9 h-9 rounded-full items-center justify-center ${tone}`}>
        <Icon name={icon} size={17} color={color} />
      </View>
      <Text className="text-base text-secText flex-1">{label}</Text>
      <Text className="text-base-lg font-semibold text-text text-right" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View className="h-[1px] bg-secBorder ms-12" />;
}
