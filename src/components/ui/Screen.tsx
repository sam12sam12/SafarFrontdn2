import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";

import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  scroll?: boolean;
  topInset?: boolean;
  /** light background screens (hero/onboarding) can opt out */
  background?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Pinned above the scroll view (trip action bars) instead of scrolling. */
  footer?: ReactNode;
};

export function Screen({
  children,
  className,
  contentClassName,
  scroll = true,
  topInset = true,
  background = "bg-mainBack",
  refreshing,
  onRefresh,
  footer,
}: Props) {
  const insets = useSafeAreaInsets();
  const [primary, card] = useCSSVariable(["--color-primary", "--color-card"]) as string[];

  return (
    <View
      className={cn("flex-1", background, className)}
      style={topInset ? { paddingTop: insets.top } : undefined}
    >
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName={cn("pb-28", contentClassName)}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={Boolean(refreshing)}
                onRefresh={onRefresh}
                tintColor={primary}
                colors={[primary]}
                progressBackgroundColor={card}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cn("flex-1", contentClassName)}>{children}</View>
      )}
      {footer}
    </View>
  );
}
