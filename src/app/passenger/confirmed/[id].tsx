import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { TripSummaryCard } from "@/components/passenger/TripSummaryCard";
import { TripDetailsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { HeaderIcon } from "@/components/ui/HeaderIcon";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { useBooking } from "@/lib/queries/bookingsQueries";
import { useDriver } from "@/lib/queries/driversQueries";
import { useTrip } from "@/lib/queries/tripsQueries";
import { formatDayMonth } from "@/lib/dates";
import { minusMinutes } from "@/lib/format";
import { colors } from "@/utils/theme";

export default function BookingConfirmedScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookingQuery = useBooking(id);
  const { data: booking } = bookingQuery;
  const tripQuery = useTrip(booking?.tripId);
  const { data: trip } = tripQuery;
  const { data: driver } = useDriver(trip?.driverId);

  const [primaryLight, primary, primaryDark] = useCSSVariable([
    "--color-primaryLight",
    "--color-primary",
    "--color-primaryDark",
  ]) as string[];

  const fromCity = trip ? t(`common.${trip.from.toLowerCase()}`) : t("common.kandahar");
  const toCity = trip ? t(`common.${trip.to.toLowerCase()}`) : t("common.kabul");
  const paid = booking?.paymentStatus === "paid";
  const gate = trip?.gate ?? "3";
  const boardingCutoff = trip ? `${minusMinutes(trip.departTime, 30)} ${trip.departPeriod}` : "";
  const method =
    booking?.payment === "hesabpay" ? t("confirmed.hesabpay") : t("confirmed.cash");

  return (
    <Screen
      contentClassName="pb-10"
      refreshing={bookingQuery.isRefetching || tripQuery.isRefetching}
      onRefresh={() => {
        bookingQuery.refetch();
        tripQuery.refetch();
      }}
    >
      <LinearGradient
        colors={["#E8F1FF", "#F5F8FD"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 430 }}
      />

      <AppHeader
        title={t("confirmed.header")}
        showBack={false}
        right={
          <HeaderIcon
            icon="close"
            accessibilityLabel={t("common.close")}
            onPress={() => router.replace("/passenger")}
          />
        }
      />

      {bookingQuery.isLoading || tripQuery.isLoading ? (
        <TripDetailsSkeleton />
      ) : (
        <View className="px-4">
          <View className="items-center">
            <View className="w-[104px] h-[104px] rounded-full bg-primarySoft items-center justify-center">
              <LinearGradient
                colors={[primaryLight, primary, primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 82, height: 82, borderRadius: 41 }}
              >
                <View className="flex-1 items-center justify-center">
                  <Icon name="check" size={42} color={colors.onPrimary} />
                </View>
              </LinearGradient>
            </View>

            <View className="flex-row items-center gap-1.5 rounded-full bg-card border border-primaryBorder px-3 py-1.5 mt-4 shadow-sm shadow-shadowColor">
              <Icon name="verified" size={13} color={colors.primary} />
              <Text className="text-2xs font-bold uppercase tracking-[1px] text-primary">
                {t("confirmed.badge")}
              </Text>
            </View>

            <Text className="text-3xl font-bold text-text text-center mt-3">
              {t("confirmed.title")}
            </Text>
            <Text className="text-base text-secText text-center mt-2 leading-5 max-w-[300px]">
              {t("confirmed.subtitle", { from: fromCity, to: toCity })}
            </Text>
          </View>

          {trip && booking ? (
            <View className="gap-3 mt-5">
              <Card>
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="text-base-lg font-bold text-text">
                    {t("confirmed.bookingDetails")}
                  </Text>
                  <Badge label={booking.code} tone="dark" icon="confirmation-number" />
                </View>

                <DetailRow
                  className="mt-1.5"
                  label={t("common.passenger")}
                  value={booking.passengerName}
                />
                <DetailRow
                  className="border-t border-border"
                  label={t("common.seat")}
                  value={booking.seats.join(", ") || "—"}
                />
                <DetailRow
                  className="border-t border-border"
                  label={t("confirmed.departure")}
                  value={`${trip.departTime} ${trip.departPeriod} · ${formatDayMonth(trip.date, i18n.language)}`}
                />
                <DetailRow
                  className="border-t border-border"
                  label={t("confirmed.boardingPoint")}
                  value={trip.boardingPoint}
                />
              </Card>

              <TripSummaryCard trip={trip} driver={driver ?? undefined} />

              <Card>
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="text-base-lg font-bold text-text">
                    {t("confirmed.paymentSummary")}
                  </Text>
                  <Badge
                    label={paid ? t("bookings.paid") : t("common.due")}
                    tone={paid ? "green" : "amber"}
                    icon={paid ? "verified" : "payments"}
                  />
                </View>

                <DetailRow
                  className="mt-1.5"
                  label={t("payment.method")}
                  value={method}
                />
                <DetailRow
                  className="border-t border-border"
                  label={t("confirmed.amount")}
                  value={`${booking.amount.toLocaleString("en-US")} ${t("common.afn")}`}
                />
                <DetailRow
                  className="border-t border-border"
                  label={t("confirmed.reference")}
                  value={booking.reference ?? booking.code}
                  tone="muted"
                />
              </Card>

              <Card>
                <Text className="text-base-lg font-bold text-text">
                  {t("confirmed.beforeYouTravel")}
                </Text>

                <View className="gap-3 mt-3">
                  <TipRow
                    icon="schedule"
                    title={t("confirmed.arriveEarly")}
                    detail={t("confirmed.arriveEarlySub", { gate, time: boardingCutoff })}
                  />
                  <TipRow
                    icon="badge"
                    title={t("confirmed.carryId")}
                    detail={t("confirmed.carryIdSub")}
                  />
                  <TipRow
                    icon="event-available"
                    title={t("bookings.freeCancellation")}
                    detail={t("bookings.freeCancellationSub")}
                  />
                </View>
              </Card>

              <View className="flex-row gap-2.5 mt-2">
                <AppButton
                  className="flex-1"
                  label={t("trip.viewTrip")}
                  icon="map"
                  onPress={() =>
                    router.replace({ pathname: "/passenger/trip/[id]", params: { id: trip.id } })
                  }
                />
                <AppButton
                  className="flex-1"
                  variant="secondary"
                  label={t("bookings.title")}
                  icon="confirmation-number"
                  onPress={() => router.replace("/passenger/bookings")}
                />
              </View>
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

function TipRow({ icon, title, detail }: { icon: IconName; title: string; detail: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="w-9 h-9 rounded-full bg-primarySoft items-center justify-center">
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-text">{title}</Text>
        <Text className="text-sm text-secText mt-0.5 leading-5">{detail}</Text>
      </View>
    </View>
  );
}
