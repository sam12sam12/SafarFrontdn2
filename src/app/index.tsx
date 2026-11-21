import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";
import { useCSSVariable } from "uniwind";

import { AppButton } from "@/components/ui/AppButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { useSessionStore } from "@/Stores/useSessionStore";

const FEATURES: { icon: IconName; titleKey: string; bodyKey: string }[] = [
  { icon: "schedule", titleKey: "onboarding.dailyTrips", bodyKey: "onboarding.dailyTripsSub" },
  { icon: "ac-unit", titleKey: "onboarding.ac", bodyKey: "onboarding.acSub" },
  { icon: "shield", titleKey: "onboarding.safeDoor", bodyKey: "onboarding.safeDoorSub" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setRole = useSessionStore((state) => state.setRole);
  const [phone, setPhone] = useState("");

  const [primaryDark, primary, primaryLight] = useCSSVariable([
    "--color-primaryDark",
    "--color-primary",
    "--color-primaryLight",
  ]) as string[];

  const enter = () => {
    setRole("passenger");
    router.replace("/passenger");
  };

  return (
    <Screen contentClassName="px-4 pb-8">
      <LinearGradient
        colors={["#E7F1FF", "#F4F9FF", "#F5F8FD"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", left: 0, right: 0, top: -100, height: 560 }}
      />

      <View className="pt-8">
        <View className="flex-row items-center gap-2">
          <Icon name="route" size={15} color="#1D4ED8" />
          <Text className="text-2xs font-bold tracking-[1.4px] uppercase text-secText">
            {t("onboarding.eyebrow")}
          </Text>
        </View>

        <Text className="text-3xl font-bold text-text leading-9 mt-3">
          {t("onboarding.title1")}
          {"\n"}
          <Text className="text-primary">{t("onboarding.title2")}</Text>{" "}
          {t("onboarding.title3")}
        </Text>

        <Text className="text-base-lg text-secText leading-6 mt-3">
          {t("onboarding.intro")}
        </Text>
      </View>

      <Card className="mt-5 rounded-xl p-3">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2.5">
            <View className="w-9 h-9 rounded-base bg-primarySoft items-center justify-center">
              <Icon name="directions-car" size={19} color="#1D4ED8" />
            </View>
            <View>
              <Text className="text-base font-bold text-text">Toyota Fielder X 2018</Text>
              <Text className="text-xs text-secText mt-0.5">{t("home.fleetSpec")}</Text>
            </View>
          </View>
          <Badge label={t("home.vettedDriver")} tone="blue" icon="verified-user" />
        </View>

        <View className="rounded-base overflow-hidden">
          <Image
            source={require("@/assets/images/car-hero.jpg")}
            style={{ width: "100%", height: 168 }}
            contentFit="cover"
          />
          <View className="absolute right-2.5 bottom-2.5 flex-row items-center gap-1.5 bg-card/95 rounded-full px-2.5 py-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-primary" />
            <Text className="text-sm font-semibold text-text">{t("home.liveTransit")}</Text>
          </View>
        </View>

        <View className="flex-row items-start justify-between px-1.5 mt-3 mb-1">
          <View>
            <Text className="text-xs font-bold text-text">{t("home.transitWindow")}</Text>
            <Text className="text-base-lg font-bold text-primary mt-1">
              {t("home.transitTime")}
            </Text>
          </View>
          <View>
            <Text className="text-xs font-bold text-text">{t("home.passengerCap")}</Text>
            <Text className="text-base-lg font-bold text-text mt-1">{t("home.maxSeats")}</Text>
          </View>
          <View>
            <Text className="text-xs font-bold text-text">{t("home.startingRate")}</Text>
            <Text className="text-base-lg font-bold text-text mt-1">AFN 1,200</Text>
          </View>
        </View>
      </Card>

      <View className="gap-2.5 mt-3">
        {FEATURES.map((feature) => (
          <Card
            key={feature.titleKey}
            flat
            className="rounded-full flex-row items-center gap-3 py-2.5 pl-2.5 pr-3"
          >
            <View className="w-10 h-10 rounded-full bg-primarySoft items-center justify-center">
              <Icon name={feature.icon} size={19} color="#1D4ED8" />
            </View>
            <View className="flex-1">
              <Text className="text-base-lg font-bold text-text">{t(feature.titleKey)}</Text>
              <Text className="text-sm text-secText mt-0.5" numberOfLines={1}>
                {t(feature.bodyKey)}
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color="#B6C2D2" />
          </Card>
        ))}
      </View>

      <Card className="mt-3">
        <View className="flex-row items-center justify-between mb-2.5">
          <Text className="text-base-lg font-bold text-text">{t("onboarding.quickBooking")}</Text>
          <View className="flex-row items-center gap-1">
            <Icon name="lock" size={12} color="#1D4ED8" />
            <Text className="text-sm font-bold text-primary">{t("onboarding.smsCode")}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2 rounded-base bg-elevated border border-border px-3 py-2.5">
          <Text className="text-base-lg">🇦🇫</Text>
          <Text className="text-base-lg font-semibold text-text border-r border-border pr-2">
            +93
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="70 123 4567"
            placeholderTextColor="#A8B3C4"
            keyboardType="phone-pad"
            className="flex-1 text-base-lg text-text"
          />
          <Icon name="qr-code-2" size={20} color="#1D4ED8" />
        </View>

        <Text className="text-sm text-secText mt-2.5">{t("onboarding.supported")}</Text>
      </Card>

      <AppButton
        label={t("onboarding.getStarted")}
        icon="arrow-forward"
        onPress={enter}
        className="mt-4"
      />

      <View className="flex-row items-center justify-center gap-1.5 mt-3">
        <Text className="text-base text-secText">{t("onboarding.haveAccount")}</Text>
        <Ripple onPress={enter} accessibilityLabel={t("onboarding.signIn")}>
          <Text className="text-base-lg font-bold text-primary">{t("onboarding.signIn")}</Text>
        </Ripple>
      </View>

      <View className="flex-row items-center justify-between mt-5 px-4">
        <View className="items-center gap-1">
          <Icon name="wifi-tethering" size={17} color="#94A3B8" />
          <Text className="text-xs font-semibold text-secText text-center">
            {t("onboarding.checkpoints")}
          </Text>
        </View>
        <View className="w-1 h-1 rounded-full bg-border" />
        <View className="items-center gap-1">
          <Icon name="luggage" size={17} color="#94A3B8" />
          <Text className="text-xs font-semibold text-secText text-center">
            {t("onboarding.bagsFree")}
          </Text>
        </View>
        <View className="w-1 h-1 rounded-full bg-border" />
        <View className="items-center gap-1">
          <Icon name="support-agent" size={17} color="#94A3B8" />
          <Text className="text-xs font-semibold text-secText text-center">
            {t("onboarding.helpline")}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
