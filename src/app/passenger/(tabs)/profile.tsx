import { useRouter } from "expo-router";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { LanguagePicker } from "@/components/share/LanguagePicker";
import { ThemePicker } from "@/components/share/ThemePicker";
import { ProfileSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import { useProfile } from "@/lib/queries/statsQueries";
import { useLanguageStore } from "@/Stores/useLanguageStore";
import { useSessionStore } from "@/Stores/useSessionStore";
import { useThemeStore } from "@/Stores/useThemeStore";
import { cn } from "@/utils/cn";

export default function PassengerProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const profileQuery = useProfile();
  const { data: profile, isLoading } = profileQuery;
  const setRole = useSessionStore((state) => state.setRole);

  const theme = useThemeStore((state) => state.theme);
  const language = useLanguageStore((state) => state.language);
  const [biometric, setBiometric] = useState(true);
  const [themePicker, setThemePicker] = useState(false);
  const [languagePicker, setLanguagePicker] = useState(false);

  const themeLabel = theme === "light" ? t("profile.themeLight") : t("profile.themeDark");
  const languageLabel =
    language === "en" ? "English" : language === "ps" ? "پښتو" : "دری";

  return (
    <Screen
      contentClassName="pb-8"
      refreshing={profileQuery.isRefetching}
      onRefresh={profileQuery.refetch}
    >
      <View className="px-4 pt-4 pb-3">
        <Text className="text-xl font-bold text-text">{t("profile.title")}</Text>
      </View>

      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <View className="px-4">
          <Card className="flex-row items-center gap-3 p-3">
            <Avatar
              initials={profile?.initials ?? "AP"}
              photo={require("@/assets/images/passenger.jpg")}
              size="lg"
              verified
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-text">{profile?.name}</Text>
              <Text className="text-base text-secText mt-0.5">{profile?.phone}</Text>
            </View>
            <Ripple
              onPress={() => showToast("info", t("profile.edit"), t("profile.editSub"))}
              accessibilityLabel={t("profile.edit")}
              className="w-8 h-8 rounded-full bg-disable items-center justify-center"
            >
              <Icon name="edit" size={17} color="#64748B" />
            </Ripple>
          </Card>

          <SectionLabel label={t("profile.general")} />
          <Card className="py-0 px-4">
            <SettingsRow
              icon="contrast"
              tone="blue"
              title={t("profile.appearance")}
              subtitle={t("profile.appearanceSub")}
              value={themeLabel}
              onPress={() => setThemePicker(true)}
            />
            <Divider />
            <SettingsRow
              icon="translate"
              tone="blue"
              title={t("profile.language")}
              subtitle={t("profile.languageSub")}
              value={languageLabel}
              onPress={() => setLanguagePicker(true)}
            />
            <Divider />
            <SettingsRow
              icon="notifications-none"
              tone="slate"
              title={t("profile.notifications")}
              subtitle={t("profile.notificationsSub")}
              onPress={() =>
                showToast("info", t("profile.notifications"), t("profile.notificationsSub"))
              }
            />
          </Card>

          <SectionLabel label={t("profile.safety")} />
          <Card className="py-0 px-4">
            <SettingsRow
              icon="contact-emergency"
              tone="red"
              title={t("profile.emergency")}
              subtitle={t("profile.emergencySub")}
              value={t("profile.configured")}
              valueTone="success"
              onPress={() =>
                showToast("success", t("profile.emergency"), "Abdul Popalzai · 0700 555 210")
              }
            />
            <Divider />
            <SettingsRow
              icon="fingerprint"
              tone="blue"
              title={t("profile.biometric")}
              subtitle={t("profile.biometricSub")}
              right={
                <Toggle
                  value={biometric}
                  onChange={setBiometric}
                  accessibilityLabel={t("profile.biometric")}
                />
              }
            />
          </Card>

          <SectionLabel label={t("profile.info")} />
          <Card className="py-0 px-4">
            <SettingsRow
              icon="directions-car"
              tone="slate"
              title={t("profile.aboutFleet")}
              subtitle={t("profile.aboutFleetSub")}
              onPress={() => router.push("/passenger/about")}
            />
            <Divider />
            <SettingsRow
              icon="cleaning-services"
              tone="slate"
              title={t("profile.guidelines")}
              subtitle={t("profile.guidelinesSub")}
              onPress={() =>
                showToast("info", t("profile.guidelines"), t("profile.guidelinesSub"))
              }
            />
            <Divider />
            <SettingsRow
              icon="contact-emergency"
              tone="red"
              title={t("profile.emergency")}
              subtitle={t("profile.emergencySub")}
              value={t("profile.configured")}
              valueTone="success"
              onPress={() =>
                showToast("success", t("profile.emergency"), "Abdul Popalzai · 0700 555 210")
              }
            />
            <Divider />
            <SettingsRow
              icon="share"
              tone="amber"
              title={t("profile.shareFriends")}
              subtitle={t("profile.shareFriendsSub")}
              onPress={() =>
                showToast("success", t("profile.shareFriends"), "Invite link copied.")
              }
            />
          </Card>

          <SectionLabel label={t("profile.portal")} />
          <Card className="py-0 px-4">
            <SettingsRow
              icon="swap-horiz"
              tone="blue"
              title={t("profile.driverPortal")}
              subtitle={t("profile.driverPortalSub")}
              onPress={() => {
                setRole("driver");
                router.replace("/driver");
              }}
            />
            <Divider />
            <SettingsRow
              icon="storefront"
              tone="slate"
              title={t("profile.agencyPortal")}
              subtitle={t("profile.agencyPortalSub")}
              onPress={() => {
                setRole("owner");
                router.replace("/owner");
              }}
            />
          </Card>

          <AppButton
            label={t("profile.logout")}
            variant="danger"
            icon="logout"
            iconPosition="left"
            className="mt-5"
            onPress={() => {
              showToast("success", t("profile.logoutDone"), t("profile.logoutDoneSub"));
              setRole("passenger");
              router.replace("/");
            }}
          />

          <View className="items-center mt-4 gap-1">
            <Text className="text-sm text-muted">{t("profile.delete")}</Text>
            <View className="flex-row items-center gap-1.5">
              <Icon name="route" size={11} color="#94A3B8" />
              <Text className="text-2xs text-muted">{t("profile.version")}</Text>
            </View>
          </View>
        </View>
      )}

      <ThemePicker visible={themePicker} onClose={() => setThemePicker(false)} />
      <LanguagePicker visible={languagePicker} onClose={() => setLanguagePicker(false)} />
    </Screen>
  );
}

