import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { colors } from "@/utils/theme";

const AGENCIES = [
  { city: "Kandahar", area: "Eidgah Highway Expressway Hub, Terminal 4, Shikarpur Gate" },
  { city: "Kabul", area: "Eidgah Highway Expressway Hub, Terminal 4, Shikarpur Gate" },
];

export default function AboutScreen() {
  const { t } = useTranslation();

  const VALUES: { icon: IconName; title: string; body: string }[] = [
    { icon: "satellite-alt", title: t("about.value1Title"), body: t("about.value1Body") },
    { icon: "speed", title: t("about.value2Title"), body: t("about.value2Body") },
    { icon: "ac-unit", title: t("about.value3Title"), body: t("about.value3Body") },
    { icon: "restaurant", title: t("about.value4Title"), body: t("about.value4Body") },
  ];

  const COMPLIANCE = [
    { icon: "badge" as IconName, title: t("about.nsiaTitle"), body: t("about.nsiaBody") },
    { icon: "assignment" as IconName, title: t("about.permitTitle"), body: t("about.permitBody") },
    { icon: "emergency" as IconName, title: t("about.radioTitle"), body: t("about.radioBody") },
  ];

  return (
    <Screen contentClassName="pb-10">
      <AppHeader title={t("about.title")} />

      <View className="px-4 gap-3">
        <Card className="rounded-xl bg-primarySoft border-primaryBorder p-5">
          <Text className="text-3xl font-bold text-text leading-9">{t("about.heroTitle")}</Text>
          <Text className="text-base-lg text-secText leading-6 mt-3">{t("about.heroBody")}</Text>
          <View className="flex-row items-center justify-between mt-4">
            <View>
              <Text className="text-base-lg font-bold text-text">{t("common.kandahar")}</Text>
              <Text className="text-sm text-secText">Aino Mina Sarai</Text>
            </View>
            <Icon name="directions-car" size={22} color={colors.primary} />
            <View className="items-end">
              <Text className="text-base-lg font-bold text-text">{t("common.kabul")}</Text>
              <Text className="text-sm text-secText">Company Sarai</Text>
            </View>
          </View>
        </Card>

        <View className="flex-row gap-2.5">
          {VALUES.slice(0, 2).map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </View>
        <View className="flex-row gap-2.5">
          {VALUES.slice(2).map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </View>

        <Card className="bg-primary border-primary rounded-xl p-4">
          <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-onPrimary/70">
            {t("about.officialTerminals")}
          </Text>
          <Text className="text-xl font-bold text-onPrimary mt-1 mb-3">{t("about.agencyLocations")}</Text>

          {AGENCIES.map((agency) => (
            <View key={agency.city} className="rounded-base bg-card/12 border border-card/20 p-3.5 mb-2.5">
              <View className="flex-row items-center gap-2">
                <Icon name="hub" size={18} color={colors.onPrimary} />
                <Text className="text-base-lg font-bold text-onPrimary">
                  {t(`common.${agency.city.toLowerCase()}`)} {t("about.agency")}
                </Text>
              </View>
              <Text className="text-sm text-onPrimary/70 mt-1 leading-5">{agency.area}</Text>
              <View className="flex-row items-center gap-3 mt-2">
                <View className="flex-row items-center gap-1">
                  <Icon name="schedule" size={12} color="#FFFFFF99" />
                  <Text className="text-sm text-onPrimary/80">{t("about.hoursDaily")}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Icon name="phone" size={12} color="#FFFFFF99" />
                  <Text className="text-sm text-onPrimary/80">+93 (0) 700 89 2200</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-2.5">
                <View className="flex-1">
                  <Text className="text-sm text-onPrimary/70">{t("about.vipParking")}</Text>
                  <Text className="text-sm text-onPrimary/70">{t("about.bootTagging")}</Text>
                </View>
                <Ripple
                  onPress={() => showToast("info", t("about.mapToast"), t("about.mapToastSub", { city: t(`common.${agency.city.toLowerCase()}`) }))}
                  accessibilityLabel={`${t("about.onMap")}: ${t(`common.${agency.city.toLowerCase()}`)}`}
                  className="flex-row items-center gap-1 rounded-full bg-card px-3 py-1.5"
                >
                  <Icon name="map" size={13} color={colors.primary} />
                  <Text className="text-sm font-bold text-primary">{t("about.onMap")}</Text>
                </Ripple>
              </View>
            </View>
          ))}

          <Ripple
            onPress={() => showToast("success", t("about.hotlineToast"), t("about.hotlineToastSub"))}
            accessibilityLabel={t("support.callOperations")}
            className="flex-row items-center justify-center gap-2 rounded-full bg-card py-3 mt-1"
          >
            <Icon name="phone" size={17} color={colors.primary} />
            <Text className="text-base-lg font-bold text-primary">{t("about.hotline")}</Text>
          </Ripple>
        </Card>

        <Card className="gap-3">
          {COMPLIANCE.map((item, index) => (
            <View key={item.title}>
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-base bg-primarySoft items-center justify-center">
                  <Icon name={item.icon} size={18} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-base-lg font-semibold text-text">{item.title}</Text>
                  <Text className="text-sm text-secText mt-0.5">{item.body}</Text>
                </View>
                <Icon name="check-circle" size={18} color={colors.primary} />
              </View>
              {index < COMPLIANCE.length - 1 ? <View className="h-[1px] bg-secBorder mt-3" /> : null}
            </View>
          ))}
        </Card>

        <Card>
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <Icon name="campaign" size={20} color={colors.primary} />
              <Text className="text-lg font-bold text-text">{t("about.connectTitle")}</Text>
            </View>
            <Text className="text-2xs font-bold uppercase tracking-[1px] text-primary text-right">
              {t("about.connectBadge")}
            </Text>
          </View>

          <Text className="text-base text-secText leading-6 mt-3">{t("about.connectBody")}</Text>

          <View className="flex-row flex-wrap gap-2 mt-3">
            {[
              { icon: "chat" as IconName, title: t("support.whatsapp"), detail: t("support.whatsappDetail") },
              { icon: "send" as IconName, title: t("support.telegram"), detail: t("about.telegramFeed") },
              { icon: "public" as IconName, title: t("support.facebook"), detail: t("about.facebookHandle") },
              { icon: "business-center" as IconName, title: t("support.corporate"), detail: t("about.corporateFeed") },
            ].map((channel) => (
              <Ripple
                key={channel.title}
                onPress={() => showToast("info", channel.title, t("about.channelToast"))}
                accessibilityLabel={channel.title}
                className="flex-row items-center gap-2 rounded-full bg-elevated border border-border px-3 py-2"
                >
                <Icon name={channel.icon} size={15} color={colors.primary} />
                <View>
                  <Text className="text-sm font-semibold text-text">{channel.title}</Text>
                  <Text className="text-2xs text-muted">{channel.detail}</Text>
                </View>
              </Ripple>
            ))}
          </View>
        </Card>

        <View className="items-center gap-1">
          <Badge label={t("about.network")} tone="slate" compact />
          <Text className="text-sm text-muted">{t("about.version")}</Text>
        </View>
      </View>
    </Screen>
  );
}

function ValueCard({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <Card className="flex-1 p-3.5">
      <View className="w-8 h-8 rounded-full bg-primarySoft items-center justify-center">
        <Icon name={icon} size={16} color={colors.primary} />
      </View>
      <Text className="text-base-lg font-bold text-text mt-2.5">{title}</Text>
      <Text className="text-sm text-secText mt-1 leading-5">{body}</Text>
    </Card>
  );
}
