import { Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { cn } from "@/utils/cn";
import { Icon } from "../ui/Icon";
import { colors } from "@/utils/theme";

type Props = {
  progress: number;
  speed?: string;
  location?: string;
  className?: string;
};

/** A stylised corridor map drawn with vectors — the demo has no tile
 * provider, and a real map would be a native-only dependency. */
export function MapPanel({ progress, speed = "85 km/h", location, className }: Props) {
  return (
    <View className={cn("rounded-lg overflow-hidden bg-primarySoft relative", className)}>
      <Svg width="100%" height={190} viewBox="0 0 340 190">
        <Rect x="0" y="0" width="340" height="190" fill={colors.primarySoft} />
        {[30, 70, 110, 150].map((y) => (
          <Path key={y} d={`M0 ${y} H340`} stroke={colors.mapGrid} strokeWidth={1} />
        ))}
        {[45, 110, 175, 240, 305].map((x) => (
          <Path key={x} d={`M${x} 0 V190`} stroke={colors.mapGrid} strokeWidth={1} />
        ))}
        {/* secondary roads */}
        <Path
          d="M0 150 C 60 150, 90 118, 140 116 S 240 132, 340 96"
          stroke={colors.primaryBorder}
          strokeWidth={7}
          fill="none"
        />
        <Path
          d="M70 0 C 90 45, 130 60, 150 96 S 190 150, 210 190"
          stroke={colors.primaryBorder}
          strokeWidth={5}
          fill="none"
        />
        {/* highway 1 */}
        <Path
          d="M18 132 C 70 122, 106 84, 166 82 S 268 58, 322 34"
          stroke={colors.primary}
          strokeWidth={4}
          fill="none"
        />
        <Path
          d="M18 132 C 70 122, 106 84, 166 82 S 268 58, 322 34"
          stroke={colors.onPrimary}
          strokeWidth={1}
          strokeDasharray="5 7"
          fill="none"
          opacity={0.8}
        />
        <Circle cx="18" cy="132" r="6" fill={colors.onPrimary} stroke={colors.primary} strokeWidth={3} />
        <Circle cx="166" cy="82" r="6" fill={colors.onPrimary} stroke={colors.primary} strokeWidth={3} />
        <Circle cx="322" cy="34" r="6" fill={colors.onPrimary} stroke={colors.success} strokeWidth={3} />
        <Circle
          cx={18 + (322 - 18) * (progress / 100)}
          cy={132 - (132 - 34) * (progress / 100)}
          r="16"
          fill={colors.primary}
          opacity={0.15}
        />
      </Svg>

      <View className="absolute left-3 top-3 flex-row items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1.5">
        <View className="w-1.5 h-1.5 rounded-full bg-success" />
        <Text className="text-sm font-semibold text-text">Live · {speed}</Text>
      </View>

      <View className="absolute right-3 top-3 rounded-full bg-card/95 px-2.5 py-1.5">
        <Text className="text-sm font-semibold text-primary">Hwy 1</Text>
      </View>

      <View className="absolute left-2 bottom-3">
        <Text className="text-sm font-bold text-text">Kandahar</Text>
        <Text className="text-2xs text-secText">Aino Mina</Text>
      </View>

      <View className="absolute right-2 bottom-3 items-end">
        <Text className="text-sm font-bold text-text">Kabul</Text>
        <Text className="text-2xs text-secText">Company Chowk</Text>
      </View>

      <View
        className="absolute items-center"
        style={{
          left: `${Math.min(Math.max(progress, 8), 78)}%`,
          top: `${Math.max(34 - progress * 0.18, 8)}%`,
        }}
      >
        <View className="w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-card shadow-raised shadow-shadowStrong">
          <Icon name="directions-car" size={16} color={colors.onPrimary} />
        </View>
        {location ? (
          <View className="mt-1 rounded-full bg-card px-1.5 py-0.5">
            <Text className="text-2xs font-semibold text-text">{location}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
