import { Tabs } from "expo-router/js-tabs";

import { AppTabBar, type TabItem } from "@/components/ui/AppTabBar";
import { colors } from "@/utils/theme";

const TABS: TabItem[] = [
  { name: "index", label: "Trips", icon: "local-taxi", activeIcon: "local-taxi" },
  { name: "bookings", label: "Bookings", icon: "confirmation-number", activeIcon: "confirmation-number", badge: 9 },
  { name: "drivers", label: "Drivers", icon: "people-outline", activeIcon: "people" },
  { name: "stats", label: "Stats", icon: "insert-chart-outlined", activeIcon: "insert-chart" },
];

export default function OwnerTabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.mainBack } }}
      tabBar={(props) => <AppTabBar {...props} items={TABS} />}
    >
      <Tabs.Screen name="index" options={{ title: "Trips" }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings" }} />
      <Tabs.Screen name="drivers" options={{ title: "Drivers" }} />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
    </Tabs>
  );
}
