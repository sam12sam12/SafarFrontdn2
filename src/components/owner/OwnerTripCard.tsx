import type { Driver, Trip } from "@/lib/db/types";

import { TripCard } from "../trip/TripCard";

type Props = {
  trip: Trip;
  driver?: Driver;
  onPress: () => void;
  onAssign?: () => void;
};

/** Dashboard trip row — no seat picker, driver and money instead. */
export function OwnerTripCard({ trip, driver, onPress, onAssign }: Props) {
  return (
    <TripCard
      trip={trip}
      driver={driver}
      variant="owner"
      onPress={onPress}
      onAction={onPress}
      onAssign={onAssign}
    />
  );
}
