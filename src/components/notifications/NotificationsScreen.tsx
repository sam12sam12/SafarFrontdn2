import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { Section as PageSection } from "@/components/ui/Section";
import { showToast } from "@/components/ui/Toast";
import {
  useMarkAllRead,
  useMarkRead,
  useNotifications,
} from "@/lib/queries/notificationsQueries";
import type { AppNotification, NotificationRole, NotificationTone } from "@/lib/db/types";
import { formatRelativeDateTime, isToday } from "@/lib/dates";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const TONE: Record<NotificationTone, { bg: string; color: string }> = {
  primary: { bg: "bg-primarySoft", color: colors.primary },
  success: { bg: "bg-successSoft", color: colors.success },
  warning: { bg: "bg-warningSoft", color: colors.warning },
  error: { bg: "bg-errorSoft", color: colors.error },
  slate: { bg: "bg-disable", color: colors.secText },
};

export function NotificationsScreen({ role }: { role: NotificationRole }) {
  const { t, i18n } = useTranslation();
  const query = useNotifications(role);
  const markAll = useMarkAllRead(role);
  const markRead = useMarkRead(role);

  const items = useMemo(() => query.data ?? [], [query.data]);
  const unread = items.filter((item) => !item.read).length;

  const { today, earlier } = useMemo(() => {
    return {
      today: items.filter((item) => isToday(item.at.slice(0, 10))),
      earlier: items.filter((item) => !isToday(item.at.slice(0, 10))),
    };
  }, [items]);

  const header = (
    <AppHeader
      title={t("notifications.title")}
      subtitle={unread > 0 ? t("notifications.unread", { count: unread }) : undefined}
      right={
        unread > 0 ? (
          <Ripple
            onPress={() => {
              markAll.mutate();
              showToast("success", t("notifications.allReadToast"), t("notifications.allReadToastBody"));
            }}
            accessibilityLabel={t("notifications.markAllRead")}
            className="flex-row items-center gap-1.5 rounded-full bg-primarySoft px-3 py-1.5"
          >
            <Icon name="done-all" size={14} color={colors.primary} />
            <Text className="text-sm font-bold text-primary">{t("notifications.markAllRead")}</Text>
          </Ripple>
        ) : null
      }
    />
  );

  return (
    <Screen
      contentClassName="pb-8"
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    >
      {header}

      {items.length === 0 ? (
        <View className="px-4 pt-6">
          <EmptyState
            icon="notifications-none"
            title={t("notifications.emptyTitle")}
            message={t("notifications.emptyMessage")}
          />
        </View>
      ) : (
        <View className="px-4">
          {today.length > 0 ? (
            <Section title={t("notifications.today")} items={today} lng={i18n.language} onPress={(id) => markRead.mutate(id)} />
          ) : null}
          {earlier.length > 0 ? (
            <Section title={t("notifications.earlier")} items={earlier} lng={i18n.language} onPress={(id) => markRead.mutate(id)} />
          ) : null}
        </View>
      )}
    </Screen>
  );
}

function Section({
  title,
  items,
  lng,
  onPress,
}: {
  title: string;
  items: AppNotification[];
  lng: string;
  onPress: (id: string) => void;
}) {
  return (
    <PageSection title={title}>
      {items.map((item) => (
        <NotificationRow key={item.id} item={item} lng={lng} onPress={() => onPress(item.id)} />
      ))}
    </PageSection>
  );
}

function NotificationRow({
  item,
  lng,
  onPress,
}: {
  item: AppNotification;
  lng: string;
  onPress: () => void;
}) {
  const tone = TONE[item.tone];
  return (
    <Ripple onPress={onPress} accessibilityLabel={item.title}>
      <Card className={cn("flex-row gap-3 p-3.5", !item.read && "border-primaryBorder bg-primarySoft/30")}>
        <View className={cn("w-11 h-11 rounded-full items-center justify-center", tone.bg)}>
          <Icon name={item.icon as IconName} size={20} color={tone.color} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-base-lg font-bold text-text flex-1" numberOfLines={1}>
              {item.title}
            </Text>
            {!item.read ? <View className="w-2 h-2 rounded-full bg-primary" /> : null}
          </View>
          <Text className="text-sm text-secText mt-0.5 leading-5">{item.body}</Text>
          <Text className="text-2xs text-muted mt-1.5">{formatRelativeDateTime(item.at, lng)}</Text>
        </View>
      </Card>
    </Ripple>
  );
}
