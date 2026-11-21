import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Booking, Trip } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";

type Props = {
  booking: Booking;
  trip?: Trip;
  onAccept: () => void;
  onDecline: () => void;
  onOpen: () => void;
  onCall: () => void;
  busy?: boolean;
};

export function OwnerBookingCard({
  booking,
  trip,
  onAccept,
  onDecline,
  onOpen,
  onCall,
  busy,
}: Props) {
  const { t } = useTranslation();
  const paid = booking.paymentStatus === "paid";
  const vip = trip?.service === "vip";
  const seats =
    vip || booking.people > 1
      ? t("owner.peopleCount", { count: booking.people })
      : `${t("common.seat")} ${booking.seats[0]}`;

  return (
    <Ripple
      onPress={onOpen}
      accessibilityLabel={booking.code}
      className={cn("rounded-lg", booking.status === "new" && "border border-primary")}
    >
      <Card className={cn("gap-2.5 p-3.5 rounded-lg", booking.status === "new" && "border-primary")}>
        <View className="flex-row items-center gap-2.5">
          <Avatar initials={booking.initials} size="md" />
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
              {booking.passengerName}
            </Text>
            <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
              {booking.phone} · #{booking.code} · {booking.createdAtLabel}
            </Text>
          </View>
          <Ripple
            onPress={onCall}
            accessibilityLabel={`${t("owner.callPassenger")} ${booking.passengerName}`}
            className="w-8 h-8 rounded-full bg-primarySoft items-center justify-center"
          >
            <Icon name="phone" size={15} color={colors.primary} />
          </Ripple>
        </View>

        <View className="rounded-base bg-elevated px-3 py-2.5 gap-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-base-lg font-semibold text-text flex-1" numberOfLines={1}>
              {trip ? `${trip.from} → ${trip.to}` : "Highway 1"}
            </Text>
            <Badge
              label={vip ? t("owner.bookingFilterVipCar") : t("owner.filterSharedSeat")}
              tone={vip ? "blue" : "blue"}
              compact
            />
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-sm text-secText flex-1" numberOfLines={1}>
              {trip?.dateLabel ?? "—"} · {trip?.departTime} {trip?.departPeriod}
            </Text>
            <Text className="text-sm font-semibold text-text">{seats}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <View>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-xl font-bold text-text">
                {booking.amount.toLocaleString("en-US")}
              </Text>
              <Text className="text-2xs font-semibold text-secText">{t("common.afn")}</Text>
            </View>
            <Badge
              label={paid ? t("owner.paidHesabpay") : t("owner.paysAtAgency")}
              tone={paid ? "green" : "amber"}
              compact
              className="mt-1"
            />
          </View>

          {booking.status === "new" ? (
            <View className="flex-row gap-2">
              <Ripple
                onPress={onDecline}
                disabled={busy}
                accessibilityLabel={`${t("owner.decline")} ${booking.code}`}
                className="rounded-full border border-border px-4 py-2 bg-card"
              >
                <Text className="text-base-lg font-semibold text-secText">{t("owner.decline")}</Text>
              </Ripple>
              <Ripple
                onPress={onAccept}
                disabled={busy}
                accessibilityLabel={`${t("owner.acceptBooking")} ${booking.code}`}
                className="rounded-full bg-primary px-4 py-2 shadow-button shadow-buttonShadow"
              >
                <Text className="text-base-lg font-bold text-onPrimary">
                  {t("owner.acceptBooking")}
                </Text>
              </Ripple>
            </View>
          ) : (
            <Badge
              label={booking.status === "cancelled" ? t("owner.tabCancelled") : t("owner.tabConfirmed")}
              tone={booking.status === "cancelled" ? "red" : "green"}
              icon={booking.status === "cancelled" ? "cancel" : "check-circle"}
            />
          )}
        </View>
      </Card>
    </Ripple>
  );
}
