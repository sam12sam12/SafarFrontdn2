import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind } from "uniwind";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AppTheme = "light" | "dark";

type ThemeState = {
  theme: AppTheme;
  hydrated: boolean;
  setTheme: (theme: AppTheme) => void;
};

/** The app never follows the system scheme by itself: the user picks a
 * theme on first run (light is the default) and it is persisted. */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      hydrated: false,
      setTheme: (theme) => {
        Uniwind.setTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "express-highway-theme",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        const theme = state?.theme ?? "light";
        Uniwind.setTheme(theme);
        useThemeStore.setState({ hydrated: true });
      },
    },
  ),
);
