import { Text, View } from "react-native";

import type { Driver } from "@/lib/db/types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { colors } from "@/utils/theme";

type Props = {
  driver: Driver;
  onPress: () => void;
};

const STATUS = {
  "on-road": { label: "On road", tone: "green" as const },
  "trip-today": { label: "Trip today", tone: "blue" as const },
  free: { label: "Free", tone: "slate" as const },
  rest: { label: "Rest", tone: "amber" as const },
};

export function DriverRow({ driver, onPress }: Props) {
  const status = STATUS[driver.status];

  return (
    <Ripple onPress={onPress} accessibilityLabel={`Open ${driver.name}`} className="rounded-lg">
      <Card className="gap-2.5">
        <View className="flex-row items-center gap-3">
          <Avatar initials={driver.initials} photo={driver.photo} size="md" verified />
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
              {driver.name}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <Icon name="star" size={12} color={colors.warning} />
              <Text className="text-sm font-semibold text-text">{driver.rating.toFixed(1)}</Text>
              <Text className="text-sm text-secText">
                · {driver.tripsThisMonth} trips · {driver.base}
              </Text>
            </View>
          </View>
          <Badge label={status.label} tone={status.tone} compact />
        </View>

        <View className="flex-row items-center justify-between rounded-base bg-elevated border border-secBorder px-3 py-2">
          <View className="flex-row items-center gap-1.5 flex-1">
            <Icon name="directions-car" size={14} color={colors.secText} />
            <Text className="text-sm text-secText">
              {driver.vehicleModel} · {driver.plate}
            </Text>
          </View>
          <Text className="text-2xs text-secText" numberOfLines={1}>
            {driver.statusNote}
          </Text>
        </View>

        {driver.permitEndsInDays ? (
          <View className="flex-row items-center gap-1.5">
            <Icon name="error-outline" size={13} color={colors.warning} />
            <Text className="text-sm font-semibold text-warning">
              Permit ends in {driver.permitEndsInDays} days
            </Text>
          </View>
        ) : null}
      </Card>
    </Ripple>
  );
}
