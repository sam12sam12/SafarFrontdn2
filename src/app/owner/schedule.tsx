import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { showToast } from "@/components/ui/Toast";
import type { City, ServiceType } from "@/lib/db/types";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useScheduleTrip } from "@/lib/queries/tripsQueries";
import { dismissLoading, showLoading } from "@/Stores/useLoadingStore";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

export default function ScheduleTripScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const schedule = useScheduleTrip();
  const { data: drivers } = useDrivers();

  const [from, setFrom] = useState<City>("Kandahar");
  const [to, setTo] = useState<City>("Kabul");
  const [service, setService] = useState<ServiceType>("shared");
  const [date, setDate] = useState("2026-11-20");
  const [dateLabel, setDateLabel] = useState("Fri 20 Nov");
  const [departTime, setDepartTime] = useState("07:00");
  const [price, setPrice] = useState(service === "vip" ? "4800" : "1200");
  const [driverId, setDriverId] = useState<string | undefined>(undefined);

  const availableDrivers = useMemo(
    () => (drivers ?? []).filter((driver) => driver.status !== "on-road"),
    [drivers],
  );

  const submit = async () => {
    const numericPrice = Number(price);
    if (!numericPrice || numericPrice < 100) {
      showToast("error", t("owner.checkFare"), t("owner.checkFareBody"));
      return;
    }

    showLoading(t("owner.publishing"));
    try {
      await schedule.mutateAsync({
        from,
        to,
        date,
        dateLabel,
        departTime,
        arriveTime: "01:45",
        departPeriod: "AM",
        arrivePeriod: "PM",
        service,
        price: numericPrice,
        driverId,
        boardingPoint: from === "Kabul" ? "Company Chowk · Gate 1" : "Aino Mina Terminal · Gate 3",
        dropOffPoint: to === "Kabul" ? "Company Chowk Terminal" : "Aino Mina Terminal",
      });
      dismissLoading();
      showToast("success", t("owner.tripPublished"), `${from} → ${to} · ${dateLabel} ${departTime}`);
      router.back();
    } catch {
      dismissLoading();
      showToast("error", t("owner.couldNotPublish"), t("owner.tryAgain"));
    }
  };

  return (
    <Screen contentClassName="pb-8">
      <AppHeader title={t("owner.scheduleTitle")} subtitle={t("owner.scheduleSubtitle")} />

      <View className="px-4 gap-3">
        <Card>
          <Text className="text-base-lg font-bold text-text mb-2.5">{t("owner.direction")}</Text>
          <View className="flex-row items-center gap-2">
            {([from, to] as City[]).map((city, index) => (
              <Ripple
                key={city}
                onPress={() => {
                  if (index === 1) {
                    setFrom(to);
                    setTo(from);
                  }
                }}
                accessibilityLabel={`${t(`common.${city.toLowerCase()}`)} terminal`}
                className={cn(
                  "flex-1 rounded-base border px-3 py-2.5",
                  index === 0 ? "bg-primarySoft border-primaryBorder" : "bg-elevated border-border",
                )}
              >
                <Text className={cn("text-base-lg font-bold", index === 0 ? "text-primary" : "text-text")}>
                  {t(`common.${city.toLowerCase()}`)}
                </Text>
                <Text className="text-sm text-secText mt-0.5">
                  {city === "Kabul" ? "Company Chowk" : "Aino Mina"}
                </Text>
              </Ripple>
            ))}
            <Ripple
              onPress={() => {
                setFrom(to);
                setTo(from);
              }}
              accessibilityLabel={t("owner.swapDirection")}
              className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
            >
              <Icon name="swap-horiz" size={18} color={colors.primary} />
            </Ripple>
          </View>
        </Card>

        <Card className="gap-3">
          <Text className="text-base-lg font-bold text-text">{t("owner.departureSection")}</Text>
          <View className="flex-row gap-2.5">
            <Field className="flex-1" label={t("owner.dateIso")} value={date} onChangeText={setDate} icon="calendar-today" />
            <Field className="w-28" label={t("owner.dateLabelField")} value={dateLabel} onChangeText={setDateLabel} />
          </View>
          <View className="flex-row gap-2.5">
            <Field
              className="flex-1"
              label={t("owner.departureTime")}
              value={departTime}
              onChangeText={setDepartTime}
              icon="schedule"
            />
            <Field
              className="flex-1"
              label={t("owner.fareAfn")}
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
            />
          </View>
        </Card>

        <Card>
          <Text className="text-base-lg font-bold text-text mb-2.5">{t("owner.serviceMode")}</Text>
          <Segmented
            options={[
              { label: t("owner.sharedSeat"), value: "shared" },
              { label: t("owner.vipWholeCar"), value: "vip" },
            ]}
            value={service}
            onChange={(value) => {
              setService(value as ServiceType);
              setPrice(value === "vip" ? "4800" : "1200");
            }}
            compact
          />
          <Text className="text-sm text-secText mt-2">
            {service === "vip" ? t("owner.vipModeHint") : t("owner.sharedModeHint")}
          </Text>
        </Card>

        <Card>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base-lg font-bold text-text">{t("owner.assignDriver")}</Text>
            <Badge label={t("owner.optional")} tone="slate" compact />
          </View>
          <View className="gap-2">
            {availableDrivers.slice(0, 5).map((driver) => {
              const active = driverId === driver.id;
              return (
                <Ripple
                  key={driver.id}
                  onPress={() => setDriverId(active ? undefined : driver.id)}
                  accessibilityLabel={`${t("owner.assignDriver")}: ${driver.name}`}
                  className={cn(
                    "flex-row items-center gap-2.5 rounded-base border px-3 py-2.5",
                    active ? "border-primary bg-primarySoft" : "border-border bg-card",
                  )}
                >
                  <View className="w-8 h-8 rounded-full bg-card border border-border items-center justify-center">
                    <Text className="text-sm font-bold text-primary">{driver.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base-lg font-semibold text-text">{driver.name}</Text>
                    <Text className="text-sm text-secText">
                      {driver.base} · {driver.plate}
                    </Text>
                  </View>
                  <Icon
                    name={active ? "check-circle" : "radio-button-unchecked"}
                    size={18}
                    color={active ? colors.primary : colors.slate}
                  />
                </Ripple>
              );
            })}
          </View>
        </Card>

        <Card className="bg-primarySoft border-primaryBorder flex-row gap-2.5">
          <Icon name="info-outline" size={18} color={colors.primary} />
          <Text className="text-base text-primary flex-1 leading-5">{t("owner.publishHint")}</Text>
        </Card>

        <AppButton
          label={t("owner.publishDeparture")}
          icon="arrow-forward"
          loading={schedule.isPending}
          onPress={submit}
        />
      </View>
    </Screen>
  );
}
