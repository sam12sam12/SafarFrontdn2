import {
  passengerProfile,
  seedBookings,
  seedDriverStats,
  seedDrivers,
  seedNotifications,
  seedOwnerStats,
  seedTrips,
} from "./seed";
import type {
  AppNotification,
  Booking,
  Driver,
  DriverStats,
  OwnerStats,
  PassengerProfile,
  Seat,
  Trip,
} from "./types";

/**
 * The mock database. Everything the app reads or writes goes through here
 * while there is no backend — the query hooks in `src/lib/queries` are the
 * only consumers, so swapping this module for real API calls later is a
 * contained change.
 */
export const db: {
  trips: Trip[];
  drivers: Driver[];
  bookings: Booking[];
  ownerStats: OwnerStats;
  driverStats: DriverStats;
  profile: PassengerProfile;
  notifications: AppNotification[];
} = {
  trips: seedTrips.map((trip) => ({ ...trip })),
  drivers: seedDrivers.map((driver) => ({ ...driver })),
  bookings: seedBookings.map((booking) => ({ ...booking })),
  ownerStats: { ...seedOwnerStats },
  driverStats: { ...seedDriverStats },
  profile: { ...passengerProfile },
  notifications: seedNotifications.map((item) => ({ ...item })),
};

let bookingSequence = 7785;

export function nextBookingCode() {
  return `BK-${bookingSequence++}`;
}

export function wait(ms = 380) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Simulates a network round trip, returning a copy so callers can never
 * mutate the "server" state by accident. Image sources bundled by Metro are
 * asset objects, which structuredClone rejects, so clone them manually. */
function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        cloneValue(entry),
      ]),
    ) as T;
  }
  return value;
}

export async function respond<T>(value: T, ms = 380): Promise<T> {
  await wait(ms);
  return cloneValue(value);
}

export function findTrip(tripId: string) {
  return db.trips.find((trip) => trip.id === tripId);
}

export function findDriver(driverId?: string) {
  return db.drivers.find((driver) => driver.id === driverId);
}

/** Seats are derived from live bookings so a new booking shows up in the
 * seat map immediately — no duplicated seat state to keep in sync. */
export function getSeats(tripId: string): Seat[] {
  const trip = findTrip(tripId);
  if (!trip) return [];

  const seats: Seat[] = [];
  for (let index = 1; index <= trip.seatsTotal; index += 1) {
    const id = String(index).padStart(2, "0");
    const legroom = trip.service === "shared" && id === "01";
    const price = trip.service === "vip" ? trip.price : trip.price + (legroom ? 150 : 0);
    const booking = db.bookings.find(
      (item) =>
        item.tripId === tripId &&
        (item.status === "confirmed" || item.status === "new") &&
        item.seats.includes(id),
    );

    if (!booking) {
      seats.push({ id, status: "available", price, legroom });
      continue;
    }

    seats.push({
      id,
      status: booking.paymentStatus === "paid" ? "paid" : "due",
      occupant: booking.passengerName,
      price: Math.round(booking.amount / Math.max(booking.seats.length, 1)),
      legroom,
      note: booking.paymentStatus === "unpaid" ? "Confirmed · unpaid" : undefined,
    });
  }

  // The Figma manifest marks the last free seat as a walk-in candidate.
  if (tripId === "t-2411") {
    const last = seats[seats.length - 1];
    if (last && last.status === "available") {
      last.status = "walk-in";
      last.occupant = "Walk-in";
      last.note = "Walk-in";
    }
  }

  return seats;
}

export function seatAvailability(tripId: string) {
  const trip = findTrip(tripId);
  if (!trip) return 0;
  return Math.max(trip.seatsTotal - trip.seatsBooked, 0);
}
