import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { OwnerBookingDetailsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { useAcceptBooking, useBooking, useDeclineBooking } from "@/lib/queries/bookingsQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { colors } from "@/utils/theme";

export default function OwnerBookingDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookingQuery = useBooking(id);
  const { data: booking } = bookingQuery;
  const { data: trips } = useTrips();
  const accept = useAcceptBooking();
  const decline = useDeclineBooking();

  const trip = trips?.find((entry) => entry.id === booking?.tripId);
  const paid = booking?.paymentStatus === "paid";

  if (bookingQuery.isLoading || !booking) {
    return (
      <Screen contentClassName="pb-8">
        <AppHeader title={t("owner.bookingDetailsTitle")} />
        <OwnerBookingDetailsSkeleton />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="pb-8">
      <AppHeader
        title={t("owner.bookingDetailsTitle")}
        subtitle={`${booking.code} · ${booking.createdAtLabel}`}
        right={
          <Badge
            label={booking.status === "new" ? t("owner.request") : booking.status}
            tone={booking.status === "new" ? "amber" : "green"}
          />
        }
      />

      <View className="px-4 gap-3">
        <Card>
          <View className="flex-row items-center gap-3">
            <Avatar initials={booking.initials} size="lg" />
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-bold text-text">{booking.passengerName}</Text>
                {booking.thirdTrip ? <Badge label={t("owner.thirdTrip")} tone="slate" compact /> : null}
              </View>
              <Text className="text-base text-secText mt-0.5">{booking.phone}</Text>
              <Text className="text-sm text-secText mt-0.5">
                {t("owner.adult", { count: booking.people })}
                {booking.kids ? ` · ${booking.kids}` : ""}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2 mt-3">
            <Badge label={`${t("common.seat")} ${booking.seats.join(", ")}`} tone="blue" icon="event-seat" />
            {booking.luggage ? <Badge label={booking.luggage} tone="slate" icon="luggage" /> : null}
            {booking.pickup ? <Badge label={booking.pickup} tone="slate" icon="place" /> : null}
          </View>
        </Card>

        <Card>
          <Text className="text-lg font-bold text-text mb-2">{t("owner.tripSection")}</Text>
          <View className="flex-row items-baseline justify-between">
            <Text className="text-2xl font-bold text-text">
              {trip?.departTime} <Text className="text-sm text-secText">{trip?.departPeriod}</Text>
            </Text>
            <Icon name="arrow-forward" size={16} color={colors.muted} />
            <Text className="text-2xl font-bold text-text">
              {trip?.arriveTime} <Text className="text-sm text-secText">{trip?.arrivePeriod}</Text>
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-base-lg font-semibold text-primary">{trip ? t(`common.${trip.from.toLowerCase()}`) : "—"}</Text>
            <Text className="text-sm text-secText">{trip?.dateLabel}</Text>
            <Text className="text-base-lg font-semibold text-primary">{trip ? t(`common.${trip.to.toLowerCase()}`) : "—"}</Text>
          </View>
          <View className="h-[1px] bg-secBorder my-2.5" />
          <DetailRow label={t("owner.tripCode")} value={trip?.code ?? "—"} />
          <DetailRow
            label={t("owner.service")}
            value={trip?.service === "vip" ? t("owner.vipWholeCar") : t("owner.sharedSeat")}
          />
          <DetailRow label={t("owner.vehicle")} value={trip?.vehiclePlate ?? "—"} />
          <DetailRow label={t("owner.boarding")} value={trip?.boardingPoint ?? "—"} />
        </Card>

        <Card>
          <Text className="text-lg font-bold text-text mb-2">{t("owner.payment")}</Text>
          <View className="flex-row items-baseline justify-between">
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-bold text-text">
                {booking.amount.toLocaleString("en-US")}
              </Text>
              <Text className="text-sm font-semibold text-secText">{t("common.afn")}</Text>
            </View>
            <Badge
              label={paid ? t("owner.paidHesabpay") : t("owner.paysAtAgency")}
              tone={paid ? "green" : "amber"}
              icon={paid ? "verified" : "payments"}
            />
          </View>
          {booking.reference ? (
            <Text className="text-sm text-secText mt-1">{t("owner.reference", { ref: booking.reference })}</Text>
          ) : null}
          <View className="h-[1px] bg-secBorder my-2.5" />
          <DetailRow label={t("owner.bookingFee")} value={`0 ${t("common.afn")}`} tone="muted" />
          <DetailRow
            label={t("owner.collected")}
            value={paid ? `${booking.amount.toLocaleString("en-US")} ${t("common.afn")}` : `0 ${t("common.afn")}`}
            tone={paid ? "success" : "warning"}
          />
          <DetailRow
            label={t("owner.dueAtBoarding")}
            value={paid ? `0 ${t("common.afn")}` : `${booking.amount.toLocaleString("en-US")} ${t("common.afn")}`}
          />
        </Card>

        {booking.status === "new" ? (
          <View className="flex-row gap-2.5">
            <AppButton
              label={t("owner.decline")}
              variant="secondary"
              className="flex-1"
              loading={decline.isPending}
              onPress={async () => {
                try {
                  await decline.mutateAsync(booking.id);
                  showToast("warning", t("owner.requestDeclined"), t("owner.seatsReleased"));
                } catch {
                  showToast("error", t("owner.couldNotDecline"), t("owner.tryAgain"));
                }
              }}
            />
            <AppButton
              label={t("owner.acceptBooking")}
              icon="check"
              iconPosition="left"
              className="flex-1"
              loading={accept.isPending}
              onPress={async () => {
                try {
                  await accept.mutateAsync(booking.id);
                  showToast("success", t("owner.bookingAccepted"), t("owner.bookingConfirmedSub", { code: booking.code }));
                } catch {
                  showToast("error", t("owner.couldNotAccept"), t("owner.tryAgain"));
                }
              }}
            />
          </View>
        ) : (
          <AppButton
            label={t("owner.messagePassenger")}
            variant="secondary"
            icon="sms"
            iconPosition="left"
            onPress={() => showToast("success", t("owner.smsSent"), t("owner.smsSentSub", { phone: booking.phone }))}
          />
        )}

        <Card className="bg-primarySoft border-primaryBorder flex-row gap-2.5">
          <Icon name="support-agent" size={18} color={colors.primary} />
          <Text className="text-base text-primary flex-1 leading-5">{t("owner.approvalHint")}</Text>
        </Card>
      </View>
    </Screen>
  );
}
