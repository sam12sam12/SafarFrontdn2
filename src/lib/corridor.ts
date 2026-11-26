import type { City, Trip } from "@/lib/db/types";
import { to24Hour } from "@/lib/format";

export type CorridorRole = "origin" | "checkpoint" | "rest" | "destination";

/** Ticket endpoints, plus the two Highway 1 towns between them. */
export type CorridorCity = City | "Qalat" | "Ghazni";

export type CorridorStop = {
  city: CorridorCity;
  role: CorridorRole;
  /** 12-hour clock without the period, e.g. "08:45". */
  time: string;
  period: "AM" | "PM";
};

/** Highway 1 (Ring Road) in travel order: Kandahar ⇄ Kabul. */
const CORRIDOR: CorridorCity[] = ["Kandahar", "Qalat", "Ghazni", "Kabul"];

/**
 * Corridor cities in the direction the trip actually travels. Reverse legs are
 * the same stop list walked backwards, so a Kabul → Kandahar trip never shows
 * Qalat after Ghazni.
 */
export function corridorCities(from: City, to: City): CorridorCity[] {
  const ordered = from === "Kabul" ? [...CORRIDOR].reverse() : [...CORRIDOR];
  const aligned = ordered[0] === from && ordered[ordered.length - 1] === to;
  return aligned ? ordered : [from, ordered[1], ordered[2], to];
}

function minutesOf(time: string, period: string) {
  const [hours, minutes] = to24Hour(time, period).split(":").map(Number);
  return hours * 60 + minutes;
}

function toClock(total: number): { time: string; period: "AM" | "PM" } {
  const normalized = ((total % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return {
    time: `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    period,
  };
}

/**
 * The four stops of the leg with times derived from the trip's own departure
 * and arrival. Qalat and Ghazni sit a third and two thirds of the way along the
 * drive, which reproduces the seeded 06:30 → 08:45 → 11:00 → 01:15 timetable
 * and stays correct for every other departure.
 */
export function corridorStops(
  trip: Pick<Trip, "from" | "to" | "departTime" | "departPeriod" | "arriveTime" | "arrivePeriod">,
): CorridorStop[] {
  const cities = corridorCities(trip.from, trip.to);
  const start = minutesOf(trip.departTime, trip.departPeriod);
  let end = minutesOf(trip.arriveTime, trip.arrivePeriod);
  if (end <= start) end += 1440;

  const span = end - start;
  const clocks = [start, start + span / 3, start + (2 * span) / 3, end].map((value) =>
    toClock(Math.round(value)),
  );
  const roles: CorridorRole[] = ["origin", "checkpoint", "rest", "destination"];

  return cities.map((city, index) => ({ city, role: roles[index], ...clocks[index] }));
}
