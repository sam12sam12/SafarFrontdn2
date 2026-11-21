import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Driver, Trip } from "@/lib/db/types";
import { colors } from "@/utils/theme";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";

type Props = {
  trip: Trip;
  driver?: Driver;
  onPress: () => void;
  onCall: () => void;
};

/** The elevated blue "on the road now" card at the top of the Trips screen. */
export function OwnerLiveTripCard({ trip, driver, onPress, onCall }: Props) {
  const { t } = useTranslation();
  const progress = Math.max(0, Math.min(100, trip.progress ?? 0));

  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={`${trip.code} ${trip.from} ${trip.to}`}
      className="rounded-xl bg-primary p-3.5 shadow-card shadow-shadowColor"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5">
          <View className="w-1.5 h-1.5 rounded-full bg-success" />
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-onPrimary/80">
            {t("owner.onRoadNow")}
          </Text>
        </View>
        <Text className="text-2xs font-semibold text-onPrimary/70">#{trip.code}</Text>
      </View>

      <View className="flex-row items-start justify-between mt-1.5">
        <Text className="text-lg font-bold text-onPrimary flex-1" numberOfLines={1}>
          {trip.from} → {trip.to}
        </Text>
        <Text className="text-sm font-semibold text-onPrimary/85">
          {trip.etaLabel ?? `ETA ${trip.arriveTime} ${trip.arrivePeriod}`}
        </Text>
      </View>

      <View className="mt-3">
        <View className="h-1 w-full rounded-full bg-onPrimary/25 overflow-hidden">
          <View className="h-1 rounded-full bg-onPrimary" style={{ width: `${progress}%` }} />
        </View>
        <View className="flex-row items-center justify-between mt-1.5">
          <Text className="text-2xs font-medium text-onPrimary/70">
            {trip.from} {trip.departTime}
          </Text>
          <Text className="text-2xs font-semibold text-onPrimary">
            {trip.locationLabel ?? trip.boardingPoint}
          </Text>
          <Text className="text-2xs font-medium text-onPrimary/70">{trip.to}</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5 rounded-base bg-onPrimary/15 p-2.5 mt-3">
        <View className="w-9 h-9 rounded-full bg-onPrimary items-center justify-center">
          <Text className="text-sm font-bold text-primary">{driver?.initials ?? "—"}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base-lg font-bold text-onPrimary" numberOfLines={1}>
            {driver?.name ?? t("owner.noDriverAssigned")}
          </Text>
          <Text className="text-2xs text-onPrimary/75" numberOfLines={1}>
            Fielder {trip.vehiclePlate} · {trip.seatsBooked}/{trip.seatsTotal} {t("common.seats")}
          </Text>
        </View>
        <Ripple
          onPress={onCall}
          accessibilityLabel={t("owner.callDriver")}
          className="w-8 h-8 rounded-full bg-onPrimary/20 items-center justify-center"
        >
          <Icon name="phone" size={16} color={colors.onPrimary} />
        </Ripple>
      </View>
    </Ripple>
  );
}
