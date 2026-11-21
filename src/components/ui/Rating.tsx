import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { colors } from "@/utils/theme";

type Props = {
  value: number;
  count?: string;
  className?: string;
  size?: number;
};

export function Rating({ value, count, className, size = 14 }: Props) {
  return (
    <View className={cn("flex-row items-center gap-1", className)}>
      <Icon name="star" size={size} color={colors.warning} />
      <Text className="text-base-lg font-semibold text-text">{value.toFixed(1)}</Text>
      {count ? <Text className="text-sm text-secText">{count}</Text> : null}
    </View>
  );
}
