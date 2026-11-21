import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { showToast } from "@/components/ui/Toast";
import type { City } from "@/lib/db/types";
import { useAddDriver } from "@/lib/queries/driversQueries";
import { dismissLoading, showLoading } from "@/Stores/useLoadingStore";
import { colors } from "@/utils/theme";

export default function AddDriverScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const addDriver = useAddDriver();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [base, setBase] = useState<City>("Kandahar");
  const [plate, setPlate] = useState("");
  const [pay, setPay] = useState("1500");

  const submit = async () => {
    if (name.trim().length < 3) {
      showToast("error", t("owner.nameRequired"), t("owner.nameRequiredBody"));
      return;
    }
    if (phone.trim().length < 6) {
      showToast("error", t("owner.phoneRequired"), t("owner.phoneRequiredBody"));
      return;
    }

    showLoading(t("owner.addingChauffeur"));
    try {
      await addDriver.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        base,
        payPerTrip: Number(pay) || 1500,
      });
      dismissLoading();
      showToast("success", t("owner.driverAdded"), t("owner.driverAddedSub", { name: name.trim() }));
      router.back();
    } catch {
      dismissLoading();
      showToast("error", t("owner.couldNotAddDriver"), t("owner.tryAgain"));
    }
  };

  return (
    <Screen contentClassName="pb-8">
      <AppHeader title={t("owner.addDriverTitle")} subtitle={t("owner.addDriverSubtitle")} />

      <View className="px-4 gap-3">
        <Card className="items-center py-5">
          <View className="w-16 h-16 rounded-full bg-primarySoft items-center justify-center">
            <Icon name="person-add" size={30} color={colors.primary} />
          </View>
          <Text className="text-lg font-bold text-text mt-2.5">{t("owner.chauffeurProfile")}</Text>
          <Text className="text-sm text-secText mt-1 text-center max-w-[260px]">
            {t("owner.chauffeurProfileHint")}
          </Text>
          <Badge label={t("owner.backgroundPending")} tone="amber" className="mt-2.5" />
        </Card>

        <Card className="gap-3">
          <Field label={t("owner.fullName")} placeholder="Ustad …" value={name} onChangeText={setName} icon="person" />
          <Field
            label={t("owner.mobileNumber")}
            placeholder="70 123 4567"
            value={phone}
            onChangeText={setPhone}
            prefix="+93"
            keyboardType="phone-pad"
          />
          <Field
            label={t("owner.vehiclePlate")}
            placeholder="KDR-00000"
            value={plate}
            onChangeText={setPlate}
            icon="directions-car"
          />
          <Field
            label={t("owner.payPerTrip")}
            value={pay}
            onChangeText={setPay}
            keyboardType="number-pad"
          />
        </Card>

        <Card>
          <Text className="text-base-lg font-bold text-text mb-2.5">{t("owner.homeBase")}</Text>
          <Segmented
            options={[
              { label: t("common.kandahar"), value: "Kandahar" },
              { label: t("common.kabul"), value: "Kabul" },
            ]}
            value={base}
            onChange={(value) => setBase(value as City)}
            compact
          />
          <Text className="text-sm text-secText mt-2">
            {base === "Kandahar" ? t("owner.homeBaseKandaharHint") : t("owner.homeBaseKabulHint")}
          </Text>
        </Card>

        <Card className="bg-primarySoft border-primaryBorder flex-row gap-2.5">
          <Icon name="shield" size={18} color={colors.primary} />
          <Text className="text-base text-primary flex-1 leading-5">{t("owner.nsiaHint")}</Text>
        </Card>

        <AppButton
          label={t("owner.createDriverProfile")}
          icon="check"
          iconPosition="left"
          loading={addDriver.isPending}
          onPress={submit}
        />
      </View>
    </Screen>
  );
}
