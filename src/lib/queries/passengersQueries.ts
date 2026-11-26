import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db, respond, wait } from "@/lib/db";
import type { PaymentMethod, SavedPassengerRelation } from "@/lib/db/types";
import { queryKeys } from "./queryKeys";

export function useSavedPassengers() {
  return useQuery({
    queryKey: queryKeys.savedPassengers,
    queryFn: () => respond(db.savedPassengers),
  });
}

export type AddSavedPassengerInput = {
  name: string;
  phone: string;
  relation: SavedPassengerRelation;
};

export function useAddSavedPassenger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddSavedPassengerInput) => {
      await wait(380);
      const passenger = {
        id: `sp-${Date.now()}`,
        name: input.name.trim(),
        phone: input.phone.trim(),
        relation: input.relation,
      };
      db.savedPassengers.unshift(passenger);
      db.profile.savedPassengers = db.savedPassengers.length;
      return passenger;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedPassengers });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useRemoveSavedPassenger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passengerId: string) => {
      await wait(320);
      db.savedPassengers = db.savedPassengers.filter((item) => item.id !== passengerId);
      db.profile.savedPassengers = db.savedPassengers.length;
      return passengerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.savedPassengers });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useDefaultPaymentMethod() {
  return useQuery({
    queryKey: queryKeys.defaultPayment,
    queryFn: () => respond(db.defaultPayment),
  });
}

export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (method: PaymentMethod) => {
      await wait(320);
      db.defaultPayment = method;
      return method;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.defaultPayment });
    },
  });
}
