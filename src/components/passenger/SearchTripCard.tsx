import type { Driver, Trip } from "@/lib/db/types";

import { TripCard } from "../trip/TripCard";

type Props = {
  trip: Trip;
  driver?: Driver;
  seatsAvailable: number;
  onOpen: () => void;
  onSelect: () => void;
};

/** Passenger search result — the shared trip card with seat selection. */
export function SearchTripCard({ trip, driver, seatsAvailable, onOpen, onSelect }: Props) {
  return (
    <TripCard
      trip={trip}
      driver={driver}
      variant="passenger"
      seatsAvailable={seatsAvailable}
      onPress={onOpen}
      onAction={onSelect}
    />
  );
}
