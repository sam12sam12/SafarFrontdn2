import { Text, View } from "react-native";

import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { AppButton } from "./AppButton";
import { colors } from "@/utils/theme";

type Props = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = "inbox", title, message, actionLabel, onAction }: Props) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <View className="w-14 h-14 rounded-full bg-primarySoft items-center justify-center mb-4">
        <Icon name={icon} size={26} color={colors.primary} />
      </View>
      <Text className="text-lg font-bold text-text text-center">{title}</Text>
      {message ? (
        <Text className="text-base text-secText text-center mt-1.5 leading-5">{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} className="mt-5 px-6" compact />
      ) : null}
    </View>
  );
}
