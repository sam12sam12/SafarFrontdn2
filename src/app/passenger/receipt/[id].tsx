import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { TripDetailsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useBooking } from "@/lib/queries/bookingsQueries";
import { useTrip } from "@/lib/queries/tripsQueries";
import { formatDateWithYear } from "@/lib/dates";
import { colors } from "@/utils/theme";

export default function ReceiptScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookingQuery = useBooking(id);
  const { data: booking } = bookingQuery;
  const { data: trip } = useTrip(booking?.tripId);

  const paid = booking?.paymentStatus === "paid";

  return (
    <Screen contentClassName="pb-8" refreshing={bookingQuery.isRefetching} onRefresh={bookingQuery.refetch}>
      <AppHeader title={t("receipt.title")} subtitle={booking?.code} />

      {bookingQuery.isLoading || !booking ? (
        <TripDetailsSkeleton />
      ) : (
        <View className="px-4 gap-3">
          <Card>
            <View className="flex-row items-center gap-2.5">
              <View className="w-10 h-10 rounded-base bg-primarySoft items-center justify-center">
                <Icon name="receipt-long" size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base-lg font-bold text-text">Express Highway</Text>
                <Text className="text-xs text-secText mt-0.5">
                  {trip
                    ? `${t(`common.${trip.from.toLowerCase()}`)} → ${t(`common.${trip.to.toLowerCase()}`)}`
                    : t("common.officialNetwork")}
                </Text>
              </View>
              <Badge
                label={paid ? t("bookings.paid") : t("common.due")}
                tone={paid ? "green" : "amber"}
                compact
              />
            </View>

            <View className="mt-3">
              <DetailRow label={t("bookings.bookingId")} value={booking.code} />
              <DetailRow
                className="border-t border-border"
                label={t("common.passenger")}
                value={booking.passengerName}
              />
              <DetailRow
                className="border-t border-border"
                label={t("common.seat")}
                value={booking.seats.join(", ")}
              />
              {trip ? (
                <DetailRow
                  className="border-t border-border"
                  label={t("bookings.departsLabel")}
                  value={`${trip.departTime} ${trip.departPeriod} · ${formatDateWithYear(trip.date, i18n.language)}`}
                />
              ) : null}
              {booking.luggage ? (
                <DetailRow
                  className="border-t border-border"
                  label={t("confirmed.luggage")}
                  value={booking.luggage}
                />
              ) : null}
            </View>
          </Card>

          <Card>
            <Text className="text-base-lg font-bold text-text">{t("confirmed.paymentSummary")}</Text>
            <View className="mt-1.5">
              <DetailRow
                label={t("payment.method")}
                value={
                  booking.payment === "hesabpay" ? t("confirmed.hesabpay") : t("confirmed.cash")
                }
              />
              <DetailRow
                className="border-t border-border"
                label={t("confirmed.reference")}
                value={booking.reference ?? booking.code}
                tone="muted"
              />
              <DetailRow
                className="border-t border-border"
                label={t("bookings.totalPaid")}
                value={`${booking.amount.toLocaleString("en-US")} ${t("common.afn")}`}
              />
            </View>

            <View className="flex-row items-center gap-2 mt-3 rounded-base bg-elevated border border-secBorder px-3 py-2.5">
              <Icon name="verified-user" size={15} color={colors.success} />
              <Text className="text-xs text-secText flex-1">{t("receipt.footer")}</Text>
            </View>
          </Card>

          <AppButton
            label={t("receipt.share")}
            variant="secondary"
            icon="share"
            iconPosition="left"
            onPress={() => showToast("success", t("receipt.share"), t("receipt.shareSub"))}
          />
        </View>
      )}
    </Screen>
  );
}
