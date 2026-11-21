import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import type { City } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  from: City;
  onSelect: (from: City, to: City) => void;
};

const ROUTES: { from: City; to: City; labelKey: string }[] = [
  { from: "Kandahar", to: "Kabul", labelKey: "home.routeToKabul" },
  { from: "Kabul", to: "Kandahar", labelKey: "home.routeToKandahar" },
];

export function RoutePicker({ visible, onClose, from, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("home.chooseRoute")}>
      <View className="gap-2">
        {ROUTES.map((route) => {
          const active = from === route.from;
          return (
            <Ripple
              key={route.labelKey}
              onPress={() => {
                onSelect(route.from, route.to);
                onClose();
              }}
              accessibilityLabel={t(route.labelKey)}
              className={cn(
                "flex-row items-center gap-3 rounded-base border px-4 py-3.5",
                active ? "border-primary bg-primarySoft" : "border-border bg-card",
              )}
            >
              <View className="w-9 h-9 rounded-full bg-disable items-center justify-center">
                <Icon name="swap-horiz" size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base-lg font-semibold text-text">{t(route.labelKey)}</Text>
              </View>
              <Icon
                name={active ? "check-circle" : "radio-button-unchecked"}
                size={20}
                color={active ? colors.primary : colors.slate}
              />
            </Ripple>
          );
        })}
      </View>
    </BottomSheet>
  );
}
