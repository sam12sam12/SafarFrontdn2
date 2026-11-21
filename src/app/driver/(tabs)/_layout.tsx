import { Tabs } from "expo-router/js-tabs";
import { useTranslation } from "react-i18next";

import { AppTabBar, type TabItem } from "@/components/ui/AppTabBar";
import { colors } from "@/utils/theme";

export default function DriverTabsLayout() {
  const { t } = useTranslation();

  const tabs: TabItem[] = [
    {
      name: "index",
      label: t("driver.nav.trips"),
      icon: "directions-car",
      activeIcon: "directions-car",
    },
    { name: "manifest", label: t("driver.nav.manifest"), icon: "groups", activeIcon: "groups" },
    { name: "stats", label: t("driver.nav.stats"), icon: "bar-chart", activeIcon: "bar-chart" },
    {
      name: "profile",
      label: t("driver.nav.profile"),
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.mainBack } }}
      tabBar={(props) => <AppTabBar {...props} items={tabs} />}
    >
      <Tabs.Screen name="index" options={{ title: t("driver.nav.trips") }} />
      <Tabs.Screen name="manifest" options={{ title: t("driver.nav.manifest") }} />
      <Tabs.Screen name="stats" options={{ title: t("driver.nav.stats") }} />
      <Tabs.Screen name="profile" options={{ title: t("driver.nav.profile") }} />
    </Tabs>
  );
}
