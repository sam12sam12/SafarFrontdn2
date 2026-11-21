import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager, Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import i18n from "@/utils/i18n";

export type AppLanguage = "en" | "ps" | "fa";

type LanguageState = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
};

function applyLanguage(language: AppLanguage) {
  i18n.changeLanguage(language);
  if (Platform.OS !== "web") {
    const rtl = language === "ps" || language === "fa";
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(rtl);
  }
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => {
        applyLanguage(language);
        set({ language });
      },
    }),
    {
      name: "express-highway-language",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        applyLanguage(state?.language ?? "en");
      },
    },
  ),
);
