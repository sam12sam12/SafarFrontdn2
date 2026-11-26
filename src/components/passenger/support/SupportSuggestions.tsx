import { ScrollView, Text } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { colors } from "@/utils/theme";

export type SupportSuggestion = {
  id: string;
  question: string;
};

type Props = {
  suggestions: SupportSuggestion[];
  onSelect: (question: string) => void;
};

/**
 * Horizontally scrolling prompt cards shown under the chat. Tapping one sends
 * it straight into the composer flow, like the suggestion row in the mockup.
 */
export function SupportSuggestions({ suggestions, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-2.5 px-4 py-1"
    >
      {suggestions.map((suggestion) => (
        <Ripple
          key={suggestion.id}
          onPress={() => onSelect(suggestion.question)}
          accessibilityLabel={suggestion.question}
          className="w-44 rounded-lg bg-card border border-border p-3.5 shadow-sm shadow-shadowColor"
        >
          <Icon name="help-outline" size={18} color={colors.primary} />
          <Text className="text-base-lg font-semibold text-text mt-2 leading-5">
            {suggestion.question}
          </Text>
        </Ripple>
      ))}
    </ScrollView>
  );
}
