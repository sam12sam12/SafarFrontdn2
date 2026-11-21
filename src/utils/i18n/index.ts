import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fa from "./locales/fa.json";
import ps from "./locales/ps.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ps: { translation: ps },
    fa: { translation: fa },
  },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "ps", "fa"],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  returnNull: false,
  returnEmptyString: false,
});

export default i18n;
