import { Image, type ImageSource } from "expo-image";
import type { ImageSourcePropType } from "react-native";
import { Text, View } from "react-native";

import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { colors } from "@/utils/theme";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type Props = {
  initials: string;
  size?: Size;
  photo?: ImageSourcePropType;
  verified?: boolean;
  online?: boolean;
  className?: string;
};

const BOX: Record<Size, string> = {
  xs: "w-7 h-7",
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
  "2xl": "w-24 h-24",
};

const TEXT: Record<Size, string> = {
  xs: "text-2xs",
  sm: "text-sm",
  md: "text-base-lg",
  lg: "text-lg",
  xl: "text-2xl",
  "2xl": "text-3xl",
};

export function Avatar({
  initials,
  size = "md",
  photo,
  verified,
  online,
  className,
}: Props) {
  return (
    <View className={cn("relative", className)}>
      <View
        className={cn(
          "rounded-full bg-primarySoft items-center justify-center overflow-hidden",
          BOX[size],
        )}
      >
        {photo ? (
          <Image source={photo as ImageSource | number} style={{ width: "100%", height: "100%" }} contentFit="cover" />
        ) : (
          <Text className={cn("font-bold text-primary", TEXT[size])}>{initials}</Text>
        )}
      </View>

      {verified && (
        <View className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary items-center justify-center border border-card">
          <Icon name="check" size={9} color={colors.onPrimary} />
        </View>
      )}

      {online && (
        <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border border-card" />
      )}
    </View>
  );
}
