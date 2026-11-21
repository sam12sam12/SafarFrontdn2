import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Driver } from "@/lib/db/types";
import { showToast } from "@/components/ui/Toast";
import { colors } from "@/utils/theme";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";

type Props = {
  driver: Driver;
  onPress: () => void;
};

const STATUS = {
  "on-road": { key: "owner.statusOnRoad", pill: "text-success", dot: true },
  "trip-today": { key: "owner.countTripToday", pill: "text-primary", dot: true },
  free: { key: "owner.statusFree", pill: "text-success", dot: true },
  rest: { key: "owner.statusRest", pill: "text-secText", dot: false },
} as const;

export function DriverRow({ driver, onPress }: Props) {
  const { t } = useTranslation();
  const status = STATUS[driver.status];
  const vehicle = driver.vehicleModel.replace("Toyota ", "").replace(" 2018", "");

  return (
    <Ripple onPress={onPress} accessibilityLabel={driver.name} className="rounded-lg">
      <Card className="gap-2.5 p-3.5 rounded-lg">
        <View className="flex-row items-center gap-2.5">
          <Avatar initials={driver.initials} photo={driver.photo} size="sm" online={status.dot} />
          <View className="flex-1">
            <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
              {driver.name}
            </Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Icon name="star" size={11} color={colors.warning} />
              <Text className="text-sm font-semibold text-secText">{driver.rating.toFixed(1)}</Text>
              <Text className="text-sm text-muted" numberOfLines={1}>
                · {driver.tripsThisMonth} {t("owner.thisMonth")} · {driver.base}
              </Text>
            </View>
          </View>
          <Ripple
            onPress={() => showToast("info", t("owner.calling"), driver.name)}
            accessibilityLabel={`${t("owner.callDriver")} ${driver.name}`}
            className="w-8 h-8 rounded-full bg-primarySoft items-center justify-center"
          >
            <Icon name="phone" size={15} color={colors.primary} />
          </Ripple>
        </View>

        <View className="flex-row items-center gap-2 rounded-sm bg-elevated px-2 py-1.5">
          <Text className={`text-sm font-bold ${status.pill}`}>{t(status.key)}</Text>
          <Text className="text-sm text-secText flex-1" numberOfLines={1}>
            {driver.statusNote}
          </Text>
        </View>

        <View className="flex-row items-center justify-between gap-2 pt-2 border-t border-secBorder">
          <View className="flex-row items-center gap-1.5 flex-1">
            <Icon name="directions-car" size={14} color={colors.muted} />
            <Text className="text-sm text-secText" numberOfLines={1}>
              {vehicle} · {driver.plate}
            </Text>
          </View>
          {driver.permitEndsInDays ? (
            <Badge
              label={t("owner.permitEnds", { count: driver.permitEndsInDays })}
              tone="amber"
              compact
            />
          ) : null}
        </View>
      </Card>
    </Ripple>
  );
}
