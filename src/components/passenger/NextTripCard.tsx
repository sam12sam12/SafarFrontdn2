import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

import type { Booking, Driver, Trip } from "@/lib/db/types";
import { daysUntil, to24Hour } from "@/lib/format";
import { Avatar } from "../ui/Avatar";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";

type Props = {
  booking: Booking;
  trip: Trip;
  driver?: Driver;
  onCall: () => void;
  onShare: () => void;
  onOpen?: () => void;
};

export function NextTripCard({ booking, trip, driver, onCall, onShare, onOpen }: Props) {
  const { t } = useTranslation();
  const [primaryDark, primary, primaryLight, onPrimary] = useCSSVariable([
    "--color-primaryDark",
    "--color-primary",
    "--color-primaryLight",
    "--color-onPrimary",
  ]) as string[];

  const departsIn = daysUntil(trip.date);
  const seatPosition = booking.seats.includes("01") ? t("common.frontWindow") : t("common.window");

  return (
    <LinearGradient
      colors={[primaryDark, primary, primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-xl p-4 overflow-hidden"
      style={{ borderRadius: 20 }}
    >
      <View className="absolute -right-7 bottom-8 opacity-10">
        <Icon name="directions-car" size={190} color="#FFFFFF" />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5 rounded-full bg-card/15 border border-card/20 px-2.5 py-1">
          <View className="w-1.5 h-1.5 rounded-full bg-success" />
          <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-onPrimary">
            {t("bookings.nextTrip")}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-card px-2.5 py-1">
          <Icon name="check-circle" size={11} color="#10B981" />
          <Text className="text-2xs font-bold text-text">{t("bookings.confirmedPaid")}</Text>
        </View>
      </View>

      <View className="flex-row items-start justify-between mt-4">
        <View className="flex-1">
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-onPrimary">{trip.departTime}</Text>
            <Text className="text-xs font-semibold text-onPrimary/70">{trip.departPeriod}</Text>
          </View>
          <Text className="text-md font-bold text-onPrimary mt-0.5">
            {t(`common.${trip.from.toLowerCase()}`)}
          </Text>
        </View>

        <View className="items-center px-2 pt-1">
          <Text className="text-2xs text-onPrimary/70 mb-1">{trip.duration}</Text>
          <View className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-onPrimary" />
            <View className="w-9 h-0.5 bg-onPrimary/40" />
            <Icon name="directions-car" size={12} color={onPrimary} />
            <View className="w-9 h-0.5 bg-onPrimary/40" />
            <View className="w-1.5 h-1.5 rounded-full bg-onPrimary" />
          </View>
          <Text className="text-2xs text-onPrimary/70 mt-1">{trip.distanceKm} km</Text>
        </View>

        <View className="flex-1 items-end">
          <Text className="text-2xl font-bold text-onPrimary">
            {to24Hour(trip.arriveTime, trip.arrivePeriod)}
          </Text>
          <Text className="text-md font-bold text-onPrimary mt-0.5">
            {t(`common.${trip.to.toLowerCase()}`)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mt-4">
        <View className="flex-1 rounded-md bg-card/10 border border-card/15 px-2.5 py-2">
          <Text className="text-2xs font-semibold uppercase tracking-[0.8px] text-onPrimary/60">
            {t("driver.boarding")}
          </Text>
          <Text className="text-base-lg font-bold text-onPrimary mt-1" numberOfLines={1}>
            {t("bookings.gate", { gate: trip.gate ?? "3" })}
          </Text>
        </View>
        <View className="flex-1 rounded-md bg-card/10 border border-card/15 px-2.5 py-2">
          <Text className="text-2xs font-semibold uppercase tracking-[0.8px] text-onPrimary/60">
            {t("common.seat")}
          </Text>
          <Text className="text-base-lg font-bold text-onPrimary mt-1" numberOfLines={1}>
            {booking.seats[0]} · {seatPosition}
          </Text>
        </View>
        <View className="flex-1 rounded-md bg-card/10 border border-card/15 px-2.5 py-2">
          <Text className="text-2xs font-semibold uppercase tracking-[0.8px] text-onPrimary/60">
            {t("bookings.departsLabel")}
          </Text>
          <Text className="text-base-lg font-bold text-onPrimary mt-1" numberOfLines={1}>
            {t("bookings.inDays", { count: departsIn })}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5 rounded-md bg-primaryDark/40 border border-card/10 px-2.5 py-2.5 mt-2">
        <Avatar initials={driver?.initials ?? "?"} photo={driver?.photo} size="sm" verified={Boolean(driver)} />
        <View className="flex-1">
          <Text className="text-sm font-bold text-onPrimary" numberOfLines={1}>
            {driver?.name ?? t("common.highwayCaptain")}
          </Text>
          <Text className="text-2xs text-onPrimary/70 mt-0.5" numberOfLines={1}>
            {(driver?.vehicleModel ?? "Toyota Fielder")} • {trip.vehiclePlate}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mt-2.5">
        <Ripple
          onPress={onCall}
          accessibilityLabel={t("common.callDriver")}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-md bg-card/15 border border-card/20 py-2.5"
        >
          <Icon name="phone" size={13} color={onPrimary} />
          <Text className="text-xs font-bold text-onPrimary">{t("common.callDriver")}</Text>
        </Ripple>
        <Ripple
          onPress={onShare}
          accessibilityLabel={t("common.shareTrip")}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-md bg-card/15 border border-card/20 py-2.5"
        >
          <Icon name="share" size={13} color={onPrimary} />
          <Text className="text-xs font-bold text-onPrimary">{t("common.shareTrip")}</Text>
        </Ripple>
      </View>

      <View className="h-px bg-card/20 my-3" />

      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xs uppercase tracking-[0.9px] text-onPrimary/60">
            {t("bookings.bookingId")}
          </Text>
          <Text className="text-sm font-semibold text-onPrimary mt-0.5">{booking.code}</Text>
        </View>
        <View className="items-end">
          <Text className="text-2xs uppercase tracking-[0.9px] text-onPrimary/60">
            {t("bookings.totalPaid")}
          </Text>
          <View className="flex-row items-baseline gap-1 mt-0.5">
            <Text className="text-md font-bold text-onPrimary">
              {booking.amount.toLocaleString("en-US")}
            </Text>
            <Text className="text-2xs font-semibold text-onPrimary/70">{t("common.afn")}</Text>
          </View>
        </View>
      </View>

      {onOpen ? (
        <Ripple
          onPress={onOpen}
          accessibilityLabel={t("common.tripDetails")}
          className="bg-card rounded-md py-3 mt-3 flex-row items-center justify-center gap-1.5"
        >
          <Text className="text-md font-bold text-primary">{t("common.tripDetails")}</Text>
          <Icon name="arrow-forward" size={17} color={primary} />
        </Ripple>
      ) : null}
    </LinearGradient>
  );
}
