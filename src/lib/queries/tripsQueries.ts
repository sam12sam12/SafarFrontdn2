import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db, findDriver, findTrip, getSeats, respond, wait } from "@/lib/db";
import type { City, Seat, ServiceType, Trip } from "@/lib/db/types";
import { queryKeys, type TripFilter } from "./queryKeys";

async function fetchTrips(filter: TripFilter = {}): Promise<Trip[]> {
  const items = db.trips.filter((trip) => {
    // Drafts stay out of passenger search until the owner publishes them.
    if (!filter.status?.length && trip.status === "draft") return false;
    if (filter.from && trip.from !== filter.from) return false;
    if (filter.to && trip.to !== filter.to) return false;
    if (filter.service && trip.service !== filter.service) return false;
    if (filter.date && trip.date !== filter.date) return false;
    if (filter.status?.length && !filter.status.includes(trip.status)) return false;
    return true;
  });
  return respond(items);
}

export function useTrips(filter?: TripFilter) {
  return useQuery({
    queryKey: queryKeys.trips.list(filter),
    queryFn: () => fetchTrips(filter),
    // Filter/tab changes keep the previous rows on screen instead of
    // flashing a full skeleton on every switch.
    placeholderData: (previous) => previous,
  });
}

export function useTrip(tripId?: string, refetchIntervalMs?: number) {
  return useQuery({
    queryKey: queryKeys.trips.detail(tripId ?? "none"),
    queryFn: () => respond(findTrip(tripId ?? "") ?? null),
    enabled: Boolean(tripId),
    refetchInterval: refetchIntervalMs,
  });
}

export function useSeatMap(tripId?: string) {
  return useQuery({
    queryKey: queryKeys.trips.seats(tripId ?? "none"),
    queryFn: (): Promise<Seat[]> => respond(getSeats(tripId ?? ""), 300),
    enabled: Boolean(tripId),
  });
}

export type ScheduleTripInput = {
  from: City;
  to: City;
  date: string;
  dateLabel: string;
  departTime: string;
  arriveTime: string;
  departPeriod: "AM" | "PM";
  arrivePeriod: "AM" | "PM";
  service: ServiceType;
  price: number;
  driverId?: string;
  boardingPoint: string;
  dropOffPoint: string;
  draft?: boolean;
  note?: string;
  restStop?: boolean;
};

export function useScheduleTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ScheduleTripInput) => {
      await wait();
      const driver = findDriver(input.driverId);
      const trip: Trip = {
        id: `t-${Date.now()}`,
        code: `EH-${2427 + db.trips.filter((item) => item.code.startsWith("EH-24")).length}`,
        from: input.from,
        to: input.to,
        date: input.date,
        dateLabel: input.dateLabel,
        departTime: input.departTime,
        departPeriod: input.departPeriod,
        arriveTime: input.arriveTime,
        arrivePeriod: input.arrivePeriod,
        duration: "6h 45m",
        distanceKm: 483,
        service: input.service,
        price: input.price,
        seatsTotal: 4,
        seatsBooked: 0,
        driverId: input.driverId,
        vehiclePlate: driver?.plate ?? "—",
        status: input.draft ? "draft" : input.driverId ? "scheduled" : "needs-driver",
        boardingPoint: input.boardingPoint,
        dropOffPoint: input.dropOffPoint,
        dispatchNote: input.note,
      };
      db.trips.unshift(trip);
      return trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all });
    },
  });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, driverId }: { tripId: string; driverId: string }) => {
      await wait(450);
      const trip = findTrip(tripId);
      const driver = findDriver(driverId);
      if (!trip || !driver) throw new Error("Trip or driver not found");
      trip.driverId = driverId;
      trip.vehiclePlate = driver.plate;
      if (trip.status === "needs-driver") trip.status = "scheduled";
      driver.status = "trip-today";
      driver.statusNote = `${trip.departTime} ${trip.departPeriod} ${trip.from} → ${trip.to}`;
      return trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all });
    },
  });
}
