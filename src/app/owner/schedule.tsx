import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { Card } from "@/components/ui/Card";
import { DatePickerSheet } from "@/components/ui/DatePickerSheet";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import type { City, ServiceType } from "@/lib/db/types";
import { useDrivers } from "@/lib/queries/driversQueries";
import { DEMO_TODAY, formatLongDate, formatTripDate } from "@/lib/dates";
import { useScheduleTrip } from "@/lib/queries/tripsQueries";
import { dismissLoading, showLoading } from "@/Stores/useLoadingStore";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const TIMES = [
  { time: "05:00", period: "AM" as const },
  { time: "06:30", period: "AM" as const },
  { time: "08:00", period: "AM" as const },
  { time: "10:00", period: "AM" as const },
  { time: "01:00", period: "PM" as const },
  { time: "02:00", period: "PM" as const },
];

export default function ScheduleTripScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const schedule = useScheduleTrip();
  const { data: drivers } = useDrivers();

  const [from, setFrom] = useState<City>("Kandahar");
  const [to, setTo] = useState<City>("Kabul");
  const [service, setService] = useState<ServiceType>("shared");
  const [date, setDate] = useState(DEMO_TODAY);
  const [dateSheet, setDateSheet] = useState(false);
  const [timeIndex, setTimeIndex] = useState(1);
  const [price, setPrice] = useState("1200");
  const [extra, setExtra] = useState("150");
  const [driverId, setDriverId] = useState<string | undefined>(undefined);
  const [boarding, setBoarding] = useState("Aino Mina Terminal · Gate 3");
  const [restStop, setRestStop] = useState(true);
  const [openForBooking, setOpenForBooking] = useState(true);
  const [note, setNote] = useState("");

  const time = TIMES[timeIndex];

  const availableDrivers = useMemo(() => {
    const inCity = (drivers ?? []).filter((driver) => driver.base === from);
    const freeInCity = inCity.filter((driver) => driver.status === "free");
    return freeInCity.length > 0 ? freeInCity : inCity.filter((driver) => driver.status !== "on-road");
  }, [drivers, from]);

  const monthlyTotal = service === "vip" ? Number(price) || 0 : (Number(price) || 0) * 4 + (Number(extra) || 0);

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
        departTime: time.time,
        arriveTime: "01:15",
        departPeriod: time.period,
        arrivePeriod: "PM",
        service,
        price: numericPrice,
        driverId,
        boardingPoint: boarding,
        dropOffPoint: to === "Kabul" ? "Company Chowk Terminal" : "Aino Mina Terminal",
        draft: !openForBooking,
        note: note.trim() || undefined,
        restStop,
      });
      dismissLoading();
      showToast("success", t("owner.tripPublished"), `${from} → ${to} · ${formatTripDate(date, i18n.language)} ${time.time}`);
      router.back();
    } catch {
      dismissLoading();
      showToast("error", t("owner.couldNotPublish"), t("owner.tryAgain"));
    }
  };

  return (
    <Screen contentClassName="px-4 pb-8">
      <View className="flex-row items-center gap-3 pt-3 pb-4">
        <Ripple
          onPress={() => router.back()}
          accessibilityLabel={t("common.close")}
          className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
        >
          <Icon name="close" size={19} color={colors.text} />
        </Ripple>
        <View className="flex-1">
          <Text className="text-xl font-bold text-text">{t("owner.scheduleTitle")}</Text>
          <Text className="text-sm text-secText mt-0.5">{t("owner.scheduleSubtitle")}</Text>
        </View>
      </View>

      <View className="gap-3">
        <Card className="gap-3">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.stepRoute")}
          </Text>

          <View className="flex-row items-center bg-disable rounded-full p-1">
            {[
              { from: "Kandahar" as City, to: "Kabul" as City },
              { from: "Kabul" as City, to: "Kandahar" as City },
            ].map((option) => {
              const active = from === option.from;
              return (
                <Ripple
                  key={option.from}
                  onPress={() => {
                    setFrom(option.from);
                    setTo(option.to);
                    setDriverId(undefined);
                    setBoarding(
                      option.from === "Kabul"
                        ? "Company Chowk · Gate 1"
                        : "Aino Mina Terminal · Gate 3",
                    );
                  }}
                  accessibilityLabel={`${option.from} to ${option.to}`}
                  accessibilityState={{ selected: active }}
                  className={cn(
                    "flex-1 rounded-full py-2 items-center",
                    active && "bg-card shadow-sm shadow-shadowColor",
                  )}
                >
                  <Text className={cn("text-sm font-semibold", active ? "text-primary" : "text-secText")}>
                    {t(`common.${option.from.toLowerCase()}`)} → {t(`common.${option.to.toLowerCase()}`)}
                  </Text>
                </Ripple>
              );
            })}
          </View>

          <Text className="text-base-lg font-semibold text-text">{t("owner.dateLabel")}</Text>
          <Ripple
            onPress={() => setDateSheet(true)}
            accessibilityLabel={t("common.selectDate")}
            className="flex-row items-center gap-3 rounded-base border border-border bg-elevated px-3 py-3"
          >
            <Icon name="calendar-today" size={18} color={colors.primary} />
            <Text className="flex-1 text-base-lg font-semibold text-text">
              {formatLongDate(date, i18n.language)}
            </Text>
            <Icon name="expand-more" size={20} color={colors.muted} />
          </Ripple>

          <Text className="text-base-lg font-semibold text-text">{t("owner.departureTime")}</Text>
          <View className="flex-row flex-wrap gap-2">
            {TIMES.map((item, index) => {
              const active = index === timeIndex;
              return (
                <Ripple
                  key={`${item.time}-${item.period}`}
                  onPress={() => setTimeIndex(index)}
                  accessibilityLabel={`${item.time} ${item.period}`}
                  accessibilityState={{ selected: active }}
                  className={cn(
                    "rounded-base border px-3 py-2 items-center",
                    active ? "bg-primary border-primary" : "bg-card border-border",
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm font-semibold",
                      active ? "text-onPrimary" : "text-text",
                    )}
                  >
                    {item.time} {item.period}
                  </Text>
                </Ripple>
              );
            })}
          </View>
          <Text className="text-sm text-muted">
            {t("owner.arrivesAbout", { time: "01:15 PM", km: 483, duration: "6h 45m" })}
          </Text>
        </Card>

        <Card className="gap-3">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.stepPrice")}
          </Text>
          <View className="flex-row gap-2">
            {[
              {
                value: "shared" as ServiceType,
                title: t("owner.sharedSeats"),
                hint: t("owner.sharedSeatsHint"),
              },
              {
                value: "vip" as ServiceType,
                title: t("owner.vipWholeCar"),
                hint: t("owner.vipWholeCarHint"),
              },
            ].map((option) => {
              const active = service === option.value;
              return (
                <Ripple
                  key={option.value}
                  onPress={() => {
                    setService(option.value);
                    setPrice(option.value === "vip" ? "4800" : "1200");
                  }}
                  accessibilityLabel={option.title}
                  accessibilityState={{ selected: active }}
                  className={cn(
                    "flex-1 rounded-base border p-2.5",
                    active ? "border-primary bg-primarySoft" : "border-border bg-card",
                  )}
                >
                  <Text className={cn("text-base-lg font-bold", active ? "text-primary" : "text-text")}>
                    {option.title}
                  </Text>
                  <Text className="text-2xs text-secText mt-0.5">{option.hint}</Text>
                </Ripple>
              );
            })}
          </View>

          <View className="flex-row gap-2.5">
            <Field
              className="flex-1"
              label={t("owner.pricePerSeat")}
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              right={<Text className="text-sm font-semibold text-muted">{t("common.afn")}</Text>}
            />
            <Field
              className="flex-1"
              label={t("owner.extraLegroom")}
              value={extra}
              onChangeText={setExtra}
              keyboardType="number-pad"
              right={<Text className="text-sm font-semibold text-muted">{t("common.afn")}</Text>}
            />
          </View>
        </Card>

        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              {t("owner.stepDriver")}
            </Text>
            <Text className="text-sm font-semibold text-success">
              {t("owner.freeIn", { city: from })}
            </Text>
          </View>

          {availableDrivers.slice(0, 4).map((driver) => {
            const active = driverId === driver.id;
            return (
              <Ripple
                key={driver.id}
                onPress={() => setDriverId(active ? undefined : driver.id)}
                accessibilityLabel={driver.name}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                className={cn(
                  "flex-row items-center gap-2.5 rounded-base border p-2.5",
                  active ? "border-primary" : "border-border",
                )}
              >
                <View className="w-9 h-9 rounded-full bg-primarySoft items-center justify-center">
                  <Text className="text-sm font-bold text-primary">{driver.initials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base-lg font-semibold text-text">{driver.name}</Text>
                  <View className="flex-row items-center gap-1">
                    <Icon name="star" size={10} color={colors.warning} />
                    <Text className="text-2xs text-secText">
                      {driver.rating.toFixed(1)} · Fielder {driver.plate} · {t("owner.freeAllDay")}
                    </Text>
                  </View>
                </View>
                <Icon
                  name={active ? "radio-button-checked" : "radio-button-unchecked"}
                  size={20}
                  color={active ? colors.primary : colors.slate}
                />
              </Ripple>
            );
          })}

          <Ripple
            onPress={() => setDriverId(undefined)}
            accessibilityLabel={t("owner.leaveWithoutDriver")}
            className="items-center py-1"
          >
            <Text className="text-base-lg font-semibold text-primary">
              {t("owner.leaveWithoutDriver")}
            </Text>
          </Ripple>
        </Card>

        <Card className="gap-3">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.stepBoarding")}
          </Text>

          <Text className="text-base-lg font-semibold text-text">{t("owner.boardingPoint")}</Text>
          <Ripple
            onPress={() =>
              setBoarding((current) =>
                current.includes("Gate 3")
                  ? from === "Kabul"
                    ? "Company Chowk · Gate 1"
                    : "Aino Mina Terminal · Gate 1"
                  : from === "Kabul"
                    ? "Sarai Shahzada · Gate 2"
                    : "Aino Mina Terminal · Gate 3",
              )
            }
            accessibilityLabel={t("owner.boardingPoint")}
            className="flex-row items-center justify-between rounded-base border border-border bg-elevated px-3 py-3"
          >
            <Text className="text-base-lg text-text flex-1" numberOfLines={1}>
              {boarding}
            </Text>
            <Icon name="expand-more" size={20} color={colors.muted} />
          </Ripple>

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base-lg font-semibold text-text">{t("owner.ghazniStop")}</Text>
              <Text className="text-sm text-secText">{t("owner.ghazniStopHint")}</Text>
            </View>
            <Toggle
              value={restStop}
              onChange={setRestStop}
              accessibilityLabel={t("owner.ghazniStop")}
            />
          </View>

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base-lg font-semibold text-text">
                {t("owner.openForBooking")}
              </Text>
              <Text className="text-sm text-secText">{t("owner.openForBookingHint")}</Text>
            </View>
            <Toggle
              value={openForBooking}
              onChange={setOpenForBooking}
              accessibilityLabel={t("owner.openForBooking")}
            />
          </View>

          <Field
            label={t("owner.noteToDriver")}
            placeholder={t("owner.noteToDriverPlaceholder")}
            value={note}
            onChangeText={setNote}
            multiline
          />
        </Card>

        <View className="rounded-lg bg-primary p-3.5 shadow-card shadow-shadowColor">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-onPrimary/70">
            {t("owner.summary")}
          </Text>
          <Text className="text-lg font-bold text-onPrimary mt-0.5">
            {from} → {to} · {time.time} {time.period}
          </Text>
          <Text className="text-sm text-onPrimary/75 mt-0.5">
            {formatTripDate(date, i18n.language)} · {service === "vip" ? t("owner.vipWholeCar") : t("owner.sharedSeats")} ·{" "}
            {availableDrivers.find((driver) => driver.id === driverId)?.name ?? t("owner.optional")}
          </Text>
          <View className="h-[1px] bg-onPrimary/20 my-2.5" />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-onPrimary/75">{t("owner.ifFullyBooked")}</Text>
            <Text className="text-lg font-bold text-onPrimary">
              {monthlyTotal.toLocaleString("en-US")} {t("common.afn")}
            </Text>
          </View>
        </View>

        <AppButton
          label={t("owner.scheduleSubmit")}
          icon="check"
          iconPosition="left"
          loading={schedule.isPending}
          onPress={submit}
        />
      </View>

      <DatePickerSheet
        visible={dateSheet}
        onClose={() => setDateSheet(false)}
        value={date}
        onChange={setDate}
      />
    </Screen>
  );
}
