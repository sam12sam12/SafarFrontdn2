import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Booking, Trip } from "@/lib/db/types";
import { minusMinutes } from "@/lib/format";
import { Badge } from "../ui/Badge";
import { Barcode } from "../ui/Barcode";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { QrPlaceholder } from "../ui/QrPlaceholder";

type Props = {
  booking: Booking;
  trip: Trip;
  gate?: string;
};

export function BoardingPassCard({ booking, trip, gate = "3" }: Props) {
  const { t } = useTranslation();
  const boardingCutoff = minusMinutes(trip.departTime, 30);

  return (
    <Card className="p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base-lg font-bold text-text">{t("bookings.boardingPass")}</Text>
        <Badge label={t("bookings.gate", { gate })} tone="blue" />
      </View>

      <View className="flex-row mt-3">
        <QrPlaceholder value={booking.code} size={96} className="rounded-sm" />
        <View className="flex-1 pl-3 justify-between py-0.5">
          <Text className="text-xs text-secText leading-4">
            {t("bookings.showAtGate", { gate, time: boardingCutoff })}
          </Text>
          <Barcode value={booking.reference ?? booking.code} className="mt-2" height={34} />
        </View>
      </View>

      <Text className="text-2xs text-muted mt-2.5">{t("bookings.scanNote")}</Text>

      <View className="flex-row items-center mt-3 rounded-base bg-elevated border border-secBorder py-2.5">
        <View className="flex-1 flex-row items-center justify-center gap-1.5">
          <Icon name="offline-bolt" size={14} color="#64748B" />
          <Text className="text-xs font-semibold text-secText">{t("bookings.offlineUse")}</Text>
        </View>
        <View className="w-[1px] h-5 bg-border" />
        <View className="flex-1 flex-row items-center justify-center gap-1.5">
          <Icon name="account-balance-wallet" size={14} color="#64748B" />
          <Text className="text-xs font-semibold text-secText">{t("bookings.wallets")}</Text>
        </View>
      </View>
    </Card>
  );
}
