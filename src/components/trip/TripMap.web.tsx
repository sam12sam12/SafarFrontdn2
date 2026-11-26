import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { Driver } from "@/lib/db/types";
import { colors } from "@/utils/theme";
import { Avatar } from "../ui/Avatar";

// Highway 1 (Ring Road) corridor — fixed Kandahar → Kabul for now.
const KANDAHAR = "31.6133,65.7101";
const KABUL = "34.5553,69.2075";

type Props = { height?: number; driver?: Driver };

/** Web renderer — react-native-maps is native-only, so on web we frame Google
 * Maps' embed, which draws the real road route between the two endpoints. The
 * driver's profile floats over the start of the corridor. */
export function TripMap({ height = 180, driver }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) ?? "en";
  const src =
    "https://maps.google.com/maps" +
    `?saddr=${KANDAHAR}&daddr=${KABUL}` +
    "&dirflg=d&output=embed" +
    `&hl=${lang}`;

  return (
    <View
      className="rounded-xl overflow-hidden bg-primarySoft border border-border relative"
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
      {driver ? (
        <View className="absolute bottom-3 left-3 flex-row items-center gap-2 rounded-full bg-card/95 border border-border pl-1 pr-3 py-1 shadow-md">
          <Avatar initials={driver.initials} photo={driver.photo} size="xs" verified />
          <Text className="text-xs font-bold text-text" numberOfLines={1}>
            {driver.name}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
