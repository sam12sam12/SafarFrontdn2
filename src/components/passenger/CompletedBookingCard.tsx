import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Booking, Driver, Trip } from "@/lib/db/types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { RouteStrip } from "../ui/RouteStrip";
import { formatDateWithYear } from "@/lib/dates";

type Props = {
  booking: Booking;
  trip: Trip;
  driver?: Driver;
  onReceipt: () => void;
  onBookAgain: () => void;
};

export function CompletedBookingCard({ booking, trip, driver, onReceipt, onBookAgain }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <Card className="p-3.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <Avatar
            initials={driver?.initials ?? "AW"}
            photo={driver?.photo}
            size="md"
            verified={Boolean(driver)}
          />
          <View>
            <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
              {driver?.name ?? "Ustad Ahmad Wali"}
            </Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Icon name="star" size={12} color="#F59E0B" />
              <Text className="text-sm font-semibold text-text">
                {(driver?.rating ?? 4.9).toFixed(1)}
              </Text>
              <Text className="text-sm text-secText">
                ({driver?.totalTrips ?? 184} trips)
              </Text>
            </View>
          </View>
        </View>
        <View className="items-end gap-1">
          <Badge label={t("bookings.tabCompleted")} tone="green" icon="check-circle" compact />
          <Text className="text-2xs text-muted">{formatDateWithYear(trip.date, i18n.language)}</Text>
        </View>
      </View>

      <RouteStrip
        className="mt-3"
        fromCity={t(`common.${trip.from.toLowerCase()}`)}
        toCity={t(`common.${trip.to.toLowerCase()}`)}
        departTime={trip.departTime}
        departPeriod={trip.departPeriod}
        arriveTime={trip.arriveTime}
        arrivePeriod={trip.arrivePeriod}
        duration={trip.duration}
      />

      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-2 flex-1">
          <View className="w-8 h-8 rounded-base bg-primarySoft items-center justify-center">
            <Icon name="directions-car" size={16} color="#1D4ED8" />
          </View>
          <View>
            <Text className="text-base font-semibold text-text">Toyota Fielder</Text>
            <Text className="text-xs text-secText">Plate {trip.vehiclePlate}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-2xs text-muted">{t("bookings.paid")}</Text>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-base-lg font-bold text-text">
              {booking.amount.toLocaleString("en-US")}
            </Text>
            <Text className="text-2xs text-secText">{t("common.afn")}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2 mt-3">
        <Ripple
          onPress={onReceipt}
          accessibilityLabel={t("bookings.receipt")}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-base bg-primarySoft py-2.5"
        >
          <Icon name="receipt-long" size={14} color="#1D4ED8" />
          <Text className="text-xs font-bold text-primary">{t("bookings.receipt")}</Text>
        </Ripple>
        <Ripple
          onPress={onBookAgain}
          disabled
          accessibilityLabel={t("bookings.bookAgain")}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-base bg-disable py-2.5"
        >
          <Icon name="lock" size={13} color="#94A3B8" />
          <Text className="text-xs font-bold text-muted">{t("bookings.bookAgain")}</Text>
        </Ripple>
      </View>
    </Card>
  );
}
