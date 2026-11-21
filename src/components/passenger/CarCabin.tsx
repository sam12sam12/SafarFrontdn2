import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { useCSSVariable } from "uniwind";

const BODY =
  "M160 8 C116 8 88 14 70 30 C48 50 30 80 24 120 L16 292 C14 334 30 360 68 374 C95 383 130 386 160 386 C190 386 225 383 252 374 C290 360 306 334 304 292 L296 120 C290 80 272 50 250 30 C232 14 204 8 160 8 Z";

/** Top-view cabin shell. Seat cards are rendered as children on top. */
export function CarCabin({
  children,
  strokeColor,
}: {
  children: ReactNode;
  strokeColor?: string;
}) {
  const [elevated, primary, secBorder, text] = useCSSVariable([
    "--color-elevated",
    "--color-primary",
    "--color-secBorder",
    "--color-text",
  ]) as string[];

  return (
    <View className="mt-4 relative" style={{ aspectRatio: 320 / 388 }}>
      <Svg
        pointerEvents="none"
        width="100%"
        height="100%"
        viewBox="0 0 320 388"
        style={StyleSheet.absoluteFill}
      >
        <Path
          d={BODY}
          fill={elevated}
          stroke={strokeColor ?? primary}
          strokeWidth={2}
          strokeDasharray="8 6"
          strokeLinecap="round"
        />

        {/* windshield, rear glass, and the faint floor pan */}
        <Path
          d="M76 54 Q160 26 244 54"
          fill="none"
          stroke={secBorder}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Path
          d="M88 332 Q160 358 232 332"
          fill="none"
          stroke={secBorder}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Path
          d="M48 214 C48 196 64 184 86 184 L234 184 C256 184 272 196 272 214"
          fill="none"
          stroke={secBorder}
          strokeWidth={3}
          opacity={0.55}
        />

        {/* centre console */}
        <Rect x={149} y={76} width={22} height={232} rx={11} fill={secBorder} opacity={0.8} />

        {/* door handles */}
        <Rect x={4} y={112} width={11} height={30} rx={5.5} fill={text} opacity={0.9} />
        <Rect x={4} y={264} width={11} height={30} rx={5.5} fill={text} opacity={0.9} />
        <Rect x={305} y={112} width={11} height={30} rx={5.5} fill={text} opacity={0.9} />
        <Rect x={305} y={264} width={11} height={30} rx={5.5} fill={text} opacity={0.9} />
      </Svg>

      <View className="absolute inset-0">{children}</View>
    </View>
  );
}
