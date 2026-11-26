import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { TripListSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import type { SavedPassengerRelation } from "@/lib/db/types";
import {
  useAddSavedPassenger,
  useRemoveSavedPassenger,
  useSavedPassengers,
} from "@/lib/queries/passengersQueries";
import { initialsOf } from "@/lib/format";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const RELATIONS: SavedPassengerRelation[] = ["family", "friend", "colleague"];

export default function SavedPassengersScreen() {
  const { t } = useTranslation();
  const passengersQuery = useSavedPassengers();
  const { data: passengers, isLoading } = passengersQuery;
  const addPassenger = useAddSavedPassenger();
  const removePassenger = useRemoveSavedPassenger();

  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState<SavedPassengerRelation>("family");

  const reset = () => {
    setName("");
    setPhone("");
    setRelation("family");
  };

  const save = () => {
    if (!name.trim()) {
      showToast("error", t("editProfile.nameRequired"), t("editProfile.nameRequiredSub"));
      return;
    }
    addPassenger.mutate(
      { name, phone, relation },
      {
        onSuccess: () => {
          showToast("success", t("savedPassengers.added"), t("savedPassengers.addedSub", { name: name.trim() }));
          setAddOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <Screen contentClassName="pb-8" refreshing={passengersQuery.isRefetching} onRefresh={passengersQuery.refetch}>
      <AppHeader title={t("savedPassengers.title")} subtitle={t("savedPassengers.subtitle")} />

      {isLoading ? (
        <TripListSkeleton rows={3} />
      ) : (
        <View className="px-4 gap-3">
          {(passengers ?? []).length === 0 ? (
            <EmptyState
              icon="group"
              title={t("savedPassengers.empty")}
              message={t("savedPassengers.emptySub")}
            />
          ) : (
            (passengers ?? []).map((passenger) => (
              <Card key={passenger.id} className="flex-row items-center gap-3 p-3.5">
                <Avatar initials={initialsOf(passenger.name)} size="md" />
                <View className="flex-1">
                  <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
                    {passenger.name}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-0.5">
                    <Text className="text-sm text-secText">{passenger.phone || "—"}</Text>
                    <View className="w-1 h-1 rounded-full bg-muted" />
                    <Text className="text-sm text-secText">
                      {t(`savedPassengers.${passenger.relation}`)}
                    </Text>
                  </View>
                </View>
                <Ripple
                  onPress={() => removePassenger.mutate(passenger.id)}
                  accessibilityLabel={t("savedPassengers.remove")}
                  className="w-9 h-9 rounded-full bg-errorSoft items-center justify-center"
                >
                  <Icon name="person-remove" size={17} color={colors.error} />
                </Ripple>
              </Card>
            ))
          )}

          <AppButton
            label={t("savedPassengers.add")}
            icon="person-add"
            iconPosition="left"
            variant="secondary"
            onPress={() => setAddOpen(true)}
          />
        </View>
      )}

      <BottomSheet
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        title={t("savedPassengers.add")}
      >
        <Field
          label={t("savedPassengers.name")}
          icon="badge"
          value={name}
          onChangeText={setName}
          placeholder={t("payment.namePlaceholder")}
        />
        <Field
          className="mt-3"
          label={t("savedPassengers.phone")}
          icon="phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder={t("payment.phonePlaceholder")}
        />

        <Text className="text-base-lg font-semibold text-text mt-4 mb-2">
          {t("savedPassengers.relation")}
        </Text>
        <View className="flex-row gap-2">
          {RELATIONS.map((value) => {
            const active = relation === value;
            return (
              <Ripple
                key={value}
                onPress={() => setRelation(value)}
                accessibilityLabel={t(`savedPassengers.${value}`)}
                accessibilityState={{ selected: active }}
                className={cn(
                  "flex-1 items-center rounded-full border px-3 py-2",
                  active ? "border-primary bg-primarySoft" : "border-border bg-card",
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-semibold",
                    active ? "text-primary" : "text-secText",
                  )}
                >
                  {t(`savedPassengers.${value}`)}
                </Text>
              </Ripple>
            );
          })}
        </View>

        <AppButton
          className="mt-5"
          label={t("savedPassengers.add")}
          icon="check"
          loading={addPassenger.isPending}
          onPress={save}
        />
      </BottomSheet>
    </Screen>
  );
}
