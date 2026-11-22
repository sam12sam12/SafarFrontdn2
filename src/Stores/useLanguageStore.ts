import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { I18nManager, Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import i18n from "@/utils/i18n";

export type AppLanguage = "en" | "ps" | "fa";

type LanguageState = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

const isRTLLang = (language: AppLanguage) => language === "ps" || language === "fa";

/**
 * Apply the native layout direction for a language. Returns true when the
 * direction actually flipped — the caller then reloads so React Native lays the
 * whole tree out in the new direction (the Bazar56 pattern).
 */
function applyDirection(language: AppLanguage): boolean {
  if (Platform.OS === "web") return false;
  const rtl = isRTLLang(language);
  if (I18nManager.isRTL === rtl) return false;
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  return true;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
        // English ⇄ Pashto/Dari flips direction → reload so native RTL fully
        // applies (arrows, insets, text alignment) like a fresh launch.
        if (applyDirection(language)) {
          Updates.reloadAsync().catch(() => {
            // Expo Go / web can't reload natively — the uniwind layer still
            // flips the layout, so this is a graceful no-op there.
          });
        }
      },
    }),
    {
      name: "express-highway-language",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        const language = state?.language ?? "en";
        i18n.changeLanguage(language);
        // Keep the native flag in sync on cold start without reloading.
        if (Platform.OS !== "web") {
          const rtl = isRTLLang(language);
          if (I18nManager.isRTL !== rtl) {
            I18nManager.allowRTL(rtl);
            I18nManager.forceRTL(rtl);
          }
        }
      },
    },
  ),
);
