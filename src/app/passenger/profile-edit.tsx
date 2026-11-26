import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { ProfileSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useProfile, useUpdateProfile } from "@/lib/queries/statsQueries";

export default function EditProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const profileQuery = useProfile();
  const { data: profile, isLoading } = profileQuery;
  const updateProfile = useUpdateProfile();

  // Editing starts from the loaded profile; the draft only exists once typed.
  const [draft, setDraft] = useState<{ name: string; phone: string; email: string } | null>(null);
  const values = draft ?? {
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    email: profile?.email ?? "",
  };
  const update = (key: "name" | "phone" | "email", value: string) =>
    setDraft({ ...values, [key]: value });

  const save = () => {
    if (!values.name.trim()) {
      showToast("error", t("editProfile.nameRequired"), t("editProfile.nameRequiredSub"));
      return;
    }
    updateProfile.mutate(
      { name: values.name, phone: values.phone, email: values.email },
      {
        onSuccess: () => {
          showToast("success", t("editProfile.saved"), t("editProfile.savedSub"));
          router.back();
        },
      },
    );
  };

  return (
    <Screen contentClassName="pb-8" refreshing={profileQuery.isRefetching} onRefresh={profileQuery.refetch}>
      <AppHeader title={t("editProfile.title")} />

      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <View className="px-4">
          <Card>
            <View className="items-center">
              <Avatar
                initials={profile?.initials ?? "AP"}
                photo={require("@/assets/images/passenger.jpg")}
                size="lg"
                verified
              />
            </View>

            <Field
              className="mt-4"
              label={t("editProfile.name")}
              icon="badge"
              value={values.name}
              onChangeText={(value) => update("name", value)}
              placeholder={t("payment.namePlaceholder")}
            />
            <Field
              className="mt-3"
              label={t("editProfile.phone")}
              icon="phone"
              keyboardType="phone-pad"
              value={values.phone}
              onChangeText={(value) => update("phone", value)}
              placeholder={t("payment.phonePlaceholder")}
            />
            <Field
              className="mt-3"
              label={t("editProfile.email")}
              icon="mail-outline"
              keyboardType="email-address"
              value={values.email}
              onChangeText={(value) => update("email", value)}
              placeholder="name@example.com"
            />
          </Card>

          <AppButton
            className="mt-4"
            label={t("editProfile.save")}
            icon="check"
            loading={updateProfile.isPending}
            onPress={save}
          />
        </View>
      )}
    </Screen>
  );
}
