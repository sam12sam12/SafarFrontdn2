import {
  passengerProfile,
  seedBookings,
  seedDriverStats,
  seedDrivers,
  seedNotifications,
  seedOwnerStats,
  seedSupportConversations,
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
  SupportConversation,
  SupportMessage,
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
  supportConversations: SupportConversation[];
} = {
  trips: seedTrips.map((trip) => ({ ...trip })),
  drivers: seedDrivers.map((driver) => ({ ...driver })),
  bookings: seedBookings.map((booking) => ({ ...booking })),
  ownerStats: { ...seedOwnerStats },
  driverStats: { ...seedDriverStats },
  profile: { ...passengerProfile },
  notifications: seedNotifications.map((item) => ({ ...item })),
  supportConversations: seedSupportConversations.map((thread) => ({
    ...thread,
    messages: thread.messages.map((message) => ({ ...message })),
  })),
};

let bookingSequence = 7785;

export function nextBookingCode() {
  return `BK-${bookingSequence++}`;
}

let supportSequence = 3;

/** The assistant's canned opener — stands in for a future AI/agent reply. */
const SUPPORT_GREETING =
  "Hello! Thanks for contacting Express Highway support 🙂 One of our agents will reply shortly. In the meantime, you can browse your bookings or check highway conditions in the app.";

function makeMessage(sender: SupportMessage["sender"], text: string): SupportMessage {
  return {
    id: `sm-${Math.random().toString(36).slice(2, 10)}`,
    sender,
    text,
    at: new Date().toISOString(),
  };
}

/** Starts a new thread from the user's first question, with the assistant's
 * greeting appended as the simulated first reply. Returns the new thread. */
export function startSupportConversation(topic: string): SupportConversation {
  const question = topic.trim();
  const userMessage = makeMessage("user", question);
  const conversation: SupportConversation = {
    id: `sc-${supportSequence++}`,
    topic: question,
    handledBy: "assistant",
    updatedAt: userMessage.at,
    messages: [userMessage, makeMessage("assistant", SUPPORT_GREETING)],
  };
  conversation.updatedAt = conversation.messages[conversation.messages.length - 1].at;
  db.supportConversations.unshift(conversation);
  return conversation;
}

/** Appends the user's message to an existing thread plus the assistant's
 * acknowledgement, keeping `updatedAt` in sync with the latest message. */
export function appendSupportMessage(conversationId: string, text: string) {
  const conversation = db.supportConversations.find((thread) => thread.id === conversationId);
  if (!conversation) return undefined;
  conversation.messages.push(makeMessage("user", text.trim()));
  const reply = makeMessage("assistant", SUPPORT_GREETING);
  conversation.messages.push(reply);
  conversation.updatedAt = reply.at;
  return conversation;
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
