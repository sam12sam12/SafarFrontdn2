import type { BookingStatus, City, ServiceType, TripStatus } from "@/lib/db/types";

export type TripFilter = {
  from?: City;
  to?: City;
  service?: ServiceType;
  date?: string;
  status?: TripStatus[];
};

export const queryKeys = {
  trips: {
    all: ["trips"] as const,
    list: (filter?: TripFilter) => ["trips", "list", filter ?? {}] as const,
    detail: (tripId: string) => ["trips", "detail", tripId] as const,
    seats: (tripId: string) => ["trips", "seats", tripId] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (scope: "passenger" | "owner", status?: BookingStatus | "all") =>
      ["bookings", "list", scope, status ?? "all"] as const,
    detail: (bookingId: string) => ["bookings", "detail", bookingId] as const,
  },
  drivers: {
    all: ["drivers"] as const,
    list: (status?: string) => ["drivers", "list", status ?? "all"] as const,
    detail: (driverId: string) => ["drivers", "detail", driverId] as const,
  },
  stats: {
    owner: (range: string) => ["stats", "owner", range] as const,
    driver: (range: string) => ["stats", "driver", range] as const,
  },
  profile: ["profile"] as const,
  savedPassengers: ["passengers", "saved"] as const,
  defaultPayment: ["payment", "default"] as const,
  notifications: {
    all: ["notifications"] as const,
    list: (role: string) => ["notifications", "list", role] as const,
  },
  support: {
    all: ["support"] as const,
    list: () => ["support", "list"] as const,
    detail: (conversationId: string) => ["support", "detail", conversationId] as const,
  },
};
