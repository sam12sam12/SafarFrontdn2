import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/utils/cn";
import { Icon, type IconName } from "./Icon";
import { Ripple } from "./Ripple";

export type TabItem = {
  name: string;
  label: string;
  icon: IconName;
  activeIcon?: IconName;
  badge?: number;
};

/** Minimal shape of what Expo Router's Tabs passes to a custom tab bar —
 * typed locally so the app does not depend on a transitive navigation
 * package's type entry points. */
type TabBarState = {
  index: number;
  routes: { key: string; name: string }[];
};

type TabBarNavigation = {
  emit: (event: {
    type: string;
    target: string;
    canPreventDefault: boolean;
  }) => { defaultPrevented?: boolean };
  navigate: (name: string) => void;
};

type Props = {
  state: TabBarState;
  /** Older expo-router tab bars pass navigation; SDK 58's js-tabs passes
   * navigateToTab instead, so both are accepted. */
  navigation?: TabBarNavigation;
  navigateToTab?: (routeKey: string) => void;
  items: TabItem[];
};

export function AppTabBar({ state, navigation, navigateToTab, items }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-card border-t border-border"
      style={{ paddingBottom: Math.max(insets.bottom, 6) }}
    >
      <View className="flex-row items-center pt-2 pb-1">
        {state.routes.map((route, index) => {
          const item = items.find((entry) => entry.name === route.name);
          if (!item) return null;

          const focused = state.index === index;

          return (
            <Ripple
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                if (navigation) {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                  return;
                }
                if (!focused) navigateToTab?.(route.key);
              }}
              className="flex-1 items-center gap-1 py-1"
            >
              <View className="relative">
                <Icon
                  name={focused && item.activeIcon ? item.activeIcon : item.icon}
                  size={22}
                  color={focused ? "#1D4ED8" : "#94A3B8"}
                />
                {item.badge ? (
                  <View className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-warning items-center justify-center">
                    <Text className="text-2xs font-bold text-onPrimary">{item.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text
                className={cn(
                  "text-xs font-semibold",
                  focused ? "text-primary" : "text-muted",
                )}
              >
                {item.label}
              </Text>
            </Ripple>
          );
        })}
      </View>
    </View>
  );
}
