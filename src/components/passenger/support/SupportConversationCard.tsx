import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { formatRelativeDateTime } from "@/lib/dates";
import type { SupportConversation } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type Props = {
  conversation: SupportConversation;
  onPress: () => void;
};

/** A row in the "My conversations" list: topic, last reply preview and when it
 * was last updated, with a sparkle avatar and the handler label underneath. */
export function SupportConversationCard({ conversation, onPress }: Props) {
  const { t, i18n } = useTranslation();
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const handlerLabel = conversation.handledBy === "agent" ? t("support.agent") : t("support.assistant");

  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={conversation.topic}
      className="flex-row items-center gap-3 bg-card border border-border rounded-lg p-3.5 shadow-sm shadow-shadowColor"
    >
      <View className="w-11 h-11 rounded-full bg-primarySoft items-center justify-center">
        <Icon name="auto-awesome" size={20} color={colors.primary} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="flex-1 text-base-lg font-bold text-text" numberOfLines={1}>
            {conversation.topic}
          </Text>
          <Text className="text-2xs text-muted">
            {formatRelativeDateTime(conversation.updatedAt, i18n.language)}
          </Text>
        </View>
        <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
          {lastMessage?.text}
        </Text>
        <View className="flex-row items-center gap-1.5 mt-1.5">
          <View
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              conversation.handledBy === "agent" ? "bg-success" : "bg-primary",
            )}
          />
          <Text className="text-2xs text-muted">{handlerLabel}</Text>
        </View>
      </View>

      <Icon name="chevron-right" size={20} color={colors.muted} />
    </Ripple>
  );
}
