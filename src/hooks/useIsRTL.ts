import { I18nManager } from "react-native";

/**
 * Pashto/Dari force native RTL and a language switch reloads the whole app
 * (see `useLanguageStore`), so the layout direction never changes mid-session —
 * this is a single shared read of the native flag, not a reactive hook.
 */
export function useIsRTL() {
  return I18nManager.isRTL;
}
