import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

import type { Driver, Trip } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";

export type HeroTile = { label: string; value: string };

type Props = {
  trip: Trip;
  /** Shows a compact driver row on top of the gradient. */
  driver?: Driver;
  onDriverPress?: () => void;
  /** Up to three stat tiles under the route (service, vehicle, distance…). */
  tiles?: HeroTile[];
  /** Localized trip date, shown centered below the route line. */
  dateText?: string;
  className?: string;
};

/**
 * The route "hero" — a primary-gradient block showing depart/arrive times,
 * cities and boarding points with a car connector, optionally a driver row and
 * a row of stat tiles. One shared header for the driver manifest, the passenger
 * trip details and the seat-selection screens.
 */
export function TripRouteHero({ trip, driver, onDriverPress, tiles, dateText, className }: Props) {
  const { t } = useTranslation();
  const [primaryDark, primary, primaryLight, onPrimary] = useCSSVariable([
    "--color-primaryDark",
    "--color-primary",
    "--color-primaryLight",
    "--color-onPrimary",
  ]) as string[];

  const from = t(`common.${trip.from.toLowerCase()}`);
  const to = t(`common.${trip.to.toLowerCase()}`);
  const vip = trip.service === "vip";
  const vehicleModel = driver?.vehicleModel?.replace(/\s+\d{4}$/, "");

  return (
    <LinearGradient
      colors={[primaryDark, primary, primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={className}
      style={{ borderRadius: 18, padding: 15 }}
    >
      {driver ? (
        <Ripple
          onPress={onDriverPress}
          disabled={!onDriverPress}
          accessibilityLabel={driver.name}
          className="flex-row items-center gap-2.5 mb-3 pb-3 border-b border-card/15"
        >
          <Avatar initials={driver.initials} photo={driver.photo} size="sm" />
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm font-bold text-onPrimary shrink" numberOfLines={1}>
                {driver.name}
              </Text>
              <Icon name="verified" size={12} color={onPrimary} />
            </View>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Icon name="star" size={11} color="#FCD34D" />
              <Text className="text-2xs font-semibold text-onPrimary/85">
                {driver.rating.toFixed(1)} · {t("trip.tripsCount", { count: driver.totalTrips })}
              </Text>
            </View>
          </View>
          {/* service type — far corner, same placement as the passenger home card */}
          <Badge
            label={vip ? t("driver.vipFamily") : t("driver.shared")}
            tone={vip ? "violet" : "blue"}
            compact
          />
        </Ripple>
      ) : null}

      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-onPrimary">{trip.departTime}</Text>
            <Text className="text-xs font-semibold text-onPrimary/70">{trip.departPeriod}</Text>
          </View>
          {/* origin city + direction arrow — "Kandahar →" (flips in RTL) */}
          <View className="flex-row items-center gap-1 mt-0.5">
            <Text className="text-base-lg font-bold text-onPrimary shrink" numberOfLines={1}>
              {from}
            </Text>
            <Icon name="arrow-forward" size={13} color={onPrimary} />
          </View>
        </View>

        <View className="items-center px-1 pt-1">
          <View className="rounded-full bg-card/15 border border-card/25 px-2 py-0.5">
            <Text className="text-2xs font-semibold text-onPrimary">{trip.duration}</Text>
          </View>
          <View className="flex-row items-center mt-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-card" />
            <View className="w-8 h-[1.5px] bg-card/40" />
            <Icon name="directions-car" size={14} color={onPrimary} />
            <View className="w-8 h-[1.5px] bg-card/40" />
            <View className="w-1.5 h-1.5 rounded-full bg-card/50 border border-card" />
          </View>
          {dateText ? (
            <Text className="text-2xs text-onPrimary/70 font-semibold mt-1" numberOfLines={1}>
              {dateText}
            </Text>
          ) : null}
        </View>

        <View className="flex-1 items-end">
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-onPrimary">{trip.arriveTime}</Text>
            <Text className="text-xs font-semibold text-onPrimary/70">{trip.arrivePeriod}</Text>
          </View>
          <Text className="text-base-lg font-bold text-onPrimary mt-0.5">{to}</Text>
        </View>
      </View>

      {tiles && tiles.length > 0 ? (
        <View className="flex-row gap-2 mt-4">
          {tiles.map((tile) => (
            <View
              key={tile.label}
              className="flex-1 rounded-md bg-card/10 border border-card/15 py-2 items-center"
            >
              <Text className="text-2xs font-semibold uppercase tracking-[0.7px] text-onPrimary/60">
                {tile.label}
              </Text>
              <Text className="text-sm font-bold text-onPrimary mt-0.5" numberOfLines={1}>
                {tile.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* car — always the last block of the card */}
      <View className="flex-row items-center gap-2.5 mt-3 rounded-md bg-card/10 border border-card/15 px-2.5 py-2.5">
        <View className="w-8 h-8 rounded-base bg-card/15 items-center justify-center">
          <Icon name="directions-car" size={16} color={onPrimary} />
        </View>
        <View className="flex-1">
          {vehicleModel ? (
            <Text className="text-sm font-bold text-onPrimary" numberOfLines={1}>
              {vehicleModel}
            </Text>
          ) : null}
          <Text
            className={cn(
              "text-2xs text-onPrimary/70",
              vehicleModel && "mt-0.5",
            )}
            numberOfLines={1}
          >
            {t("trip.plate", { plate: trip.vehiclePlate })}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="flex-row items-center gap-1 rounded-full bg-card/15 border border-card/20 px-2 py-1">
            <Icon name="ac-unit" size={11} color={onPrimary} />
            <Text className="text-2xs font-semibold text-onPrimary">{t("common.ac")}</Text>
          </View>
          <View className="flex-row items-center gap-1 rounded-full bg-card/15 border border-card/20 px-2 py-1">
            <Icon name="luggage" size={11} color={onPrimary} />
            <Text className="text-2xs font-semibold text-onPrimary">{t("common.bags")}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
