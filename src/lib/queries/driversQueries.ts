import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db, respond, wait } from "@/lib/db";
import type { City, Driver, DriverStatus } from "@/lib/db/types";
import { initialsOf } from "@/lib/format";
import { queryKeys } from "./queryKeys";

async function fetchDrivers(status?: DriverStatus | "all"): Promise<Driver[]> {
  const items =
    !status || status === "all"
      ? db.drivers
      : db.drivers.filter((driver) => driver.status === status);
  return respond([...items]);
}

export function useDrivers(status?: DriverStatus | "all") {
  return useQuery({
    queryKey: queryKeys.drivers.list(status),
    queryFn: () => fetchDrivers(status),
  });
}

export function useDriver(driverId?: string) {
  return useQuery({
    queryKey: queryKeys.drivers.detail(driverId ?? "none"),
    queryFn: () => respond(db.drivers.find((driver) => driver.id === driverId) ?? null),
    enabled: Boolean(driverId),
  });
}

export type AddDriverInput = {
  name: string;
  phone: string;
  base: City;
  payPerTrip: number;
  fatherName?: string;
  tazkiraNo?: string;
  licenceNo?: string;
  licenceExpiry?: string;
  permitExpiry?: string;
  nameRelation?: string;
  photoUri?: string;
};

export function useAddDriver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddDriverInput) => {
      await wait(600);
      const driver: Driver = {
        id: `d-${Date.now()}`,
        name: input.name,
        initials: initialsOf(input.name),
        rating: 4.8,
        tripsThisMonth: 0,
        totalTrips: 0,
        base: input.base,
        status: "free",
        statusNote: `At ${input.base} base · just added`,
        phone: input.phone,
        vehicleModel: "Toyota Fielder 2018",
        plate: "—",
        joinedLabel: "New",
        homeTerminal: input.base === "Kabul" ? "Kabul — Company Chowk" : "Kandahar (Eidgah Gate)",
        emergencyContact: "—",
        fatherName: input.fatherName,
        tazkiraNo: input.tazkiraNo,
        licenceNo: input.licenceNo,
        licenceValid: input.licenceExpiry,
        permitExpiry: input.permitExpiry,
        nameRelation: input.nameRelation,
        photo: input.photoUri ? { uri: input.photoUri } : undefined,
      };
      db.drivers.unshift(driver);
      return driver;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.owner("month") });
    },
  });
}
