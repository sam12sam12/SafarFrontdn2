import { create } from "zustand";

export type AppRole = "passenger" | "driver" | "owner";

type SessionState = {
  role: AppRole;
  setRole: (role: AppRole) => void;
};

/** Which portal the demo is currently showing. A real build would derive
 * this from the signed-in account; here it is an explicit switcher so all
 * three Figma apps are reachable without a backend. */
export const useSessionStore = create<SessionState>((set) => ({
  role: "passenger",
  setRole: (role) => set({ role }),
}));
