import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { showToast } from "@/components/ui/Toast";
import { useLanguageStore, type AppLanguage } from "@/Stores/useLanguageStore";
import { cn } from "@/utils/cn";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const LANGUAGES: { value: AppLanguage; label: string; native: string }[] = [
  { value: "en", label: "profile.english", native: "English" },
  { value: "ps", label: "profile.pashto", native: "پښتو" },
  { value: "fa", label: "profile.dari", native: "دری" },
];

export function LanguagePicker({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t("profile.chooseLanguage")}>
      <View className="gap-2">
        {LANGUAGES.map((option) => {
          const active = language === option.value;
          return (
            <Ripple
              key={option.value}
              onPress={() => {
                setLanguage(option.value);
                showToast("success", t("profile.languageChanged"), option.native);
                onClose();
              }}
              accessibilityLabel={option.native}
              className={cn(
                "flex-row items-center gap-3 rounded-base border px-4 py-3.5",
                active ? "border-primary bg-primarySoft" : "border-border bg-card",
              )}
            >
              <View className="w-9 h-9 rounded-full bg-disable items-center justify-center">
                <Text className="text-base-lg font-bold text-primary">
                  {option.value.toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base-lg font-semibold text-text">{option.native}</Text>
                <Text className="text-sm text-secText mt-0.5">
                  {t(option.label)}
                </Text>
              </View>
              <Icon
                name={active ? "check-circle" : "radio-button-unchecked"}
                size={20}
                color={active ? "#1D4ED8" : "#CBD5E1"}
              />
            </Ripple>
          );
        })}
      </View>
    </BottomSheet>
  );
}