type Tone = "blue" | "red" | "amber" | "slate";

const TONE: Record<Tone, { bg: string; color: string }> = {
  blue: { bg: "bg-primarySoft", color: "#1D4ED8" },
  red: { bg: "bg-errorSoft", color: "#EF4444" },
  amber: { bg: "bg-warningSoft", color: "#F59E0B" },
  slate: { bg: "bg-disable", color: "#64748B" },
};

function SectionLabel({ label }: { label: string }) {
  return (
    <Text className="text-2xs font-bold uppercase tracking-[1.3px] text-muted mt-5 mb-2 px-1">
      {label}
    </Text>
  );
}

function Divider() {
  return <View className="h-[1px] bg-secBorder ms-12" />;
}

function SettingsRow({
  icon,
  tone,
  title,
  subtitle,
  value,
  valueTone,
  right,
  onPress,
}: {
  icon: IconName;
  tone: Tone;
  title: string;
  subtitle: string;
  value?: string;
  valueTone?: "default" | "success";
  right?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Ripple
      onPress={onPress}
      accessibilityLabel={title}
      className="flex-row items-center gap-3 py-2.5"
    >
      <View className={cn("w-9 h-9 rounded-full items-center justify-center", TONE[tone].bg)}>
        <Icon name={icon} size={18} color={TONE[tone].color} />
      </View>
      <View className="flex-1">
        <Text className="text-base-lg font-semibold text-text">{title}</Text>
        <Text className="text-xs text-secText mt-0.5" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {right ?? (
        <View className="flex-row items-center gap-1">
          {value ? (
            <Text
              className={cn(
                "text-base font-semibold",
                valueTone === "success" ? "text-success" : "text-secText",
              )}
            >
              {value}
            </Text>
          ) : null}
          <Icon name="chevron-right" size={18} color="#94A3B8" />
        </View>
      )}
    </Ripple>
  );
}
