import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { CarCabin } from "@/components/passenger/CarCabin";
import { TripRouteHero } from "@/components/trip/TripRouteHero";
import { SeatSelectionSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import type { Seat } from "@/lib/db/types";
import { formatTripDate } from "@/lib/dates";
import { useDriver } from "@/lib/queries/driversQueries";
import { useSeatMap, useTrip } from "@/lib/queries/tripsQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const params = useLocalSearchParams<{ id: string; seats?: string }>();

  const tripQuery = useTrip(params.id);
  const seatsQuery = useSeatMap(params.id);
  const { data: trip } = tripQuery;
  const { data: seats, isLoading } = seatsQuery;
  const { data: driver } = useDriver(trip?.driverId);

  const maxSeats = Math.min(Math.max(Number(params.seats ?? 1) || 1, 1), 4);
  const [selected, setSelected] = useState<string[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!seats || initialized.current) return;
    const preferred =
      seats.find((seat) => seat.id === "02" && seat.status === "available") ??
      seats.find((seat) => seat.status === "available");
    if (preferred) setSelected([preferred.id]);
    initialized.current = true;
  }, [seats]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== "available") return;
    setSelected((current) => {
      if (current.includes(seat.id)) return current.filter((id) => id !== seat.id);
      if (maxSeats === 1) return [seat.id];
      if (current.length >= maxSeats) {
        showToast(
          "warning",
          t("seats.noSeat"),
          t("seats.seatCount", {
            count: maxSeats,
            seat: current[0],
            seats: current.join(", "),
          }),
        );
        return current;
      }
      return [...current, seat.id];
    });
  };

  const seatList = seats ?? [];
  const selectedSeats = seatList.filter((seat) => selected.includes(seat.id));
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const seatLabel = (id: string) => seatList.find((seat) => seat.id === id);

  return (
    <Screen
      contentClassName="pb-48"
      refreshing={tripQuery.isRefetching || seatsQuery.isRefetching}
      onRefresh={() => {
        tripQuery.refetch();
        seatsQuery.refetch();
      }}
      footer={
        trip ? (
          <View className="bg-card border-t border-border px-4 pt-3" style={{ paddingBottom: 18 }}>
            <Text className="text-sm text-secText">
              {selected.length === 0
                ? t("seats.noSeat")
                : t("seats.seatCount", {
                    count: selected.length,
                    seat: selected[0],
                    seats: selected.join(", "),
                  })}
            </Text>
            <View className="flex-row items-end justify-between mb-2.5">
              <Text className="text-base-lg font-semibold text-text">{t("seats.totalToPay")}</Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-2xl font-bold text-text">
                  {total.toLocaleString("en-US")}
                </Text>
                <Text className="text-sm font-semibold text-secText">{t("common.afn")}</Text>
              </View>
            </View>
            <AppButton
              label={t("seats.continuePayment")}
              icon="arrow-forward"
              disabled={selected.length === 0}
              onPress={() =>
                router.push({
                  pathname: "/passenger/checkout/[id]",
                  params: { id: params.id, seats: selected.join(",") },
                })
              }
            />
          </View>
        ) : null
      }
    >
      <AppHeader title={t("seats.title")} />

      {tripQuery.isLoading || isLoading || !trip ? (
        <SeatSelectionSkeleton />
      ) : (
        <View className="px-4 gap-3">
          <TripRouteHero
            trip={trip}
            driver={driver ?? undefined}
            onDriverPress={
              trip.driverId
                ? () =>
                    router.push({ pathname: "/passenger/driver/[id]", params: { id: trip.driverId! } })
                : undefined
            }
            dateText={formatTripDate(trip.date, i18n.language)}
            tiles={[{ label: t("home.passengerCap"), value: String(trip.seatsTotal) }]}
          />

          <Card className="p-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-text">{t("seats.selectCabin")}</Text>
                <Text className="text-sm text-secText mt-1">{t("seats.vehicleSub")}</Text>
              </View>
              <View className="flex-row items-center gap-1.5 rounded-base bg-elevated px-2.5 py-1.5">
                <Icon name="ac-unit" size={13} color={colors.secText} />
                <Text className="text-2xs font-semibold text-secText leading-3">
                  {t("seats.dualAc")}
                </Text>
              </View>
            </View>

            <CarCabin>
              <View
                style={{ position: "absolute", top: "19%", left: "12%", right: "12%", height: "29%" }}
                className="flex-row justify-between"
              >
                <View
                  style={{ width: "42%" }}
                  className="rounded-md bg-elevated border border-secBorder items-center justify-center"
                >
                  <Icon name="grid-view" size={20} color="#B6C2D2" />
                  <Text className="text-xs font-semibold text-secText mt-2" numberOfLines={1}>
                    {driver?.name.replace(/^Ustad\s+/, "") ?? "Nabi"}
                  </Text>
                  <Text className="text-2xs text-muted mt-0.5">{t("seats.chauffeur")}</Text>
                </View>
                <View style={{ width: "42%" }}>
                  <CabinSeat
                    seat={seatLabel("01")}
                    selected={selected.includes("01")}
                    onPress={() => {
                      const seat = seatLabel("01");
                      if (seat) toggleSeat(seat);
                    }}
                    extraLabel="+150 AFN"
                    cursor
                  />
                </View>
              </View>

              <View
                style={{ position: "absolute", bottom: "6%", left: "6%", right: "6%", height: "30%" }}
                className="flex-row gap-2"
              >
                {["02", "03", "04"].map((id) => {
                  const seat = seatLabel(id);
                  return (
                    <CabinSeat
                      key={id}
                      seat={seat}
                      selected={selected.includes(id)}
                      onPress={() => {
                        if (seat) toggleSeat(seat);
                      }}
                    />
                  );
                })}
              </View>
            </CarCabin>

            <View className="flex-row items-center justify-around bg-elevated rounded-full py-2.5 mt-3">
              <LegendItem color="#0B1220" label={t("seats.available")} />
              <LegendItem color="#1D4ED8" label={t("seats.selected")} />
              <LegendItem color="#CBD5E1" label={t("seats.reserved")} />
              <LegendItem color="#0B1220" label={t("seats.driver")} />
            </View>
          </Card>

          <Card>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-text">{t("seats.pickup")}</Text>
              <Icon name="place" size={20} color="#0B1220" />
            </View>

            <View className="mt-3.5">
              <View className="flex-row">
                <View className="items-center w-5 pt-1">
                  <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#06B6D4" }} />
                  <View className="w-[2px] flex-1 bg-primaryBorder my-1" />
                </View>
                <View className="flex-1 flex-row justify-between pb-4">
                  <View className="flex-1 pr-2">
                    <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted">
                      {t("seats.boardingStop")}
                    </Text>
                    <Text className="text-base-lg font-bold text-text mt-0.5">
                      {t("seats.boardingPoint")}
                    </Text>
                  </View>
                  <Text className="text-sm text-secText mt-3">{t("seats.boardingTime")}</Text>
                </View>
              </View>

              <View className="flex-row">
                <View className="items-center w-5 pt-1">
                  <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                </View>
                <View className="flex-1 flex-row justify-between">
                  <View className="flex-1 pr-2">
                    <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted">
                      {t("seats.arrivalTerminal")}
                    </Text>
                    <Text className="text-base-lg font-bold text-text mt-0.5">
                      {t("seats.arrivalPoint")}
                    </Text>
                  </View>
                  <Text className="text-sm text-secText mt-3">{t("seats.arrivalTime")}</Text>
                </View>
              </View>
            </View>
          </Card>

          <View>
            <Text className="text-base-lg font-bold text-text">{t("seats.travelType")}</Text>
            <View className="flex-row gap-2.5 mt-2">
              <View className="flex-1 rounded-base border border-primary bg-primarySoft p-3">
                <View className="flex-row items-center gap-2">
                  <Icon name="radio-button-checked" size={16} color={colors.primary} />
                  <Text className="text-base-lg font-bold text-text">{t("seats.specificSeats")}</Text>
                </View>
                <Text className="text-2xs text-secText mt-1.5">
                  {selected[0] ? t("seats.seatSelected", { seat: selected[0] }) : t("seats.noSeat")}
                </Text>
              </View>
              <View className="flex-1 rounded-base border border-border bg-disable p-3 opacity-60">
                <View className="flex-row items-center gap-2">
                  <Icon name="radio-button-unchecked" size={16} color={colors.muted} />
                  <Text className="text-base-lg font-bold text-secText">{t("seats.entireCar")}</Text>
                </View>
                <Text className="text-2xs text-muted mt-1.5">{t("seats.unavailable")}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
}

function CabinSeat({
  seat,
  selected,
  onPress,
  extraLabel,
  cursor,
}: {
  seat?: Seat;
  selected: boolean;
  onPress: () => void;
  extraLabel?: string;
  cursor?: boolean;
}) {
  const { t } = useTranslation();
  if (!seat) return <View className="flex-1" />;

  const available = seat.status === "available";
  const reserved = seat.status === "paid" || seat.status === "due" || seat.status === "walk-in";

  return (
    <View className="flex-1 relative">
      {extraLabel && available ? (
        <View className="absolute -top-2 right-2 z-10 rounded-full bg-primary px-1.5 py-0.5">
          <Text className="text-2xs font-bold text-onPrimary">{extraLabel}</Text>
        </View>
      ) : null}
      <Ripple
        onPress={onPress}
        disabled={!available}
        accessibilityLabel={`Seat ${seat.id}`}
        className={cn(
          "w-full h-full rounded-md border items-center justify-center px-1 py-1.5",
          selected
            ? "bg-primary border-primary"
            : reserved
              ? "bg-disable border-secBorder"
              : "bg-card border-border",
        )}
      >
        {cursor && available ? (
        <Icon name="touch-app" size={16} color={colors.primary} />
        ) : (
          <Icon
            name={reserved ? "airline-seat-recline-extra" : "airline-seat-recline-normal"}
            size={19}
            color={selected ? colors.onPrimary : reserved ? "#94A3B8" : colors.primary}
          />
        )}
        <Text
          className={cn(
            "text-sm font-bold mt-1.5",
            selected ? "text-onPrimary" : reserved ? "text-muted" : "text-text",
          )}
        >
          Seat {seat.id}
        </Text>

        {selected ? (
          <>
            <Text className="text-2xs text-onPrimary/80 mt-0.5">
              {seat.id === "01" ? t("seats.extraLegroom") : `${t("seats.window")} •`}
            </Text>
            <Text className="text-2xs font-semibold text-onPrimary/90">{t("seats.yours")}</Text>
          </>
        ) : reserved ? (
          <Text className="text-2xs text-muted mt-0.5">{t("seats.reserved")}</Text>
        ) : seat.legroom ? (
          <Text className="text-2xs text-secText mt-0.5">{t("seats.extraLegroom")}</Text>
        ) : (
          <Text className="text-2xs text-secText mt-0.5">
            {seat.price.toLocaleString("en-US")} AFN
          </Text>
        )}
      </Ripple>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-2xs font-semibold text-secText">{label}</Text>
    </View>
  );
}
