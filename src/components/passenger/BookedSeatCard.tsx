import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";

type Props = {
  seat: string;
  name: string;
  frontWindow?: boolean;
  className?: string;
};

export function BookedSeatCard({ seat, name, frontWindow = true, className }: Props) {
  const { t } = useTranslation();

  return (
    <Card className={className} flat>
      <View className="flex-row items-center gap-3 py-1">
        <View className="w-10 h-10 rounded-full bg-primarySoft items-center justify-center">
          <Icon name="airline-seat-recline-normal" size={20} color="#1D4ED8" />
        </View>
        <View className="flex-1">
          <Text className="text-2xs font-bold uppercase tracking-[0.9px] text-muted">
            {t("trip.bookedSeat")}
          </Text>
          <Text className="text-base font-bold text-text mt-0.5">
            {frontWindow
              ? t("trip.seatFrontWindow", { seat })
              : t("trip.seatWindow", { seat })}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm font-bold text-text text-right">{name}</Text>
          <Text className="text-2xs text-secText mt-0.5">{t("trip.ticketConfirmed")}</Text>
        </View>
      </View>
    </Card>
  );
}
