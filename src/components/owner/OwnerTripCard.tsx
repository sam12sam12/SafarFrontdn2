import { Text, View } from "react-native";

import type { Driver, Trip } from "@/lib/db/types";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { SeatProgress } from "../ui/Progress";
import { Ripple } from "../ui/Ripple";
import { colors } from "@/utils/theme";

type Props = {
  trip: Trip;
  driver?: Driver;
  onPress: () => void;
};

const TONE = {
  "on-road": "green",
  boarding: "blue",
  scheduled: "slate",
  full: "violet",
  "needs-driver": "amber",
  completed: "slate",
} as const;

const LABEL = {
  "on-road": "On road",
  boarding: "Boarding",
  scheduled: "Scheduled",
  full: "Full",
  "needs-driver": "Needs driver",
  completed: "Completed",
} as const;

export function OwnerTripCard({ trip, driver, onPress }: Props) {
  const revenue = trip.seatsBooked * trip.price;

  return (
    <Ripple onPress={onPress} accessibilityLabel={`Manage ${trip.code}`} className="rounded-lg">
      <Card className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-xl font-bold text-text">{trip.departTime}</Text>
            <Text className="text-sm font-semibold text-secText">{trip.departPeriod}</Text>
            <Icon name="arrow-forward" size={13} color={colors.muted} />
            <Text className="text-base-lg font-semibold text-secText">
              {trip.arriveTime} {trip.arrivePeriod}
            </Text>
          </View>
          <Badge label={LABEL[trip.status]} tone={TONE[trip.status]} compact />
        </View>

        <View className="flex-row items-center gap-1.5">
          <Text className="text-base-lg font-bold text-text">{trip.from}</Text>
          <Icon name="trending-flat" size={16} color={colors.primary} />
          <Text className="text-base-lg font-bold text-text">{trip.to}</Text>
          <Text className="text-sm text-secText">· {trip.code}</Text>
          <Badge
            label={trip.service === "vip" ? "VIP" : "Shared"}
            tone={trip.service === "vip" ? "teal" : "blue"}
            compact
          />
        </View>

        <View className="flex-row items-center gap-2">
          <SeatProgress total={trip.seatsTotal} filled={trip.seatsBooked} className="flex-1" />
          <Text className="text-sm font-semibold text-secText">
            {trip.seatsBooked}/{trip.seatsTotal}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-2 border-t border-secBorder">
          <View className="flex-row items-center gap-2 flex-1">
            <View className="w-7 h-7 rounded-full bg-primarySoft items-center justify-center">
              <Icon name={driver ? "person" : "person-add"} size={14} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-text" numberOfLines={1}>
                {driver?.name ?? "Unassigned"}
              </Text>
              <Text className="text-2xs text-secText">{trip.vehiclePlate}</Text>
            </View>
          </View>
          <Text className="text-base-lg font-bold text-text">
            {revenue.toLocaleString("en-US")} <Text className="text-sm text-secText">AFN</Text>
          </Text>
          <Icon name="chevron-right" size={18} color={colors.muted} />
        </View>
      </Card>
    </Ripple>
  );
}
