import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nManager, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LayoutDirection, useCSSVariable } from "uniwind";

import { GlobalLoadingModal } from "@/components/ui/GlobalLoadingModal";
import { Toast } from "@/components/ui/Toast";
import { queryClient } from "@/lib/queries/queryClient";
import { useLanguageStore } from "@/Stores/useLanguageStore";
import { useThemeStore } from "@/Stores/useThemeStore";

import "../global.css";
import "../utils/i18n";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <AppShell />
          </SafeAreaProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

function AppShell() {
  const theme = useThemeStore((state) => state.theme);
  const language = useLanguageStore((state) => state.language);
  // Native direction is driven by I18nManager (set + reloaded on language
  // change); web has no native RTL so it falls back to the language value.
  const isRTL = Platform.OS === "web" ? language === "ps" || language === "fa" : I18nManager.isRTL;
  const [background] = useCSSVariable(["--color-mainBack"]) as string[];

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [isRTL, language]);

  return (
    <LayoutDirection rtl={isRTL}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <View className="flex-1 bg-mainBack" style={{ backgroundColor: background }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 180,
            contentStyle: { backgroundColor: background || "#F5F8FD" },
          }}
        />
        <Toast />
        <GlobalLoadingModal />
      </View>
    </LayoutDirection>
  );
}
