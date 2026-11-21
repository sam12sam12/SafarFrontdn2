import { Text, View } from "react-native";

import type { Trip } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { SeatProgress } from "../ui/Progress";
import { colors } from "@/utils/theme";

type Props = {
  trip: Trip;
  earnings: number;
  onPress: () => void;
};

const STATUS_TONE = {
  boarding: "blue",
  "on-road": "green",
  scheduled: "slate",
  full: "violet",
  "needs-driver": "amber",
  completed: "slate",
} as const;

export function DriverTripCard({ trip, earnings, onPress }: Props) {
  return (
    <Card className="p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-baseline gap-1.5">
          <Text className="text-xl font-bold text-text">{trip.departTime}</Text>
          <Text className="text-sm font-semibold text-secText">{trip.departPeriod}</Text>
          <Icon name="arrow-forward" size={14} color={colors.muted} />
          <Text className="text-base-lg font-semibold text-secText">
            {trip.arriveTime} {trip.arrivePeriod}
          </Text>
        </View>
        <Badge
          label={trip.status === "on-road" ? "On road" : trip.status === "needs-driver" ? "No driver" : trip.status}
          tone={STATUS_TONE[trip.status]}
          compact
        />
      </View>

      <View className="flex-row items-center gap-1.5 mt-1">
        <Text className="text-base-lg font-bold text-text">{trip.from}</Text>
        <Icon name="trending-flat" size={16} color={colors.primary} />
        <Text className="text-base-lg font-bold text-text">{trip.to}</Text>
        <Text className="text-sm text-secText">· {trip.code}</Text>
      </View>

      <View className="flex-row items-center gap-2 mt-3">
        <SeatProgress total={trip.seatsTotal} filled={trip.seatsBooked} className="flex-1" />
        <Text className="text-sm font-semibold text-secText">
          {trip.seatsBooked}/{trip.seatsTotal} seats
        </Text>
      </View>

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-secBorder">
        <View>
          <Text className="text-2xs font-bold uppercase tracking-[0.8px] text-muted">Your earnings</Text>
          <Text className="text-base-lg font-bold text-success mt-0.5">
            {earnings.toLocaleString("en-US")} AFN
          </Text>
        </View>
        <Ripple
          onPress={onPress}
          accessibilityLabel={`Open manifest for ${trip.code}`}
          className={cn(
            "flex-row items-center gap-1 rounded-full px-3.5 py-2",
            trip.status === "boarding" ? "bg-primary" : "bg-primarySoft",
          )}
        >
          <Text
            className={cn(
              "text-base-lg font-bold",
              trip.status === "boarding" ? "text-onPrimary" : "text-primary",
            )}
          >
            Manifest
          </Text>
          <Icon
            name="chevron-right"
            size={15}
            color={trip.status === "boarding" ? colors.onPrimary : colors.primary}
          />
        </Ripple>
      </View>
    </Card>
  );
}

export function driverEarnings(trip: Trip) {
  return trip.seatsBooked * 300 + 750;
}
