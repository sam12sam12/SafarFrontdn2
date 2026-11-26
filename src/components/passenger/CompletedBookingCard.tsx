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
import { colors } from "@/utils/theme";

type Props = {
  booking: Booking;
  trip: Trip;
  driver?: Driver;
  onRate?: () => void;
  onReceipt?: () => void;
};

export function CompletedBookingCard({ booking, trip, driver, onRate, onReceipt }: Props) {
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
                ({t("trip.tripsCount", { count: driver?.totalTrips ?? 184 })})
              </Text>
            </View>
          </View>
        </View>
        <Badge label={t("bookings.tabCompleted")} tone="green" icon="check-circle" compact />
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
        dateText={formatDateWithYear(trip.date, i18n.language)}
      />

      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-2 flex-1">
          <View className="w-8 h-8 rounded-base bg-primarySoft items-center justify-center">
            <Icon name="directions-car" size={16} color="#1D4ED8" />
          </View>
          <View>
            <Text className="text-base font-semibold text-text">
              {(driver?.vehicleModel ?? "Toyota Fielder").replace(/\s+\d{4}$/, "")}
            </Text>
            <Text className="text-xs text-secText">
              {t("trip.plate", { plate: trip.vehiclePlate })}
            </Text>
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
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-base border border-border bg-card py-2.5"
        >
          <Icon name="receipt-long" size={14} color={colors.secText} />
          <Text className="text-sm font-bold text-text">{t("bookings.receipt")}</Text>
        </Ripple>
        <Ripple
          onPress={onRate}
          accessibilityLabel={t("bookings.rateTrip")}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-base bg-primarySoft py-2.5"
        >
          <Icon
            name={booking.rating ? "star" : "star-border"}
            size={14}
            color={colors.warning}
          />
          <Text className="text-sm font-bold text-primary">
            {booking.rating
              ? t("bookings.rated", { rating: booking.rating })
              : t("bookings.rateTrip")}
          </Text>
        </Ripple>
      </View>
    </Card>
  );
}
