import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { BookedSeatCard } from "@/components/passenger/BookedSeatCard";
import { TripSummaryCard } from "@/components/passenger/TripSummaryCard";
import { PaymentSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { SelectMenuSheet, type SelectOption } from "@/components/ui/SelectMenuSheet";
import { showToast } from "@/components/ui/Toast";
import type { PaymentMethod } from "@/lib/db/types";
import { useCreateBooking } from "@/lib/queries/bookingsQueries";
import { useDriver } from "@/lib/queries/driversQueries";
import { useDefaultPaymentMethod } from "@/lib/queries/passengersQueries";
import { useProfile } from "@/lib/queries/statsQueries";
import { useSeatMap, useTrip } from "@/lib/queries/tripsQueries";
import { dismissLoading, showLoading } from "@/Stores/useLoadingStore";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const METHODS: {
  value: PaymentMethod;
  titleKey: string;
  subKey: string;
  icon: IconName;
}[] = [
  { value: "hesabpay", titleKey: "payment.hesabpay", subKey: "payment.hesabpaySub", icon: "credit-card" },
  { value: "cash", titleKey: "payment.cash", subKey: "payment.cashSub", icon: "payments" },
];

export default function PaymentsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ id: string; seats?: string }>();
  const seatIds = useMemo(
    () => (params.seats ?? "").split(",").filter(Boolean),
    [params.seats],
  );

  const tripQuery = useTrip(params.id);
  const seatsQuery = useSeatMap(params.id);
  const profileQuery = useProfile();
  const { data: trip } = tripQuery;
  const { data: seats } = seatsQuery;
  const { data: profile } = profileQuery;
  const { data: defaultPayment } = useDefaultPaymentMethod();
  const { data: driver } = useDriver(trip?.driverId);
  const createBooking = useCreateBooking();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("0700 123 456");
  const [tazkira, setTazkira] = useState("TK-982410-KD");
  const [paymentChoice, setPaymentChoice] = useState<PaymentMethod | null>(null);
  const [luggage, setLuggage] = useState("0");
  const [note, setNote] = useState("");
  const [luggageSheet, setLuggageSheet] = useState(false);
  const prefilled = useRef(false);

  useEffect(() => {
    if (!profile || prefilled.current) return;
    setName(profile.name);
    prefilled.current = true;
  }, [profile]);

  // Preselect the passenger's default payment method once it loads.
  // The saved default is preselected until the passenger picks another one.
  const payment = paymentChoice ?? defaultPayment ?? null;

  const selectedSeats = useMemo(
    () => (seats ?? []).filter((seat) => seatIds.includes(seat.id)),
    [seats, seatIds],
  );
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const usd = (total / 70.22).toFixed(2);
  const passengerName = name.trim() || profile?.name || "";

  const LUGGAGE_OPTIONS: SelectOption<string>[] = ["0", "1", "2", "3", "4"].map((count) => ({
    value: count,
    label:
      count === "0"
        ? t("payment.luggageNone")
        : t("payment.luggageBags", { count: Number(count) }),
    icon: count === "0" ? "luggage" : "work",
  }));
  const luggageLabel =
    luggage === "0"
      ? t("payment.luggageNone")
      : t("payment.luggageBags", { count: Number(luggage) });

  const [primaryLight, onPrimary] = useCSSVariable([
    "--color-primaryLight",
    "--color-onPrimary",
  ]) as string[];

  const submit = async () => {
    if (!trip || selectedSeats.length === 0) return;
    if (!payment) {
      showToast("warning", t("payment.selectMethod"), t("payment.selectMethodSub"));
      return;
    }
    if (!passengerName) {
      showToast("error", t("payment.passengerDetails"), t("payment.fullName"));
      return;
    }

    showLoading(payment === "hesabpay" ? "Authorizing HesabPay…" : "Reserving seats…");
    try {
      const booking = await createBooking.mutateAsync({
        tripId: trip.id,
        seats: seatIds,
        name: passengerName,
        phone: phone.replace(/\s/g, ""),
        payment,
        luggage: luggage === "0" ? undefined : luggageLabel,
        note: note.trim() || undefined,
      });
      dismissLoading();
      router.replace({
        pathname: "/passenger/confirmed/[id]",
        params: { id: booking.id },
      });
    } catch {
      dismissLoading();
      showToast("error", t("payment.failedTitle"), t("payment.failedBody"));
    }
  };

  return (
    <Screen
      contentClassName="pb-52"
      refreshing={tripQuery.isRefetching || profileQuery.isRefetching}
      onRefresh={() => {
        tripQuery.refetch();
        profileQuery.refetch();
      }}
      footer={
        trip ? (
          <View className="bg-card border-t border-border px-4 pt-3" style={{ paddingBottom: 16 }}>
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-xl font-bold text-text">{t("payment.totalAmount")}</Text>
                <Text className="text-xs text-secText mt-0.5">
                  {t("payment.equivalent", { usd })}
                </Text>
              </View>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-2xl font-bold text-primary">
                  {total.toLocaleString("en-US")}
                </Text>
                <Text className="text-sm font-bold text-primary">{t("common.afn")}</Text>
              </View>
            </View>

            <Ripple
              onPress={submit}
              disabled={createBooking.isPending}
              accessibilityLabel={t("payment.pay", { amount: total.toLocaleString("en-US") })}
              className="mt-3 rounded-full overflow-hidden shadow-button shadow-buttonShadow"
            >
              <LinearGradient
                colors={[primaryLight, "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ paddingVertical: 16, paddingHorizontal: 18 }}
              >
                <View className="flex-row items-center justify-center gap-2">
                  {createBooking.isPending ? (
                    <ActivityIndicator size="small" color={onPrimary} />
                  ) : (
                    <Icon name="shield" size={20} color={onPrimary} />
                  )}
                  <Text className="text-lg font-bold text-onPrimary">
                    {t("payment.pay", { amount: total.toLocaleString("en-US") })}
                  </Text>
                  <Icon name="arrow-forward" size={20} color={onPrimary} />
                </View>
              </LinearGradient>
            </Ripple>
          </View>
        ) : null
      }
    >
      <AppHeader title={t("payment.title")} />

      {tripQuery.isLoading || seatsQuery.isLoading || !trip ? (
        <PaymentSkeleton />
      ) : (
        <View className="px-4 gap-3">
          <Card>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <Text className="text-xl font-bold text-text">{t("payment.passengerDetails")}</Text>
                <Text className="text-xs text-secText mt-0.5">{t("payment.passengerSub")}</Text>
              </View>
              <Badge label={t("payment.primary")} tone="blue" />
            </View>

            <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted mt-4 mb-1.5">
              {t("payment.fullName")}
            </Text>
            <InputShell icon="badge">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t("payment.namePlaceholder")}
                placeholderTextColor={colors.placeholder}
                className="flex-1 text-base-lg font-semibold text-text"
              />
            </InputShell>

            <View className="flex-row gap-2.5 mt-3">
              <View className="flex-1">
                <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted mb-1.5">
                  {t("payment.phone")}
                </Text>
                <InputShell icon="phone">
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder={t("payment.phonePlaceholder")}
                    placeholderTextColor={colors.placeholder}
                    className="flex-1 text-base-lg font-semibold text-text"
                  />
                </InputShell>
              </View>
              <View className="flex-1">
                <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted mb-1.5">
                  {t("payment.tazkira")}
                </Text>
                <InputShell icon="fingerprint">
                  <TextInput
                    value={tazkira}
                    onChangeText={setTazkira}
                    placeholder={t("payment.tazkiraPlaceholder")}
                    placeholderTextColor={colors.placeholder}
                    className="flex-1 text-base-lg font-semibold text-text"
                  />
                </InputShell>
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted mb-1.5">
                {t("payment.luggage")}
              </Text>
              <Ripple
                onPress={() => setLuggageSheet(true)}
                accessibilityLabel={t("payment.luggage")}
                className="flex-row items-center gap-2 rounded-base bg-elevated border border-secBorder px-2.5 py-2.5"
              >
                <Icon name="luggage" size={16} color={colors.secText} />
                <Text className="flex-1 text-base-lg font-semibold text-text">{luggageLabel}</Text>
                <Icon name="expand-more" size={18} color={colors.secText} />
              </Ripple>
            </View>

            <Field
              className="mt-3"
              label={t("payment.note")}
              placeholder={t("payment.notePlaceholder")}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </Card>

          <View className="flex-row items-center gap-2 mt-1 px-1">
            <Icon name="credit-card" size={18} color={colors.primary} />
            <Text className="text-base-lg font-bold text-text">{t("payment.method")}</Text>
          </View>

          {METHODS.map((method) => {
            const active = payment === method.value;
            return (
              <Ripple
                key={method.value}
                onPress={() => setPaymentChoice(method.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(method.titleKey)}
                className={cn(
                  "flex-row items-start gap-2.5 rounded-lg border bg-card px-3.5 py-3.5",
                  active ? "border-primary" : "border-border",
                )}
              >
                <View
                  className={cn(
                    "w-5 h-5 rounded-full border items-center justify-center mt-0.5",
                    active ? "border-primary" : "border-secBorder",
                  )}
                >
                  {active ? <View className="w-2.5 h-2.5 rounded-full bg-primary" /> : null}
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-text">{t(method.titleKey)}</Text>
                  <Text className="text-xs text-secText mt-1 leading-4">{t(method.subKey)}</Text>
                </View>
                <View className="mt-0.5">
                  <Icon name={method.icon} size={19} color={colors.secText} />
                </View>
              </Ripple>
            );
          })}

          <TripSummaryCard trip={trip} driver={driver ?? undefined} />

          <BookedSeatCard
            seat={selectedSeats[0]?.id ?? seatIds[0] ?? "02"}
            name={passengerName || "—"}
          />
        </View>
      )}

      <SelectMenuSheet
        visible={luggageSheet}
        onClose={() => setLuggageSheet(false)}
        title={t("payment.luggage")}
        options={LUGGAGE_OPTIONS}
        value={luggage}
        onSelect={setLuggage}
      />
    </Screen>
  );
}

function InputShell({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <View className="flex-row items-center gap-2 rounded-base bg-elevated border border-secBorder px-2.5 py-2.5">
      <Icon name={icon} size={16} color={colors.secText} />
      {children}
    </View>
  );
}
