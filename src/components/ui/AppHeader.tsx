import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { IconButton } from "./IconButton";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  className?: string;
};

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
    <View className={cn("flex-row items-center gap-3 px-4 py-3", className)}>
      {showBack && (
        // The Icon component mirrors "arrow-back" automatically under RTL.
        <IconButton
          icon="arrow-back"
          accessibilityLabel="Go back"
          variant="white"
          onPress={onBack ?? (() => router.back())}
        />
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
