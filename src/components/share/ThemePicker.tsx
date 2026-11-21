import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { showToast } from "@/components/ui/Toast";
import { useThemeStore, type AppTheme } from "@/Stores/useThemeStore";
import { cn } from "@/utils/cn";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const OPTIONS: { value: AppTheme; labelKey: string; bg: string; card: string; text: string }[] = [
  { value: "light", labelKey: "profile.themeLight", bg: "#F5F8FD", card: "#FFFFFF", text: "#0B1220" },
  { value: "dark", labelKey: "profile.themeDark", bg: "#0B1220", card: "#172135", text: "#F5F8FD" },
];

export function ThemePicker({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("profile.chooseTheme")}>
      <View className="flex-row gap-3">
        {OPTIONS.map((option) => {
          const active = theme === option.value;
          return (
            <Ripple
              key={option.value}
              onPress={() => {
                setTheme(option.value);
                showToast("success", t("profile.themeChanged"), t(option.labelKey));
                onClose();
              }}
              accessibilityLabel={t(option.labelKey)}
              className={cn(
                "flex-1 rounded-lg border p-2",
                active ? "border-primary" : "border-border",
              )}
            >
              <View
                className="rounded-md p-2.5 gap-1.5"
                style={{ backgroundColor: option.bg }}
              >
                <View className="w-8 h-2 rounded-full" style={{ backgroundColor: option.text }} />
                <View className="h-1.5 w-12 rounded-full" style={{ backgroundColor: option.text, opacity: 0.25 }} />
                <View className="rounded-md p-2 mt-1" style={{ backgroundColor: option.card }}>
                  <View className="h-1.5 w-10 rounded-full" style={{ backgroundColor: option.text, opacity: 0.7 }} />
                  <View className="h-1.5 w-7 rounded-full mt-1" style={{ backgroundColor: option.text, opacity: 0.25 }} />
                </View>
              </View>
              <View className="flex-row items-center justify-between px-1 pt-2">
                <Text className={cn("text-base-lg font-semibold", active ? "text-primary" : "text-text")}>
                  {t(option.labelKey)}
                </Text>
                {active ? <Icon name="check-circle" size={18} color="#1D4ED8" /> : null}
              </View>
            </Ripple>
          );
        })}
      </View>
    </BottomSheet>
  );
}
