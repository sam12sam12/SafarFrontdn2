import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { OwnerManageTripSkeleton } from "@/components/skeletons/OwnerSkeletons";
import { useBookings } from "@/lib/queries/bookingsQueries";
import { useDrivers } from "@/lib/queries/driversQueries";
import { useAssignDriver, useSeatMap, useTrip } from "@/lib/queries/tripsQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const DEPARTS_IN = "4h 20m";

export default function ManageTripScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripQuery = useTrip(id);
  const { data: trip } = tripQuery;
  const { data: seats } = useSeatMap(id);
  const { data: bookings } = useBookings("owner");
  const { data: drivers } = useDrivers();
  const assign = useAssignDriver();
  const [pickedDriver, setPickedDriver] = useState<string | undefined>(undefined);

  const driver = drivers?.find((entry) => entry.id === trip?.driverId);
  const tripBookings = (bookings ?? []).filter(
    (booking) => booking.tripId === id && booking.status !== "cancelled",
  );
  const booked = tripBookings.reduce((sum, booking) => sum + booking.amount, 0);
  const paid = tripBookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.amount, 0);
  const freeSeats = Math.max(0, (trip?.seatsTotal ?? 0) - (trip?.seatsBooked ?? 0));
  const allSold = booked + freeSeats * (trip?.price ?? 0);

  const inCity = (drivers ?? []).filter((entry) => entry.base === trip?.from);
  const freeInCity = inCity.filter((entry) => entry.status === "free");
  const candidates =
    freeInCity.length > 0 ? freeInCity : inCity.filter((entry) => entry.status !== "on-road");

  if (tripQuery.isLoading || !trip) {
    return (
      <Screen contentClassName="pb-8">
        <View className="px-4 pt-3">
          <Text className="text-xl font-bold text-text">{t("owner.manageTripTitle")}</Text>
        </View>
        <OwnerManageTripSkeleton />
      </Screen>
    );
  }

  const statusLabel =
    trip.status === "needs-driver"
      ? t("owner.needsDriverBadge")
      : trip.status === "on-road"
        ? t("owner.onRoadBadge")
        : trip.status === "boarding"
          ? t("owner.boarding")
          : t("owner.scheduledBadge");

  return (
    <Screen contentClassName="pb-8">
      <View className="flex-row items-center gap-3 px-4 pt-3 pb-3">
        <Ripple
          onPress={() => router.back()}
          accessibilityLabel={t("owner.manageTripTitle")}
          className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
        >
          <Icon name="arrow-back" size={19} color={colors.text} />
        </Ripple>
        <View className="flex-1">
          <Text className="text-xl font-bold text-text">
            {t("owner.tripHeader", { code: trip.code })}
          </Text>
          <Text className="text-sm text-secText mt-0.5">
            {trip.dateLabel} · {trip.service === "vip" ? t("owner.serviceVip") : t("owner.bookingFilterShared")}
          </Text>
        </View>
        <Ripple
          onPress={() => showToast("info", t("owner.edit"), t("owner.mockDisclaimer"))}
          accessibilityLabel={t("owner.edit")}
          className="flex-row items-center gap-1 rounded-full border border-primaryBorder px-3 py-1.5"
        >
          <Icon name="edit" size={14} color={colors.primary} />
          <Text className="text-sm font-semibold text-primary">{t("owner.edit")}</Text>
        </Ripple>
      </View>

      <View className="px-4 gap-3">
        <View className="rounded-xl bg-primary p-4 shadow-card shadow-shadowColor">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5 rounded-full bg-onPrimary/15 px-2 py-1">
              <View className="w-1.5 h-1.5 rounded-full bg-onPrimary/80" />
              <Text className="text-2xs font-bold uppercase tracking-[0.8px] text-onPrimary/85">
                {statusLabel}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-onPrimary/80">
              {t("owner.departsIn", { time: DEPARTS_IN })}
            </Text>
          </View>

          <View className="flex-row items-start justify-between mt-3">
            <View className="flex-1">
              <View className="flex-row items-baseline gap-1">
                <Text className="text-3xl font-bold text-onPrimary">{trip.departTime}</Text>
                <Text className="text-base-lg font-semibold text-onPrimary/80">{trip.departPeriod}</Text>
              </View>
              <Text className="text-base-lg font-bold text-onPrimary mt-0.5">{trip.from}</Text>
              <Text className="text-2xs text-onPrimary/70" numberOfLines={1}>
                {trip.boardingPoint}
              </Text>
            </View>

            <View className="items-center px-1 w-24 mt-2">
              <Text className="text-2xs font-semibold text-onPrimary/70">
                {trip.duration} · {trip.distanceKm} km
              </Text>
              <View className="flex-row items-center gap-1 mt-1 w-full">
                <View className="w-1.5 h-1.5 rounded-full bg-onPrimary" />
                <View className="flex-1 h-[1px] border-t border-dashed border-onPrimary/40" />
                <View className="w-1.5 h-1.5 rounded-full bg-onPrimary" />
              </View>
            </View>

            <View className="flex-1 items-end">
              <View className="flex-row items-baseline gap-1">
                <Text className="text-3xl font-bold text-onPrimary">{trip.arriveTime}</Text>
                <Text className="text-base-lg font-semibold text-onPrimary/80">{trip.arrivePeriod}</Text>
              </View>
              <Text className="text-base-lg font-bold text-onPrimary mt-0.5">{trip.to}</Text>
              <Text className="text-2xs text-onPrimary/70" numberOfLines={1}>
                {trip.dropOffPoint}
              </Text>
            </View>
          </View>
        </View>

        <Card className="border-warning/50 gap-2.5">
          <View className="flex-row items-center gap-2">
            <Icon name="error-outline" size={19} color={colors.warning} />
            <Text className="text-lg font-bold text-text">{t("owner.chooseDriverCar")}</Text>
          </View>
          <Text className="text-sm text-secText">
            {t("owner.freeInCityTime", { city: trip.from })}
          </Text>

          <View className="gap-2">
            {candidates.slice(0, 4).map((entry) => {
              const active = pickedDriver === entry.id;
              return (
                <Ripple
                  key={entry.id}
                  onPress={() => setPickedDriver(active ? undefined : entry.id)}
                  accessibilityRole="radio"
                  accessibilityLabel={entry.name}
                  accessibilityState={{ selected: active }}
                  className={cn(
                    "flex-row items-center gap-2.5 rounded-base border p-2.5",
                    active ? "border-primary" : "border-border",
                  )}
                >
                  <View className="w-9 h-9 rounded-full bg-primarySoft items-center justify-center">
                    <Text className="text-sm font-bold text-primary">{entry.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base-lg font-semibold text-text">{entry.name}</Text>
                    <View className="flex-row items-center gap-1">
                      <Icon name="star" size={10} color={colors.warning} />
                      <Text className="text-2xs text-secText">
                        {entry.rating.toFixed(1)} · Fielder {entry.plate} · {t("owner.freeAllDay")}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    name={active ? "radio-button-checked" : "radio-button-unchecked"}
                    size={20}
                    color={active ? colors.primary : colors.slate}
                  />
                </Ripple>
              );
            })}
          </View>

          <AppButton
            label={t("owner.assignNotify")}
            loading={assign.isPending}
            disabled={!pickedDriver}
            onPress={async () => {
              if (!pickedDriver) return;
              try {
                await assign.mutateAsync({ tripId: trip.id, driverId: pickedDriver });
                showToast(
                  "success",
                  t("owner.driverAssigned"),
                  candidates.find((entry) => entry.id === pickedDriver)?.name ?? "",
                );
                setPickedDriver(undefined);
              } catch {
                showToast("error", t("owner.couldNotAssign"), t("owner.tryAnotherDriver"));
              }
            }}
          />
        </Card>

        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text">{t("owner.seatsHeading")}</Text>
            <Text className="text-sm font-bold text-primary">
              {t("owner.seatsBookedOf", { booked: trip.seatsBooked, total: trip.seatsTotal })}
            </Text>
          </View>

          <View className="gap-2">
            {[0, 2].map((start) => (
              <View key={start} className="flex-row gap-2">
                {(seats ?? []).slice(start, start + 2).map((seat) => {
                  const booking = tripBookings.find((entry) => entry.seats.includes(seat.id));
                  const occupied = Boolean(booking);
                  return (
                    <View
                      key={seat.id}
                      className={cn(
                        "flex-1 rounded-base border p-2.5 gap-1",
                        occupied ? "border-warning/60 bg-warningSoft" : "border-primaryBorder border-dashed bg-card",
                      )}
                    >
                      <Text className="text-2xs font-bold uppercase tracking-[0.6px] text-muted">
                        {seat.legroom
                          ? t("owner.seatLegroom", { seat: seat.id })
                          : t("owner.seatPlain", { seat: seat.id })}
                      </Text>
                      <Text
                        className={cn(
                          "text-base-lg font-bold",
                          occupied ? "text-text" : "text-primary",
                        )}
                        numberOfLines={1}
                      >
                        {booking?.passengerName ?? t("owner.addPassenger")}
                      </Text>
                      <Text className="text-sm text-secText" numberOfLines={1}>
                        {booking
                          ? booking.paymentStatus === "paid"
                            ? t("owner.confirmedPaid", { amount: seat.price.toLocaleString("en-US") })
                            : `${booking.status === "new" ? t("owner.tabNewShort") : t("owner.tabConfirmed")} · ${t(
                                "owner.unpaidWord",
                              )} ${seat.price.toLocaleString("en-US")}`
                          : t("owner.seatOpen", { price: seat.price.toLocaleString("en-US") })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <Text className="text-sm text-muted">{t("owner.walkInHint")}</Text>
        </Card>

        <Card>
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted mb-1">
            {t("owner.money")}
          </Text>
          <DetailRow label={t("owner.bookedSoFar")} value={`${booked.toLocaleString("en-US")} ${t("common.afn")}`} />
          <DetailRow
            label={t("owner.paidByHesabpay")}
            value={`${paid.toLocaleString("en-US")} ${t("common.afn")}`}
          />
          <DetailRow
            label={t("owner.toCollectAgency")}
            value={`${(booked - paid).toLocaleString("en-US")} ${t("common.afn")}`}
            tone="warning"
          />
          <View className="h-[1px] bg-secBorder my-1" />
          <DetailRow
            label={t("owner.ifAllSeatsSell")}
            value={`${allSold.toLocaleString("en-US")} ${t("common.afn")}`}
            valueClassName="font-bold"
          />
        </Card>

        <Card className="py-2">
          <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
            {t("owner.actions")}
          </Text>
          {[
            {
              title: t("owner.messageAll"),
              subtitle: t("owner.messageAllSub"),
              onPress: () =>
                showToast("success", t("owner.smsSent"), t("owner.messageAllSub")),
            },
            {
              title: t("owner.moveTrip"),
              subtitle: t("owner.moveTripSub"),
              onPress: () => showToast("info", t("owner.moveTrip"), t("owner.moveTripSub")),
            },
            {
              title: t("owner.closeBooking"),
              subtitle: t("owner.closeBookingSub"),
              onPress: () => showToast("info", t("owner.closeBooking"), t("owner.closeBookingSub")),
            },
          ].map((action) => (
            <Ripple
              key={action.title}
              onPress={action.onPress}
              accessibilityLabel={action.title}
              className="flex-row items-center gap-3 py-3 border-t border-secBorder"
            >
              <View className="flex-1">
                <Text className="text-base-lg font-semibold text-text">{action.title}</Text>
                <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
                  {action.subtitle}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.muted} />
            </Ripple>
          ))}
        </Card>

        <AppButton
          label={t("owner.cancelTrip")}
          variant="danger"
          onPress={() => showToast("warning", t("owner.cancelTrip"), t("owner.tryAgain"))}
        />
      </View>
    </Screen>
  );
}
