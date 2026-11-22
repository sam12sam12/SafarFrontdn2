import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppButton } from "@/components/ui/AppButton";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { showToast } from "@/components/ui/Toast";
import { Toggle } from "@/components/ui/Toggle";
import type { City } from "@/lib/db/types";
import { useAddDriver } from "@/lib/queries/driversQueries";
import { dismissLoading, showLoading } from "@/Stores/useLoadingStore";
import { colors } from "@/utils/theme";

export default function AddDriverScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const addDriver = useAddDriver();

  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [phone, setPhone] = useState("");
  const [tazkira, setTazkira] = useState("");
  const [licenceNo, setLicenceNo] = useState("");
  const [licenceExpiry, setLicenceExpiry] = useState("");
  const [permitExpiry, setPermitExpiry] = useState("");
  const [base, setBase] = useState<City>("Kandahar");
  const [pay, setPay] = useState("1500");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [invite, setInvite] = useState(true);

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
    } catch {
      showToast("error", t("owner.addPhoto"), t("owner.tryAgain"));
    }
  };

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
        fatherName: fatherName.trim() || undefined,
        tazkiraNo: tazkira.trim() || undefined,
        licenceNo: licenceNo.trim() || undefined,
        licenceExpiry: licenceExpiry.trim() || undefined,
        permitExpiry: permitExpiry.trim() || undefined,
        nameRelation: emergencyName.trim() || undefined,
        photoUri: photo,
      });
      dismissLoading();
      showToast("success", t("owner.driverAdded"), t("owner.driverAddedSub", { name: name.trim() }));
      if (invite) {
        showToast("success", t("owner.smsSent"), t("owner.smsSentSub", { phone: phone.trim() }));
      }
      router.back();
    } catch {
      dismissLoading();
      showToast("error", t("owner.couldNotAddDriver"), t("owner.tryAgain"));
    }
  };

  return (
    <Screen
      contentClassName="pb-8"
      footer={
        <View className="flex-row gap-2.5 px-4 py-3 bg-mainBack border-t border-border">
          <AppButton
            label={t("owner.cancel")}
            variant="secondary"
            className="flex-1"
            onPress={() => router.back()}
          />
          <AppButton
            label={t("owner.addDriverSubmit")}
            className="flex-[1.5]"
            loading={addDriver.isPending}
            onPress={submit}
          />
        </View>
      }
    >
      <View className="flex-row items-center gap-3 px-4 pt-3 pb-4">
        <Ripple
          onPress={() => router.back()}
          accessibilityLabel={t("common.close")}
          className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
        >
          <Icon name="close" size={19} color={colors.text} />
        </Ripple>
      </View>

      <View className="px-4">
        <Text className="text-3xl font-bold text-text">{t("owner.addDriverTitle")}</Text>
        <Text className="text-base text-secText mt-1">{t("owner.addDriverSub")}</Text>

        <View className="items-center mt-5 gap-2">
          <Ripple
            onPress={pickPhoto}
            accessibilityLabel={t("owner.addPhoto")}
            className="w-24 h-24 rounded-full border border-dashed border-primaryBorder bg-primarySoft items-center justify-center overflow-hidden"
          >
            {photo ? (
              <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            ) : (
              <>
                <Icon name="photo-camera" size={22} color={colors.primary} />
                <Text className="text-2xs font-bold text-primary mt-1">{t("owner.addPhoto")}</Text>
              </>
            )}
          </Ripple>
          <Text className="text-sm text-secText text-center">{t("owner.addPhotoHint")}</Text>
        </View>

        <View className="gap-3 mt-5">
          <Card className="gap-3">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              {t("owner.personalDetails")}
            </Text>
            <Field
              label={t("owner.fullName")}
              placeholder={t("owner.fullNamePlaceholder")}
              value={name}
              onChangeText={setName}
            />
            <Field
              label={t("owner.fatherName")}
              placeholder={t("owner.fatherNamePlaceholder")}
              value={fatherName}
              onChangeText={setFatherName}
            />
            <Field
              label={t("owner.mobileNumber")}
              placeholder="70 000 0000"
              value={phone}
              onChangeText={setPhone}
              prefix="+93"
              keyboardType="phone-pad"
            />
            <Field
              label={t("owner.tazkiraNumber")}
              placeholder={t("owner.tazkiraPlaceholder")}
              value={tazkira}
              onChangeText={setTazkira}
            />
          </Card>

          <Card className="gap-3">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              {t("owner.licencePermits")}
            </Text>
            <Field
              label={t("owner.licenceNumber")}
              placeholder={t("owner.licenceNumber")}
              value={licenceNo}
              onChangeText={setLicenceNo}
            />
            <View className="flex-row gap-2.5">
              <Field
                className="flex-1"
                label={t("owner.licenceExpires")}
                placeholder="mm/dd/yyyy"
                value={licenceExpiry}
                onChangeText={setLicenceExpiry}
                right={<Icon name="calendar-today" size={16} color={colors.muted} />}
              />
              <Field
                className="flex-1"
                label={t("owner.permitExpires")}
                placeholder="mm/dd/yyyy"
                value={permitExpiry}
                onChangeText={setPermitExpiry}
                right={<Icon name="calendar-today" size={16} color={colors.muted} />}
              />
            </View>
            <View className="flex-row gap-2.5">
              {[
                { icon: "file-upload" as const, label: t("owner.photoLicence") },
                { icon: "file-upload" as const, label: t("owner.photoTazkira") },
              ].map((box) => (
                <Ripple
                  key={box.label}
                  onPress={() => showToast("info", box.label, t("owner.documentsHint"))}
                  accessibilityLabel={box.label}
                  className="flex-1 items-center gap-1 rounded-base border border-dashed border-primaryBorder py-4"
                >
                  <Icon name={box.icon} size={18} color={colors.primary} />
                  <Text className="text-2xs font-semibold text-primary">{box.label}</Text>
                </Ripple>
              ))}
            </View>
            <Text className="text-2xs text-muted">{t("owner.docsReminder")}</Text>
          </Card>

          <Card className="gap-3">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              {t("owner.workSection")}
            </Text>
            <Text className="text-base-lg font-semibold text-text">{t("owner.homeBase")}</Text>
            <Segmented
              options={[
                { label: t("common.kandahar"), value: "Kandahar" },
                { label: t("common.kabul"), value: "Kabul" },
              ]}
              value={base}
              onChange={(value) => setBase(value as City)}
            />

            <Text className="text-base-lg font-semibold text-text">{t("owner.car")}</Text>
            <Ripple
              onPress={() => showToast("info", t("owner.car"), t("owner.noCarHint", { count: 10 }))}
              accessibilityLabel={t("owner.car")}
              className="flex-row items-center justify-between rounded-base bg-elevated border border-border px-3 py-3"
            >
              <Text className="text-base-lg text-secText">{t("owner.noCarBackup")}</Text>
              <Icon name="expand-more" size={20} color={colors.muted} />
            </Ripple>
            <Text className="text-2xs text-muted">{t("owner.noCarHint", { count: 10 })}</Text>

            <Field
              label={t("owner.payPerTrip")}
              value={pay}
              onChangeText={setPay}
              keyboardType="number-pad"
              right={<Text className="text-sm font-semibold text-muted">{t("owner.payPerTripHint")}</Text>}
            />
          </Card>

          <Card className="gap-3">
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              {t("owner.emergencySection")}
            </Text>
            <View className="flex-row gap-2.5">
              <Field
                className="flex-1"
                label={t("owner.nameRelation")}
                placeholder={t("owner.nameRelationPlaceholder")}
                value={emergencyName}
                onChangeText={setEmergencyName}
              />
              <Field
                className="flex-1"
                label={t("owner.phone")}
                placeholder={t("owner.phonePlaceholder")}
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                keyboardType="phone-pad"
              />
            </View>
          </Card>

          <Card className="gap-2.5">
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <Text className="text-base-lg font-bold text-text">{t("owner.sendSmsInvite")}</Text>
                <Text className="text-sm text-secText mt-0.5">{t("owner.sendSmsInviteSub")}</Text>
              </View>
              <Toggle
                value={invite}
                onChange={setInvite}
                accessibilityLabel={t("owner.sendSmsInvite")}
              />
            </View>
            <View className="rounded-base bg-disable px-3 py-2.5">
              <Text className="text-base text-secText leading-5">{t("owner.smsPreview")}</Text>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
