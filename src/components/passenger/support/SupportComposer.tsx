import { useTranslation } from "react-i18next";
import { TextInput, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  onAttach: () => void;
  sending?: boolean;
};

/** The pinned chat input bar: attach glyph, growing text field, send button. */
export function SupportComposer({ value, onChangeText, onSend, onAttach, sending }: Props) {
  const { t } = useTranslation();
  const canSend = value.trim().length > 0 && !sending;

  return (
    <View className="flex-row items-end gap-2 bg-card border-t border-border px-3 pt-2.5 pb-3">
      <Ripple
        onPress={onAttach}
        accessibilityLabel={t("support.attach")}
        className="w-10 h-10 rounded-full items-center justify-center"
      >
        <Icon name="attach-file" size={20} color={colors.muted} />
      </Ripple>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={t("support.composerPlaceholder")}
        placeholderTextColor={colors.placeholder}
        multiline
        className="flex-1 max-h-28 rounded-2xl bg-elevated border border-border px-4 py-2.5 text-base-lg text-text"
        style={{ textAlignVertical: "center" }}
      />

      <Ripple
        onPress={onSend}
        disabled={!canSend}
        accessibilityLabel={t("support.send")}
        accessibilityState={{ disabled: !canSend }}
        className={cn(
          "w-10 h-10 rounded-full items-center justify-center",
          canSend ? "bg-primary" : "bg-disable",
        )}
      >
        <Icon name="send" size={18} color={canSend ? colors.onPrimary : colors.muted} />
      </Ripple>
    </View>
  );
}
