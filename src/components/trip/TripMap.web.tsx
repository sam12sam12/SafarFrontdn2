import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { colors } from "@/utils/theme";

// Highway 1 (Ring Road) corridor — fixed Kandahar → Kabul for now.
const KANDAHAR = "31.6133,65.7101";
const KABUL = "34.5553,69.2075";

type Props = { height?: number };

/** Web renderer — react-native-maps is native-only, so on web we frame Google
 * Maps' embed, which draws the real road route between the two endpoints. */
export function TripMap({ height = 180 }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) ?? "en";
  const src =
    "https://maps.google.com/maps" +
    `?saddr=${KANDAHAR}&daddr=${KABUL}` +
    "&dirflg=d&output=embed" +
    `&hl=${lang}`;

  return (
    <View
      className="rounded-xl overflow-hidden bg-primarySoft border border-border"
      style={{ height }}
    >
      <iframe
        src={src}
        title="Kandahar to Kabul route"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        style={{ border: 0, width: "100%", height: "100%", backgroundColor: colors.primarySoft }}
      />
    </View>
  );
}
