import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type Props = {
  initials: string;
  size?: number;
  tone?: "solid" | "soft";
  online?: boolean;
  verified?: boolean;
  className?: string;
};

/** Square driver identity tile used across the driver portal. */
export function DriverAvatar({
  initials,
  size = 48,
  tone = "solid",
  online,
  verified,
  className,
}: Props) {
  return (
    <View className={cn("relative", className)} style={{ width: size, height: size }}>
      <LinearGradient
        colors={tone === "solid" ? ["#2563EB", "#1D4ED8"] : ["#EAF1FF", "#DBE8FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.28,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          className={cn("font-bold", tone === "solid" ? "text-onPrimary" : "text-primary")}
          style={{ fontSize: size * 0.34 }}
        >
          {initials}
        </Text>
      </LinearGradient>

      {online ? (
        <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-card" />
      ) : null}

      {verified ? (
        <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success items-center justify-center border-2 border-card">
          <Icon name="check" size={13} color={colors.onPrimary} />
        </View>
      ) : null}
    </View>
  );
}
