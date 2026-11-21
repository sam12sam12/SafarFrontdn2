import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import type { Driver, Trip } from "@/lib/db/types";
import { colors } from "@/utils/theme";

/* ------------------------------------------------------------------ hero */

type HeroProps = {
  trip: Trip;
  driver?: Driver;
  onPress: () => void;
};

export function DriverHeroCard({ trip, driver, onPress }: HeroProps) {
  const { t } = useTranslation();
  const from = t(`common.${trip.from.toLowerCase()}`);
  const to = t(`common.${trip.to.toLowerCase()}`);
  const boardingLabel = trip.boardingPoint.split(" · ")[0];
  const dropOffLabel = trip.dropOffPoint.replace(" Terminal", "");
  const vehicleModel = (driver?.vehicleModel ?? "Toyota Fielder").replace(/\s+\d{4}$/, "");

  return (
    <LinearGradient
      colors={["#2563EB", "#1D4ED8", "#1E40AF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-xl p-4 mt-3 overflow-hidden"
      style={{ borderRadius: 20 }}
    >
      <View className="absolute -right-7 bottom-8 opacity-[0.07]">
        <Icon name="directions-car" size={190} color="#FFFFFF" />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-2.5 py-1">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
          <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-white">
            {t("driver.nextTripToday")}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-warning/20 border border-warning/40 px-2.5 py-1">
          <Icon name="schedule" size={12} color="#FCD34D" />
          <Text className="text-2xs font-semibold text-amber-100">
            {t("driver.startsIn", { time: "2h 15m" })}
          </Text>
        </View>
      </View>

      <View className="flex-row items-start justify-between mt-4">
        <View className="flex-1">
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-white">{trip.departTime}</Text>
            <Text className="text-xs font-semibold text-white/70">{trip.departPeriod}</Text>
          </View>
          <Text className="text-lg font-bold text-white mt-0.5">{from}</Text>
          <Text className="text-2xs text-white/70 mt-0.5" numberOfLines={1}>
            {boardingLabel}
          </Text>
        </View>

        <View className="items-center px-2 pt-1">
          <Text className="text-2xs text-white/70 mb-1">{trip.duration}</Text>
          <View className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-white" />
            <View className="w-10 h-[2px] bg-white/40" />
            <View className="w-1.5 h-1.5 rounded-full bg-white/50 border border-white" />
            <View className="w-10 h-[2px] bg-white/40" />
            <View className="w-1.5 h-1.5 rounded-full bg-white" />
          </View>
          <Text className="text-2xs text-white/70 mt-1">{trip.distanceKm} km</Text>
        </View>

        <View className="flex-1 items-end">
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-white">{trip.arriveTime}</Text>
            <Text className="text-xs font-semibold text-white/70">{trip.arrivePeriod}</Text>
          </View>
          <Text className="text-lg font-bold text-white mt-0.5">{to}</Text>
          <Text className="text-2xs text-white/70 mt-0.5" numberOfLines={1}>
            {dropOffLabel}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mt-4">
        <View className="flex-1 rounded-md bg-white/10 border border-white/15 px-2.5 py-2">
          <Text className="text-2xs font-semibold uppercase tracking-[0.8px] text-white/60">
            {t("driver.reportAt")}
          </Text>
          <Text className="text-base-lg font-bold text-white mt-1">
            {trip.reportTime ?? "06:00"} AM
          </Text>
        </View>
        <View className="flex-1 rounded-md bg-white/10 border border-white/15 px-2.5 py-2">
          <Text className="text-2xs font-semibold uppercase tracking-[0.8px] text-white/60">
            {t("driver.passengersLabel")}
          </Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Text className="text-base-lg font-bold text-white">
              {t("driver.passengersCount", { booked: trip.seatsBooked, total: trip.seatsTotal })}
            </Text>
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
          </View>
        </View>
        <View className="flex-1 rounded-md bg-white/10 border border-white/15 px-2.5 py-2">
          <Text className="text-2xs font-semibold uppercase tracking-[0.8px] text-white/60">
            {t("driver.boarding")}
          </Text>
          <Text className="text-base-lg font-bold text-white mt-1">
            {trip.gate ?? "Gate 3"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2 rounded-md bg-primaryDark/60 border border-white/10 px-2.5 py-2 mt-2">
        <Icon name="directions-car" size={17} color="#FFD166" />
        <Text className="flex-1 text-sm font-semibold text-white" numberOfLines={1}>
          {vehicleModel} • {trip.vehiclePlate}
        </Text>
        <View className="rounded-sm bg-white/15 px-2 py-1">
          <Text className="text-2xs font-bold text-white uppercase">
            {t("driver.sharedExpress")}
          </Text>
        </View>
      </View>

      <Ripple
        onPress={onPress}
        accessibilityLabel={t("driver.viewSeats")}
        className="bg-card rounded-md py-3 mt-3 flex-row items-center justify-center gap-1.5"
      >
        <Text className="text-md font-bold text-primary">{t("driver.viewSeats")}</Text>
        <Icon name="arrow-forward" size={17} color={colors.primary} />
      </Ripple>
    </LinearGradient>
  );
}

/* -------------------------------------------------------------- schedule */

type ScheduleProps = {
  trip: Trip;
  onPress: () => void;
};

export function DriverScheduleCard({ trip, onPress }: ScheduleProps) {
  const { t } = useTranslation();
  const [day, date] = trip.dateLabel.split(" ");
  const vip = trip.service === "vip";
  const pct = Math.round((trip.seatsBooked / Math.max(trip.seatsTotal, 1)) * 100);
  const progressTone = pct >= 50 ? "bg-success" : "bg-warning";

  return (
    <Ripple onPress={onPress} accessibilityLabel={`${trip.from} to ${trip.to}`}>
      <Card className="flex-row gap-3 p-3">
        <View className="w-12 h-14 rounded-md bg-mainBack items-center justify-center">
          <Text className="text-2xs font-bold uppercase tracking-[0.5px] text-muted">
            {day}
          </Text>
          <Text className="text-xl font-bold text-text mt-0.5">{date}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <View className="flex-row items-center gap-1">
                <Text className="text-base-lg font-bold text-text">
                  {t(`common.${trip.from.toLowerCase()}`)}
                </Text>
                <Icon name="arrow-forward" size={12} color={colors.muted} />
                <Text className="text-base-lg font-bold text-text">
                  {t(`common.${trip.to.toLowerCase()}`)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Text className="text-xs text-secText">
                  {trip.departTime} {trip.departPeriod}
                </Text>
                <Text className="text-xs text-muted">·</Text>
                <Text className="text-xs text-secText" numberOfLines={1}>
                  {trip.boardingPoint.replace(" · ", " ")}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <Badge
                label={vip ? t("driver.vipFamily") : t("driver.shared")}
                tone={vip ? "violet" : "blue"}
                compact
              />
              <Text className="text-xs font-semibold text-text mt-1.5">
                {vip
                  ? t("driver.wholeCar")
                  : t("driver.seatsCount", { booked: trip.seatsBooked, total: trip.seatsTotal })}
              </Text>
            </View>
          </View>

          {vip ? (
            <View className="flex-row items-center gap-1 mt-2">
              <Icon name="payments" size={12} color={colors.success} />
              <Text className="text-xs font-semibold text-success" numberOfLines={1}>
                {t("driver.cashCollect", { amount: trip.price.toLocaleString("en-US") })}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-2 mt-2.5">
              <View className="flex-1 h-1.5 rounded-full bg-disable overflow-hidden">
                <View
                  className={`h-1.5 rounded-full ${progressTone}`}
                  style={{ width: `${pct}%` }}
                />
              </View>
              <Text
                className={`text-xs font-semibold ${
                  pct >= 50 ? "text-success" : "text-warning"
                }`}
              >
                {t("driver.seatsCount", { booked: trip.seatsBooked, total: trip.seatsTotal })}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Ripple>
  );
}
