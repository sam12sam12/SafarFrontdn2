import { Text, View } from "react-native";

import type { Driver, Trip } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { Rating } from "../ui/Rating";
import { RouteStrip } from "../ui/RouteStrip";
import { colors } from "@/utils/theme";

type Props = {
  trip: Trip;
  driver?: Driver;
  seatsAvailable: number;
  onSelect: () => void;
  className?: string;
};

const AMENITIES = ["AC", "2 Bags"];

export function TripCard({ trip, driver, seatsAvailable, onSelect, className }: Props) {
  const soldOut = seatsAvailable === 0;

  return (
    <Card className={cn("rounded-lg p-4", className)}>
      <View className="flex-row items-center gap-3">
        <Avatar
          initials={driver?.initials ?? "EH"}
          photo={driver?.photo}
          size="md"
          verified={Boolean(driver)}
        />
        <View className="flex-1">
          <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
            {driver?.name ?? "Highway captain"}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-0.5">
            <Icon name="star" size={13} color={colors.warning} />
            <Text className="text-sm font-semibold text-text">
              {(driver?.rating ?? 4.9).toFixed(1)}
            </Text>
            <Text className="text-sm text-secText">
              ({driver?.totalTrips ?? 184} trips)
            </Text>
          </View>
        </View>
        <Badge label={trip.code} tone="slate" compact />
      </View>

      <RouteStrip
        className="mt-3.5"
        fromCity={trip.from}
        toCity={trip.to}
        departTime={trip.departTime}
        departPeriod={trip.departPeriod}
        arriveTime={trip.arriveTime}
        arrivePeriod={trip.arrivePeriod}
        duration={trip.duration}
      />

      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-2 flex-1">
          <View className="w-8 h-8 rounded-base bg-primarySoft items-center justify-center">
            <Icon name="directions-car" size={17} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-base-lg font-semibold text-text">Toyota Fielder</Text>
            <Text className="text-sm text-secText">Plate {trip.vehiclePlate}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1.5">
          {AMENITIES.map((amenity) => (
            <Badge
              key={amenity}
              label={amenity}
              tone="slate"
              compact
              icon={amenity === "AC" ? "ac-unit" : "luggage"}
            />
          ))}
        </View>
      </View>

      <View className="flex-row items-end justify-between mt-3.5">
        <View>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-2xl font-bold text-text">
              {trip.price.toLocaleString("en-US")}
            </Text>
            <Text className="text-sm font-semibold text-secText">AFN</Text>
          </View>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Icon
              name="airline-seat-recline-normal"
              size={12}
              color={soldOut ? colors.error : colors.error}
            />
            <Text
              className={cn("text-sm font-semibold", soldOut ? "text-error" : "text-error")}
            >
              {soldOut ? "Fully booked" : `${seatsAvailable} seats available`}
            </Text>
          </View>
        </View>

        <Ripple
          onPress={onSelect}
          disabled={soldOut}
          accessibilityLabel={`Select seats on ${trip.code}`}
          className={cn(
            "flex-row items-center gap-1.5 rounded-full px-4 py-2.5",
            soldOut ? "bg-disable" : "bg-primary shadow-button shadow-buttonShadow",
          )}
        >
          <Text
            className={cn(
              "text-base-lg font-bold",
              soldOut ? "text-muted" : "text-onPrimary",
            )}
          >
            Select Seats
          </Text>
          {!soldOut ? <Icon name="chevron-right" size={16} color={colors.onPrimary} /> : null}
        </Ripple>
      </View>
    </Card>
  );
}

export function DriverSummary({ driver }: { driver?: Driver }) {
  if (!driver) return null;
  return (
    <View className="flex-row items-center gap-2">
      <Avatar initials={driver.initials} photo={driver.photo} size="sm" />
      <View>
        <Text className="text-base-lg font-semibold text-text">{driver.name}</Text>
        <Rating value={driver.rating} count={`${driver.totalTrips} trips`} size={12} />
      </View>
    </View>
  );
}
