import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { CarCabin } from "@/components/passenger/CarCabin";
import { Icon } from "@/components/ui/Icon";
import type { Seat } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type Props = {
  seats: Seat[];
  driverName: string;
};

export function DriverSeatMap({ seats, driverName }: Props) {
  const { t } = useTranslation();
  const byId = (id: string) => seats.find((seat) => seat.id === id);
  const captain = driverName.split(" ").slice(-1)[0];

  return (
    <CarCabin strokeColor="#0891B2">
      <View
        style={{ position: "absolute", top: "19%", left: "8%", right: "8%", height: "29%" }}
        className="flex-row justify-between"
      >
        <View className="w-[42%] rounded-md bg-text border border-text items-center justify-center">
          <Icon name="sports-motorsports" size={20} color={colors.onPrimary} />
          <Text className="text-sm font-bold text-onPrimary mt-1">{t("driver.youDriver")}</Text>
          <Text className="text-2xs text-onPrimary/65 mt-0.5">
            {t("driver.captain", { name: captain })}
          </Text>
        </View>

        <View className="w-[42%]">
          <PassengerSeat seat={byId("01")} label={t("driver.frontVip")} />
        </View>
      </View>

      <View
        style={{ position: "absolute", bottom: "6%", left: "6%", right: "6%", height: "30%" }}
        className="flex-row gap-2"
      >
        {["02", "03", "04"].map((id) => (
          <PassengerSeat key={id} seat={byId(id)} />
        ))}
      </View>
    </CarCabin>
  );
}

function PassengerSeat({ seat, label }: { seat?: Seat; label?: string }) {
  const { t } = useTranslation();
  if (!seat) return <View className="flex-1" />;

  const paid = seat.status === "paid";
  const due = seat.status === "due";
  const walkIn = seat.status === "walk-in";
  const available = seat.status === "available";

  const shell = paid
    ? "bg-primary border-primary"
    : due
      ? "bg-warningSoft border-warning"
      : walkIn
        ? "bg-elevated border-border border-dashed"
        : "bg-card border-primaryBorder";

  const strong = paid ? "text-onPrimary" : "text-text";
  const soft = paid ? "text-onPrimary/70" : due ? "text-warning" : "text-muted";

  return (
    <View
      className={cn(
        "flex-1 h-full rounded-md border items-center justify-center px-1 py-1.5",
        shell,
      )}
    >
      {label ? (
        <>
          <Text className={cn("text-2xs font-bold uppercase tracking-[0.4px]", soft)} numberOfLines={1}>
            {label}
          </Text>
          <Text className={cn("text-2xs font-semibold mt-0.5", soft)} numberOfLines={1}>
            {t("driver.seat", { seat: seat.id })}
          </Text>
        </>
      ) : (
        <Text className={cn("text-2xs font-bold uppercase tracking-[0.4px]", soft)} numberOfLines={1}>
          {seat.legroom ? t("driver.frontVip") : t("driver.seat", { seat: seat.id })}
        </Text>
      )}
      <Text className={cn("text-xs font-bold mt-0.5", strong)} numberOfLines={1}>
        {walkIn ? t("driver.empty") : seat.occupant ?? t("driver.empty")}
      </Text>
      <Text className={cn("text-2xs mt-0.5", soft)} numberOfLines={1}>
        {paid
          ? `✓ ${t("driver.paid")}`
          : due
            ? t("driver.dueAmount", { amount: seat.price.toLocaleString("en-US") })
            : walkIn
              ? t("driver.walkIn")
              : available
                ? `${seat.price.toLocaleString("en-US")} AFN`
                : t("driver.empty")}
      </Text>
    </View>
  );
}
