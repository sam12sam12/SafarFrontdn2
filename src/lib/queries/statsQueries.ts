import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db, respond, wait } from "@/lib/db";
import type { DriverStats, OwnerStats } from "@/lib/db/types";
import { initialsOf } from "@/lib/format";
import { queryKeys } from "./queryKeys";

export type StatsRange = "week" | "month" | "year";

/** The mock analytics table is authored for a month. Week/year views scale
 * it so the segmented control is genuinely interactive — clearly a
 * placeholder until the backend aggregates real periods. */
const RANGE_SCALE: Record<StatsRange, number> = {
  week: 0.25,
  month: 1,
  year: 12,
};

const RANGE_LABEL: Record<StatsRange, string> = {
  week: "this week",
  month: "November",
  year: "2026",
};

const scale = (value: number, factor: number) => Math.round(value * factor);

export function useOwnerStats(range: StatsRange = "month") {
  return useQuery({
    queryKey: queryKeys.stats.owner(range),
    queryFn: async (): Promise<OwnerStats> => {
      const factor = RANGE_SCALE[range];
      const seed = db.ownerStats;
      return respond({
        ...seed,
        monthLabel: `Revenue · ${RANGE_LABEL[range]}`,
        revenue: scale(seed.revenue, factor),
        driverPay: scale(seed.driverPay, factor),
        trips: scale(seed.trips, factor),
        seatsSold: scale(seed.seatsSold, factor),
        seatsCapacity: scale(seed.seatsCapacity, factor),
        cancelled: scale(seed.cancelled, factor),
        weekly: seed.weekly.map((point) => ({
          ...point,
          value: scale(point.value, factor),
        })),
      });
    },
  });
}

export function useDriverStats(range: StatsRange = "month") {
  return useQuery({
    queryKey: queryKeys.stats.driver(range),
    queryFn: async (): Promise<DriverStats> => {
      const factor = RANGE_SCALE[range];
      const seed = db.driverStats;
      return respond({
        ...seed,
        monthLabel: `Earned · ${RANGE_LABEL[range]}`,
        earned: scale(seed.earned, factor),
        trips: scale(seed.trips, factor),
        passengers: scale(seed.passengers, factor),
        km: scale(seed.km, factor),
        hours: scale(seed.hours, factor),
        weekly: seed.weekly.map((point) => ({
          ...point,
          value: scale(point.value, factor),
        })),
      });
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => respond(db.profile),
  });
}

export type UpdateProfileInput = { name: string; phone: string; email: string };

/** Renames the signed-in passenger. Bookings are scoped by passenger name in
 * the mock DB, so existing rows are renamed with the profile to keep them. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      await wait(420);
      const previous = db.profile.name;
      const name = input.name.trim();
      db.profile.name = name;
      db.profile.phone = input.phone.trim();
      db.profile.email = input.email.trim();
      db.profile.initials = initialsOf(name);
      db.bookings.forEach((booking) => {
        if (booking.passengerName === previous) booking.passengerName = name;
      });
      return { ...db.profile };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
