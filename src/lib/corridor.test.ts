import { describe, expect, test } from "bun:test";

import { corridorCities, corridorStops } from "./corridor";

const timetable = (stops: ReturnType<typeof corridorStops>) =>
  stops.map((stop) => `${stop.time} ${stop.period}`);

describe("corridor direction", () => {
  test("walks Kandahar → Kabul in order", () => {
    expect(corridorCities("Kandahar", "Kabul")).toEqual([
      "Kandahar",
      "Qalat",
      "Ghazni",
      "Kabul",
    ]);
  });

  test("reverses the stops for Kabul → Kandahar", () => {
    expect(corridorCities("Kabul", "Kandahar")).toEqual([
      "Kabul",
      "Ghazni",
      "Qalat",
      "Kandahar",
    ]);
  });
});

describe("corridor times", () => {
  test("places checkpoints a third and two thirds along the drive", () => {
    const stops = corridorStops({
      from: "Kandahar",
      to: "Kabul",
      departTime: "06:30",
      departPeriod: "AM",
      arriveTime: "01:15",
      arrivePeriod: "PM",
    });

    expect(timetable(stops)).toEqual(["06:30 AM", "08:45 AM", "11:00 AM", "01:15 PM"]);
  });

  test("keeps the same offsets on the return leg", () => {
    const stops = corridorStops({
      from: "Kabul",
      to: "Kandahar",
      departTime: "07:00",
      departPeriod: "AM",
      arriveTime: "01:45",
      arrivePeriod: "PM",
    });

    expect(stops.map((stop) => stop.city)).toEqual([
      "Kabul",
      "Ghazni",
      "Qalat",
      "Kandahar",
    ]);
    expect(timetable(stops)).toEqual(["07:00 AM", "09:15 AM", "11:30 AM", "01:45 PM"]);
  });
});
