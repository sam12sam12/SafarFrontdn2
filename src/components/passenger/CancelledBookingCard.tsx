import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Booking, Driver, Trip } from "@/lib/db/types";
import { formatDateWithYear } from "@/lib/dates";
import { colors } from "@/utils/theme";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { RouteStrip } from "../ui/RouteStrip";

type Props = {
  booking: Booking;
  trip: Trip;
  driver?: Driver;
  onBookAgain: () => void;
};

/**
 * A journey the passenger called off — kept in history with its refund state so
 * the corridor is one tap away from being booked again.
 */
export function CancelledBookingCard({ booking, trip, driver, onBookAgain }: Props) {
  const { t, i18n } = useTranslation();
  const refunded = booking.paymentStatus === "paid";
  const cancelledAt = (booking.cancelledAt ?? booking.createdAt).slice(0, 10);

  return (
    <Card className="p-3.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full bg-errorSoft items-center justify-center">
            <Icon name="cancel" size={18} color={colors.error} />
          </View>
          <View>
            <Text className="text-base-lg font-bold text-text">{booking.code}</Text>
            <Text className="text-xs text-secText mt-0.5">
              {t("bookings.cancelledOn", { date: formatDateWithYear(cancelledAt, i18n.language) })}
            </Text>
          </View>
        </View>
        <Badge label={t("bookings.tabCancelled")} tone="red" icon="cancel" compact />
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

      <View className="flex-row items-center justify-between gap-2 mt-3 rounded-base bg-elevated border border-secBorder px-3 py-2.5">
        <View className="flex-row items-center gap-1.5 flex-1">
          <Icon
            name={refunded ? "check-circle" : "schedule"}
            size={14}
            color={refunded ? colors.success : colors.secText}
          />
          <Text className="text-xs font-semibold text-secText" numberOfLines={2}>
            {refunded
              ? t("bookings.refunded", {
                  amount: `${booking.amount.toLocaleString("en-US")} ${t("common.afn")}`,
                })
              : t("bookings.noCharge")}
          </Text>
        </View>
        <Ripple
          onPress={onBookAgain}
          accessibilityLabel={t("bookings.bookAgain")}
          className="flex-row items-center justify-center gap-1.5 rounded-base bg-primarySoft px-3 py-2"
        >
          <Icon name="replay" size={13} color={colors.primary} />
          <Text className="text-xs font-bold text-primary">{t("bookings.bookAgain")}</Text>
        </Ripple>
      </View>
    </Card>
  );
}
