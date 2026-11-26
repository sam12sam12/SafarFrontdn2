import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { HeaderIcon } from "./HeaderIcon";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
};

/**
 * The app's single header: a solid `bg-card` bar with a bottom border, a
 * borderless back icon, title/subtitle, and an optional trailing slot. Every
 * screen uses this so the header reads identically across the whole app.
 */
export function AppHeader({
  title,
  subtitle,
  right,
  onBack,
  showBack = true,
  className,
}: Props) {
  const router = useRouter();

  return (
    <View
      className={cn(
        // mb-4 keeps a consistent gap between the header and content on every screen.
        "flex-row items-center gap-2 bg-card border-b border-border px-2.5 py-2.5 mb-4",
        className,
      )}
    >
      {showBack ? (
        // The Icon component mirrors "arrow-back" automatically under RTL.
        <HeaderIcon icon="arrow-back" accessibilityLabel="Go back" onPress={onBack ?? (() => router.back())} />
      ) : (
        <View className="w-1.5" />
      )}
      <View className="flex-1">
        <Text className="text-xl font-bold text-text" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}
