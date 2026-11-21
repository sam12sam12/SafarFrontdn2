import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { Icon } from "@/components/ui/Icon";
import { Rating } from "@/components/ui/Rating";
import { Screen } from "@/components/ui/Screen";
import { StatTile } from "@/components/ui/StatTile";
import { showToast } from "@/components/ui/Toast";
import { OwnerDriverProfileSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { useDriver } from "@/lib/queries/driversQueries";
import { colors } from "@/utils/theme";

export default function OwnerDriverProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const driverQuery = useDriver(id);
  const { data: driver } = driverQuery;

  const STATUS_LABEL = {
    "on-road": t("owner.statusOnRoad"),
    "trip-today": t("owner.statusTripToday"),
    free: t("owner.statusFree"),
    rest: t("owner.statusRest"),
  } as const;

  if (driverQuery.isLoading || !driver) {
    return (
      <Screen contentClassName="pb-8">
        <AppHeader title={t("owner.driverProfileTitle")} />
        <OwnerDriverProfileSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="pb-8">
      <AppHeader
        title={t("owner.driverProfileTitle")}
        subtitle={t("owner.baseJoined", { base: t(`common.${driver.base.toLowerCase()}`), joined: driver.joinedLabel })}
        right={<Badge label={STATUS_LABEL[driver.status]} tone="blue" />}
      />

      <View className="px-4 gap-3">
        <Card className="items-center py-5">
          <Avatar initials={driver.initials} photo={driver.photo} size="xl" verified />
          <Text className="text-xl font-bold text-text mt-3">{driver.name}</Text>
          <Rating
            value={driver.rating}
            count={`· ${t("profile.tripsCount", { count: driver.totalTrips })}`}
            className="mt-1.5"
          />
          <Text className="text-sm text-secText mt-1 text-center">{driver.statusNote}</Text>
        </Card>

        <View className="flex-row gap-2.5">
          <StatTile label={t("owner.thisMonth")} value={driver.tripsThisMonth} hint={t("owner.tripsSuffix")} className="flex-1" />
          <StatTile label={t("owner.lifetime")} value={driver.totalTrips} hint={t("owner.tripsSuffix")} className="flex-1" />
          <StatTile
            label={t("owner.permit")}
            value={`${driver.permitEndsInDays ?? 0}d`}
            hint={t("owner.remaining")}
            className="flex-1"
          />
        </View>

        <Card>
          <Text className="text-base-lg font-bold text-text mb-2">{t("owner.vehicleSection")}</Text>
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-base bg-primarySoft items-center justify-center">
              <Icon name="directions-car" size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-base-lg font-semibold text-text">{driver.vehicleModel}</Text>
              <Text className="text-sm text-secText">Plate {driver.plate}</Text>
            </View>
            <Badge label={t("owner.active")} tone="green" compact />
          </View>
          <View className="h-[1px] bg-secBorder my-2.5" />
          <DetailRow label={t("owner.homeTerminal")} value={driver.homeTerminal} />
          <DetailRow label={t("owner.motInspection")} value={t("owner.motValid")} tone="success" />
          <DetailRow label={t("owner.nsiaClearance")} value={t("owner.verified")} tone="success" />
        </Card>

        <Card>
          <Text className="text-base-lg font-bold text-text mb-2">{t("owner.contact")}</Text>
          <DetailRow label={t("owner.mobile")} value={driver.phone} />
          <DetailRow label={t("owner.emergencyContact")} value={driver.emergencyContact} />
          <DetailRow label={t("owner.baseCity")} value={t(`common.${driver.base.toLowerCase()}`)} />
        </Card>

        {driver.review ? (
          <Card>
            <View className="flex-row items-center justify-between">
              <Text className="text-base-lg font-bold text-text">{t("owner.latestReview")}</Text>
              <Badge label={`★ ${driver.review.rating.toFixed(1)}`} tone="amber" compact />
            </View>
            <Text className="text-base text-secText italic leading-6 mt-2">
              “{driver.review.text}”
            </Text>
            <Text className="text-sm text-muted mt-2">
              {driver.review.author} · {driver.review.route} · {driver.review.ago}
            </Text>
          </Card>
        ) : null}

        <View className="flex-row gap-2.5">
          <AppButton
            label={t("owner.callDriver")}
            variant="secondary"
            icon="phone"
            iconPosition="left"
            className="flex-1"
            onPress={() => showToast("info", t("owner.calling"), driver.phone)}
          />
          <AppButton
            label={t("owner.assignToTrip")}
            icon="assignment-turned-in"
            iconPosition="left"
            className="flex-1"
            onPress={() => showToast("info", t("owner.assignmentToast"), t("owner.assignmentToastSub"))}
          />
        </View>

        <Card className="bg-primarySoft border-primaryBorder flex-row gap-2.5">
          <Icon name="verified-user" size={18} color={colors.primary} />
          <Text className="text-base text-primary flex-1 leading-5">{t("owner.complianceHint")}</Text>
        </Card>
      </View>
    </Screen>
  );
}
