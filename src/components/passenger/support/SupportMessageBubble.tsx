import { Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import type { SupportMessage } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type Props = {
  message: SupportMessage;
};

/**
 * One chat bubble. The passenger's own messages sit right-aligned in the brand
 * colour; the assistant's replies sit left-aligned on a card with a small
 * sparkle badge, mirroring the "AI assistant" rows in the conversation list.
 */
export function SupportMessageBubble({ message }: Props) {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <View className="flex-row justify-end mb-3">
        <View className="max-w-[82%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3">
          <Text className="text-base-lg text-onPrimary leading-5">{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-2 mb-3">
      <View className="w-8 h-8 rounded-full bg-primarySoft items-center justify-center">
        <Icon name="auto-awesome" size={16} color={colors.primary} />
      </View>
      <View
        className={cn(
          "max-w-[82%] rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3",
          "shadow-sm shadow-shadowColor",
        )}
      >
        <Text className="text-base-lg text-text leading-5">{message.text}</Text>
      </View>
    </View>
  );
}
