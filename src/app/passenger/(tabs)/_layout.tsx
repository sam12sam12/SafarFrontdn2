import { Tabs } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AppTabBar, type TabItem } from "@/components/ui/AppTabBar";

export default function PassengerTabsLayout() {
  const { t } = useTranslation();

  const tabs = useMemo<TabItem[]>(
    () => [
      { name: "index", label: t("tabs.home"), icon: "home", activeIcon: "home" },
      {
        name: "bookings",
        label: t("tabs.bookings"),
        icon: "confirmation-number",
        activeIcon: "confirmation-number",
      },
      {
        name: "support",
        label: t("tabs.support"),
        icon: "support-agent",
        activeIcon: "support-agent",
      },
      { name: "profile", label: t("tabs.profile"), icon: "person-outline", activeIcon: "person" },
    ],
    [t],
  );

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: "#F5F8FD" } }}
      tabBar={(props) => <AppTabBar {...props} items={tabs} />}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="bookings" options={{ title: t("tabs.bookings") }} />
      <Tabs.Screen name="support" options={{ title: t("tabs.support") }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile") }} />
    </Tabs>
  );
}
