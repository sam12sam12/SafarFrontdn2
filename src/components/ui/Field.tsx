import { Text, TextInput, View, type KeyboardTypeOptions } from "react-native";

import { cn } from "@/utils/cn";
import { Icon, type IconName } from "./Icon";
import { colors } from "@/utils/theme";

type Props = {
  label?: string;
  hint?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  icon?: IconName;
  prefix?: string;
  multiline?: boolean;
  editable?: boolean;
  className?: string;
  right?: React.ReactNode;
};

export function Field({
  label,
  hint,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  icon,
  prefix,
  multiline,
  editable = true,
  className,
  right,
}: Props) {
  return (
    <View className={className}>
      {label ? (
        <Text className="text-base-lg font-semibold text-text mb-2">{label}</Text>
      ) : null}
      <View
        className={cn(
          "flex-row items-center gap-2 rounded-base bg-elevated border border-border px-3",
          multiline ? "py-3 items-start" : "py-3",
        )}
      >
        {prefix ? (
          <Text className="text-base-lg font-semibold text-text border-r border-border pr-2">
            {prefix}
          </Text>
        ) : null}
        {icon ? <Icon name={icon} size={18} color={colors.muted} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          className={cn("flex-1 text-base-lg text-text", multiline && "min-h-[54px]")}
          style={multiline ? { textAlignVertical: "top" } : undefined}
        />
        {right}
      </View>
      {hint ? <Text className="text-sm text-muted mt-1.5">{hint}</Text> : null}
    </View>
  );
}
