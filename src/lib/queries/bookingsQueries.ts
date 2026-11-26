import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db, findTrip, nextBookingCode, respond, wait } from "@/lib/db";
import type { Booking, PaymentMethod } from "@/lib/db/types";
import { DEMO_NOW } from "@/lib/dates";
import { initialsOf } from "@/lib/format";
import { queryKeys } from "./queryKeys";

async function fetchBookings(scope: "passenger" | "owner"): Promise<Booking[]> {
  const items =
    scope === "passenger"
      ? db.bookings.filter((booking) => booking.passengerName === db.profile.name)
      : [...db.bookings];
  return respond(items);
}

export function useBookings(scope: "passenger" | "owner") {
  return useQuery({
    queryKey: queryKeys.bookings.list(scope),
    queryFn: () => fetchBookings(scope),
    placeholderData: (previous) => previous,
  });
}

export function useBooking(bookingId?: string) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(bookingId ?? "none"),
    queryFn: () =>
      respond(db.bookings.find((booking) => booking.id === bookingId) ?? null),
    enabled: Boolean(bookingId),
  });
}

export type CreateBookingInput = {
  tripId: string;
  seats: string[];
  name: string;
  phone: string;
  payment: PaymentMethod;
  luggage?: string;
  note?: string;
};

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      await wait(650);
      const trip = findTrip(input.tripId);
      if (!trip) throw new Error("Trip not found");

      const seats = input.seats.map((id) => {
        const legroom = trip.service === "shared" && id === "01";
        return trip.service === "vip" ? trip.price : trip.price + (legroom ? 150 : 0);
      });
      const amount = seats.reduce((total, price) => total + price, 0);
      const paid = input.payment === "hesabpay";

      const booking: Booking = {
        id: `b-${Date.now()}`,
        code: nextBookingCode(),
        tripId: trip.id,
        passengerName: input.name,
        initials: initialsOf(input.name),
        phone: input.phone,
        seats: input.seats,
        people: input.seats.length,
        luggage: input.luggage,
        note: input.note,
        amount,
        payment: input.payment,
        paymentStatus: paid ? "paid" : "unpaid",
        status: "new",
        // demo clock never runs ahead of the seeded "now"
        createdAt: new Date(Math.min(Date.now(), Date.parse(DEMO_NOW))).toISOString(),
        reference: paid
          ? `HP-${Math.floor(10000000 + Math.random() * 89999999)}`
          : undefined,
      };

      db.bookings.unshift(booking);
      trip.seatsBooked = Math.min(trip.seatsBooked + input.seats.length, trip.seatsTotal);
      if (trip.seatsBooked >= trip.seatsTotal && trip.status === "scheduled") {
        trip.status = "full";
      }
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
    },
  });
}

export function useAcceptBooking() {  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      await wait(450);
      const booking = db.bookings.find((item) => item.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      booking.status = "confirmed";
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useDeclineBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      await wait(450);
      const booking = db.bookings.find((item) => item.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      booking.status = "cancelled";
      const trip = findTrip(booking.tripId);
      if (trip) {
        trip.seatsBooked = Math.max(0, trip.seatsBooked - booking.seats.length);
        if (trip.status === "full") trip.status = "scheduled";
      }
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
    },
  });
}

/**
 * Passenger-initiated cancellation. The seat goes straight back on sale and a
 * paid booking keeps its payment status, which is what the cancelled card reads
 * as its refund state.
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      await wait(450);
      const booking = db.bookings.find((item) => item.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      if (booking.status === "cancelled") throw new Error("Booking already cancelled");

      booking.status = "cancelled";
      booking.cancelledAt = new Date(
        Math.min(Date.now(), Date.parse(DEMO_NOW)),
      ).toISOString();

      const trip = findTrip(booking.tripId);
      if (trip) {
        trip.seatsBooked = Math.max(0, trip.seatsBooked - booking.seats.length);
        if (trip.status === "full") trip.status = "scheduled";
      }
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
    },
  });
}

export type RateBookingInput = { bookingId: string; rating: number; review?: string };

/** Saves the passenger's post-trip rating and appends it to the driver's
 * review list so the profile shows the new feedback immediately. */
export function useRateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, rating, review }: RateBookingInput) => {
      await wait(450);
      const booking = db.bookings.find((item) => item.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      booking.rating = rating;
      booking.review = review?.trim() || undefined;

      const trip = findTrip(booking.tripId);
      const driver = trip ? db.drivers.find((item) => item.id === trip.driverId) : undefined;
      if (trip && driver && booking.review) {
        const entry = {
          author: booking.passengerName,
          initials: booking.initials,
          rating,
          text: booking.review,
          route: `${trip.from} → ${trip.to}`,
          ago: "Just now",
        };
        driver.reviews = [entry, ...(driver.reviews ?? [])];
        driver.review = entry;
      }
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all });
    },
  });
}
