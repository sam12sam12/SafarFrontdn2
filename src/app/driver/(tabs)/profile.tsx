import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { DriverProfileSkeleton } from "@/components/skeletons/DriverSkeletons";
import { DriverAvatar } from "@/components/driver/DriverAvatar";
import { AppButton } from "@/components/ui/AppButton";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useDriver } from "@/lib/queries/driversQueries";
import { useSessionStore } from "@/Stores/useSessionStore";
import { colors } from "@/utils/theme";

const DRIVER_ID = "d-wali";

export default function DriverProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const driverQuery = useDriver(DRIVER_ID);
  const { data: driver, isLoading } = driverQuery;
  const setRole = useSessionStore((state) => state.setRole);

  if (isLoading || !driver) {
    return (
      <Screen contentClassName="pb-8">
        <DriverProfileSkeleton />
      </Screen>
    );
  }

  const review = driver.review;

  return (
    <Screen contentClassName="pb-8">
      <View className="px-4">
        <View className="flex-row items-start justify-between mt-4">
          <View>
            <Text className="text-2xs font-bold uppercase tracking-[1.1px] text-muted">
              {t("driver.portal")}
            </Text>
            <Text className="text-2xl font-bold text-text mt-1">{t("driver.profile")}</Text>
          </View>
          <View className="flex-row gap-2">
            <CircleAction
              icon="qr-code-2"
              label={t("driver.qr")}
              onPress={() => showToast("info", t("driver.qr"), t("driver.qrBody"))}
            />
            <CircleAction
              icon="settings"
              label={t("driver.settings")}
              onPress={() => showToast("info", t("driver.settings"), t("driver.settingsBody"))}
            />
          </View>
        </View>

        <Card className="mt-3 p-4">
          <View className="flex-row items-start gap-3">
            <DriverAvatar
              initials={driver.initials}
              size={78}
              tone="soft"
              verified={driver.online}
            />
            <View className="flex-1 pt-1">
              <Text className="text-lg font-bold text-text" numberOfLines={1}>
                {driver.name}
              </Text>
              <Text className="text-xs text-secText mt-0.5">{t("driver.role")}</Text>
              <View className="flex-row items-center gap-1 rounded-full bg-disable border border-border px-2 py-1 mt-2 self-start">
                <Icon name="verified" size={12} color={colors.secText} />
                <Text className="text-2xs font-bold uppercase tracking-[0.6px] text-secText">
                  {t("driver.vetted")}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2 mt-4">
            <ProfileMetric
              label={t("driver.rating")}
              value={`${driver.rating.toFixed(1)} ★`}
            />
            <ProfileMetric label={t("driver.trips")} value={String(driver.totalTrips)} />
            <ProfileMetric label={t("driver.withUs")} value={driver.joinedLabel} />
          </View>
        </Card>

        <Card className="mt-3">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
            {t("driver.chauffeurDetails")}
          </Text>
          <InfoRow label={t("driver.primaryMobile")} value={driver.phone} />
          <View className="h-[1px] bg-secBorder" />
          <InfoRow label={t("driver.homeBase")} value={driver.homeTerminal} />
          <View className="h-[1px] bg-secBorder" />
          <InfoRow label={t("driver.emergency")} value={driver.emergencyContact} />
        </Card>

        <Card className="mt-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
              {t("driver.assignedVehicle")}
            </Text>
            <Badge label={t("driver.activeOnDuty")} tone="green" icon="circle" compact />
          </View>

          <View className="flex-row items-center gap-2.5 mt-3">
            <View className="w-11 h-11 rounded-md bg-primarySoft items-center justify-center">
              <Icon name="directions-car" size={22} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-base-lg font-bold text-text">{driver.vehicleModel}</Text>
              <Text className="text-xs text-secText mt-0.5" numberOfLines={1}>
                {t("driver.vehicleSpecs", {
                  plate: driver.plate,
                  color: driver.vehicleColor ?? "Silver",
                  seats: 4,
                })}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-3">
            <View className="flex-1 rounded-md bg-mainBack border border-border px-2.5 py-2">
              <Text className="text-2xs font-bold uppercase tracking-[0.5px] text-muted">
                {t("driver.nextService")}
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Icon name="build" size={13} color={colors.text} />
                <Text className="text-xs font-bold text-text">
                  {t("driver.nextServiceValue", {
                    km: (driver.nextServiceKm ?? 186000).toLocaleString("en-US"),
                  })}
                </Text>
              </View>
            </View>
            <View className="flex-1 rounded-md bg-mainBack border border-border px-2.5 py-2">
              <Text className="text-2xs font-bold uppercase tracking-[0.5px] text-muted">
                {t("driver.motInspection")}
              </Text>
              <Text className="text-xs font-bold text-text mt-1">
                {t("driver.motValue", { date: driver.motValid ?? "Dec 2026" })}
              </Text>
            </View>
          </View>
        </Card>

        <Card className="mt-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">
              {t("driver.latestReview")}
            </Text>
            <Text className="text-xs font-semibold text-primary">
              {t("driver.viewAll", { count: driver.reviewCount ?? 96 })}
            </Text>
          </View>

          {review ? (
            <View className="rounded-md bg-mainBack border border-border p-3 mt-2.5">
              <View className="flex-row items-center gap-2.5">
                <Avatar initials={review.initials} size="sm" />
                <View className="flex-1">
                  <Text className="text-xs font-bold text-text">{review.author}</Text>
                  <Text className="text-2xs text-muted mt-0.5">
                    {review.route} • {review.ago}
                  </Text>
                </View>
                <Badge label={`${review.rating.toFixed(1)} ★`} tone="amber" compact />
              </View>
              <Text className="text-xs text-secText italic leading-4 mt-2.5">
                “{review.text}”
              </Text>
            </View>
          ) : null}
        </Card>

        <AppButton
          label={t("driver.signOut")}
          variant="danger"
          icon="logout"
          iconPosition="left"
          className="mt-4"
          onPress={() => {
            setRole("passenger");
            router.replace("/");
          }}
        />

        <Text className="text-xs text-muted text-center mt-3">
          {t("driver.version", { version: "2.4.0", build: 491 })}
        </Text>
      </View>
    </Screen>
  );
}

function CircleAction({
  icon,
  label,
  onPress,
}: {
  icon: "qr-code-2" | "settings";
  label: string;
  onPress: () => void;
}) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={label}
      className="w-9 h-9 rounded-full bg-card border border-border items-center justify-center"
    >
      <Icon name={icon} size={18} color={colors.text} />
    </Ripple>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-md bg-mainBack border border-border items-center py-2.5 px-1">
      <Text className="text-2xs font-bold uppercase tracking-[0.5px] text-muted">{label}</Text>
      <Text className="text-lg font-bold text-text mt-1" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-3 py-3">
      <Text className="text-xs text-secText flex-1">{label}</Text>
      <Text className="text-xs font-semibold text-text text-right flex-1" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}
