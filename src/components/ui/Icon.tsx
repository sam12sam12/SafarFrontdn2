import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { I18nManager } from "react-native";

import { colors } from "@/utils/theme";

export type IconName = ComponentProps<typeof MaterialIcons>["name"];

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

/**
 * Directional glyphs that must point the other way in RTL. The icon art is
 * drawn for LTR, so under native RTL we mirror these horizontally — every call
 * site just names the LTR icon and never has to think about direction.
 */
const MIRRORED_ICONS = new Set<IconName>([
  "arrow-back",
  "arrow-forward",
  "arrow-back-ios",
  "arrow-forward-ios",
  "arrow-back-ios-new",
  "chevron-left",
  "chevron-right",
  "keyboard-arrow-left",
  "keyboard-arrow-right",
  "navigate-before",
  "navigate-next",
  "arrow-right-alt",
  "subdirectory-arrow-left",
  "subdirectory-arrow-right",
  "reply",
  "send",
]);

export function Icon({ name, size = 20, color = colors.secText }: Props) {
  const mirror = I18nManager.isRTL && MIRRORED_ICONS.has(name);
  return (
    <MaterialIcons
      name={name}
      size={size}
      color={color}
      style={mirror ? { transform: [{ scaleX: -1 }] } : undefined}
    />
  );
}
