import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { NavRow } from "@/components/ui/DetailRow";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { colors } from "@/utils/theme";

export default function PassengerSupportScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen contentClassName="px-4 pb-8">
      <AppHeader title={t("support.title")} showBack={false} subtitle={t("support.subtitle")} />

      <LinearGradient
        colors={[colors.primaryDark, colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, padding: 18 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-success" />
            <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-onPrimary/70">
              {t("support.liveDesk")}
            </Text>
          </View>
          <Icon name="support-agent" size={22} color={colors.onPrimary} />
        </View>
        <Text className="text-2xl font-bold text-onPrimary mt-3">{t("support.hotlineTitle")}</Text>
        <Text className="text-base text-onPrimary/75 mt-1">{t("support.hotlineBody")}</Text>
        <AppButton
          label={t("support.callOperations")}
          icon="phone"
          iconPosition="left"
          variant="secondary"
          className="mt-4"
          onPress={() => showToast("success", t("support.dialingTitle"), t("support.dialingBody"))}
        />
      </LinearGradient>

      <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mt-5 mb-2 px-1">
        {t("support.channels")}
      </Text>
      <View className="flex-row gap-2.5">
        <ChannelCard icon="chat" title={t("support.whatsapp")} detail={t("support.whatsappDetail")} tone="green" />
        <ChannelCard icon="send" title={t("support.telegram")} detail={t("support.telegramDetail")} tone="blue" />
      </View>
      <View className="flex-row gap-2.5 mt-2.5">
        <ChannelCard icon="public" title={t("support.facebook")} detail="@AfghanIntercity" tone="blue" />
        <ChannelCard icon="business-center" title={t("support.corporate")} detail={t("support.corporateDetail")} tone="slate" />
      </View>

      <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mt-5 mb-2 px-1">
        {t("support.conditions")}
      </Text>
      <Card className="gap-3">
        <ConditionRow icon="check-circle" tone="success" title={t("support.ghazniClear")} detail={t("support.ghazniClearDetail")} />
        <View className="h-[1px] bg-secBorder" />
        <ConditionRow icon="schedule" tone="primary" title={t("support.departures")} detail={t("support.departuresDetail")} />
        <View className="h-[1px] bg-secBorder" />
        <ConditionRow icon="wb-sunny" tone="warning" title={t("support.weather")} detail={t("support.weatherDetail")} />
      </Card>

      <Text className="text-2xs font-bold uppercase tracking-[1.4px] text-muted mt-5 mb-2 px-1">
        {t("support.faq")}
      </Text>
      <Card className="py-0 px-4">
        <NavRow title={t("support.faqChange")} subtitle={t("support.faqChangeDetail")} onPress={() => showToast("info", t("support.faqChange"), t("support.faqChangeToast"))} />
        <View className="h-[1px] bg-secBorder" />
        <NavRow title={t("support.faqLuggage")} subtitle={t("support.faqLuggageDetail")} onPress={() => showToast("info", t("support.faqLuggage"), t("support.faqLuggageToast"))} />
        <View className="h-[1px] bg-secBorder" />
        <NavRow title={t("support.faqRefund")} subtitle={t("support.faqRefundDetail")} onPress={() => showToast("info", t("support.faqRefund"), t("support.faqRefundToast"))} />
        <View className="h-[1px] bg-secBorder" />
        <NavRow title={t("support.faqAbout")} subtitle={t("support.faqAboutDetail")} onPress={() => router.push("/passenger/about")} />
      </Card>

      <View className="flex-row items-center justify-center gap-2 mt-5">
        <Badge label={t("support.gpsMonitored")} tone="blue" icon="gps-fixed" compact />
        <Badge label={t("support.verifiedDrivers")} tone="green" icon="verified" compact />
      </View>

      <View className="flex-row items-center justify-center gap-1.5 mt-4">
        <Icon name="lock" size={13} color={colors.muted} />
        <Text className="text-sm text-muted">{t("support.dataFooter")}</Text>
      </View>
    </Screen>
  );
}

function ChannelCard({
  icon,
  title,
  detail,
  tone,
}: {
  icon: "chat" | "send" | "public" | "business-center";
  title: string;
  detail: string;
  tone: "green" | "blue" | "slate";
}) {
  return (
    <View className="flex-1 rounded-lg bg-card border border-border p-3.5">
      <View
        className={`w-9 h-9 rounded-base items-center justify-center ${
          tone === "green" ? "bg-successSoft" : tone === "blue" ? "bg-primarySoft" : "bg-disable"
        }`}
      >
        <Icon
          name={icon}
          size={18}
          color={tone === "green" ? colors.success : tone === "blue" ? colors.primary : colors.secText}
        />
      </View>
      <Text className="text-base-lg font-bold text-text mt-2.5">{title}</Text>
      <Text className="text-sm text-secText mt-0.5">{detail}</Text>
    </View>
  );
}

function ConditionRow({
  icon,
  tone,
  title,
  detail,
}: {
  icon: "check-circle" | "schedule" | "wb-sunny";
  tone: "success" | "primary" | "warning";
  title: string;
  detail: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View
        className={`w-8 h-8 rounded-full items-center justify-center ${
          tone === "success" ? "bg-successSoft" : tone === "primary" ? "bg-primarySoft" : "bg-warningSoft"
        }`}
      >
        <Icon
          name={icon}
          size={16}
          color={tone === "success" ? colors.success : tone === "primary" ? colors.primary : colors.warning}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base-lg font-semibold text-text">{title}</Text>
        <Text className="text-sm text-secText mt-0.5">{detail}</Text>
      </View>
    </View>
  );
}
