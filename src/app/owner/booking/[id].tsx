import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { OwnerBookingDetailsSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { useAcceptBooking, useBooking, useDeclineBooking } from "@/lib/queries/bookingsQueries";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useTrips } from "@/lib/queries/tripsQueries";
import { formatNumber } from "@/lib/format";
import { colors } from "@/utils/theme";

export default function OwnerBookingDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookingQuery = useBooking(id);
  const { data: booking } = bookingQuery;
  const { data: trips } = useTrips();
  const { data: drivers } = useDrivers();
  const accept = useAcceptBooking();
  const decline = useDeclineBooking();

  const trip = trips?.find((entry) => entry.id === booking?.tripId);
  const driver = drivers?.find((entry) => entry.id === trip?.driverId);
  const paid = booking?.paymentStatus === "paid";

  if (bookingQuery.isLoading || !booking) {
    return (
      <Screen contentClassName="pb-8">
        <View className="px-4 pt-3">
          <Text className="text-xl font-bold text-text">{t("owner.bookingDetailsTitle")}</Text>
        </View>
        <OwnerBookingDetailsSkeleton />
      </Screen>
    );
  }

  const history = [
    { label: t("owner.historyBooked"), time: "03:40 PM", done: true },
    ...(paid
      ? [
          {
            label: t("owner.paidWithHesabpay", { amount: formatNumber(booking.amount) }),
            time: "03:41 PM",
            done: true,
          },
        ]
      : []),
    ...(booking.status === "new"
      ? [{ label: t("owner.waitingAccept"), time: t("owner.now"), done: false }]
      : []),
  ];

  return (
    <Screen
      contentClassName="pb-8"
      footer={
        <View className="flex-row gap-2.5 px-4 py-3 bg-mainBack border-t border-border">
          {booking.status === "new" ? (
            <>
              <AppButton
                label={t("owner.declineRefund")}
                variant="danger"
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
                className="flex-[1.4]"
                loading={accept.isPending}
                onPress={async () => {
                  try {
                    await accept.mutateAsync(booking.id);
                    showToast(
                      "success",
                      t("owner.bookingAccepted"),
                      t("owner.bookingConfirmedSub", { code: booking.code }),
                    );
                  } catch {
                    showToast("error", t("owner.couldNotAccept"), t("owner.tryAgain"));
                  }
                }}
              />
            </>
          ) : (
            <Ripple
              onPress={() =>
                showToast("success", t("owner.smsSent"), t("owner.smsSentSub", { phone: booking.phone }))
              }
              accessibilityLabel={t("owner.messagePassenger")}
              className="flex-1 rounded-base bg-primary py-3.5 items-center shadow-button shadow-buttonShadow"
            >
              <Text className="text-md font-bold text-onPrimary">{t("owner.messagePassenger")}</Text>
            </Ripple>
          )}
        </View>
      }
    >
      <View className="flex-row items-center gap-3 px-4 pt-3 pb-3">
        <Ripple
          onPress={() => router.back()}
          accessibilityLabel={t("owner.bookingDetailsTitle")}
          className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
        >
          <Icon name="arrow-back" size={19} color={colors.text} />
        </Ripple>
        <View className="flex-1">
          <Text className="text-xl font-bold text-text">
            {t("owner.bookingHeader", { code: booking.code })}
          </Text>
          <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
            {booking.createdAtLabel}
          </Text>
        </View>
        <Badge
          label={
            booking.status === "new"
              ? t("owner.newTag")
              : booking.status === "confirmed"
                ? t("owner.tabConfirmed")
                : t("owner.tabCancelled")
          }
          tone={booking.status === "new" ? "amber" : "green"}
        />
      </View>

      <View className="px-4 gap-3">
        <Card className="gap-3">
          <View className="flex-row items-center gap-3">
            <Avatar initials={booking.initials} size="lg" />
            <View className="flex-1">
              <Text className="text-lg font-bold text-text" numberOfLines={1}>
                {booking.passengerName}
              </Text>
              <Text className="text-base text-secText mt-0.5">{booking.phone}</Text>
              <Text className="text-sm text-secText mt-0.5">
                {booking.thirdTrip
                  ? t("owner.thirdTripWithYou")
                  : t("owner.tripsWithYou", { count: 1 })}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Ripple
              onPress={() => showToast("info", t("owner.calling"), booking.phone)}
              accessibilityLabel={t("owner.call")}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-base bg-primarySoft py-2.5"
            >
              <Icon name="phone" size={17} color={colors.primary} />
              <Text className="text-base-lg font-semibold text-primary">{t("owner.call")}</Text>
            </Ripple>
            <Ripple
              onPress={() =>
                showToast("success", t("owner.smsSent"), t("owner.smsSentSub", { phone: booking.phone }))
              }
              accessibilityLabel={t("owner.sms")}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-base bg-primarySoft py-2.5"
            >
              <Icon name="sms" size={17} color={colors.primary} />
              <Text className="text-base-lg font-semibold text-primary">{t("owner.sms")}</Text>
            </Ripple>
          </View>
        </Card>

        <View className="rounded-xl bg-primary p-4 gap-3 shadow-card shadow-shadowColor">
          <View className="flex-row items-center justify-between">
            <View className="rounded-full bg-onPrimary/15 px-2.5 py-1">
              <Text className="text-2xs font-bold uppercase tracking-[0.8px] text-onPrimary">
                {trip?.service === "vip" ? t("owner.vipWholeCar") : t("owner.filterSharedSeat")}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-onPrimary/85">{trip?.dateLabel}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-onPrimary" numberOfLines={1}>
              {trip ? `${trip.from} → ${trip.to}` : "—"}
            </Text>
            <Text className="text-base-lg font-bold text-onPrimary">
              {trip?.departTime} {trip?.departPeriod}
            </Text>
          </View>

          <View className="flex-row gap-2">
            {[
              {
                label: t("owner.people"),
                value: booking.kids ?? t("owner.peopleCount", { count: booking.people }),
              },
              { label: t("owner.luggage"), value: booking.luggage ?? "—" },
              { label: t("owner.pickup"), value: booking.pickup ?? "—" },
            ].map((item) => (
              <View key={item.label} className="flex-1 rounded-base bg-onPrimary/15 p-2">
                <Text className="text-2xs text-onPrimary/70">{item.label}</Text>
                <Text className="text-base-lg font-bold text-onPrimary mt-0.5" numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row items-center gap-2.5 rounded-base bg-card p-2.5">
            <View className="w-8 h-8 rounded-full bg-primarySoft items-center justify-center">
              <Text className="text-sm font-bold text-primary">{driver?.initials ?? "—"}</Text>
            </View>
            <Text className="text-base-lg font-semibold text-text flex-1" numberOfLines={1}>
              {driver?.name ?? t("owner.noDriverAssigned")} · {trip?.vehiclePlate}
            </Text>
            <Text className="text-sm font-semibold text-primary">{t("seats.driver")}</Text>
          </View>
        </View>

        <Card>
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted mb-1">
            {t("owner.payment")}
          </Text>
          <DetailRow
            label={trip?.service === "vip" ? t("owner.wholeCarFare") : t("owner.bookingFee")}
            value={`${formatNumber(booking.amount)} ${t("common.afn")}`}
          />
          <DetailRow
            label={t("owner.paidWith")}
            value={paid ? "HesabPay" : t("owner.cashAtGate")}
          />
          {booking.reference ? (
            <DetailRow label={t("owner.referenceShort")} value={booking.reference} />
          ) : null}
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-base text-secText flex-1">{t("owner.statusLabel")}</Text>
            <Badge
              label={paid ? t("common.paid") : t("owner.paysAtAgency")}
              tone={paid ? "green" : "amber"}
              compact
            />
          </View>
        </Card>

        <Card>
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted mb-2">
            {t("owner.history")}
          </Text>
          {history.map((item, index) => (
            <View key={`${item.label}-${index}`} className="flex-row items-start gap-3 py-2">
              <View className="items-center w-3 mt-1">
                <View
                  className={
                    item.done
                      ? "w-3 h-3 rounded-full bg-primary"
                      : "w-3 h-3 rounded-full border-2 border-warning bg-card"
                  }
                />
                {index < history.length - 1 ? <View className="w-[1.5px] h-6 bg-border" /> : null}
              </View>
              <Text className="text-base-lg font-semibold text-text flex-1">{item.label}</Text>
              <Text className="text-sm text-muted">{item.time}</Text>
            </View>
          ))}
        </Card>

        <Card className="py-1">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.more")}
          </Text>
          {[
            { title: t("owner.moveAnotherTrip"), subtitle: t("owner.moveAnotherTripSub") },
            { title: t("owner.resendTicket"), subtitle: t("owner.resendTicketSub") },
            { title: t("owner.addNote"), subtitle: t("owner.addNoteSub") },
          ].map((row) => (
            <Ripple
              key={row.title}
              onPress={() => showToast("info", row.title, row.subtitle)}
              accessibilityLabel={row.title}
              className="flex-row items-center gap-3 py-3 border-t border-secBorder"
            >
              <View className="flex-1">
                <Text className="text-base-lg font-semibold text-text">{row.title}</Text>
                <Text className="text-sm text-secText mt-0.5">{row.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.muted} />
            </Ripple>
          ))}
        </Card>
      </View>
    </Screen>
  );
}
