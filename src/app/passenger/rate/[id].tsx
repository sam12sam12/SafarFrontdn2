import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { TripDetailsSkeleton } from "@/components/skeletons/PassengerSkeletons";
import { AppButton } from "@/components/ui/AppButton";
import { AppHeader } from "@/components/ui/AppHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import { showToast } from "@/components/ui/Toast";
import { useBooking, useRateBooking } from "@/lib/queries/bookingsQueries";
import { useDriver } from "@/lib/queries/driversQueries";
import { useTrip } from "@/lib/queries/tripsQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const STARS = [1, 2, 3, 4, 5];

export default function RateTripScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bookingQuery = useBooking(id);
  const { data: booking } = bookingQuery;
  const { data: trip } = useTrip(booking?.tripId);
  const { data: driver } = useDriver(trip?.driverId);
  const rateBooking = useRateBooking();

  // An existing rating pre-fills the form; edits live in the local draft.
  const [draft, setDraft] = useState<{ rating: number; review: string } | null>(null);
  const rating = draft?.rating ?? booking?.rating ?? 0;
  const review = draft?.review ?? booking?.review ?? "";
  const setRating = (value: number) => setDraft({ rating: value, review });
  const setReview = (value: string) => setDraft({ rating, review: value });

  const submit = () => {
    if (rating === 0) {
      showToast("warning", t("rate.pickStars"), t("rate.pickStarsSub"));
      return;
    }
    rateBooking.mutate(
      { bookingId: id, rating, review },
      {
        onSuccess: () => {
          showToast("success", t("rate.saved"), t("rate.savedSub"));
          router.back();
        },
      },
    );
  };

  return (
    <Screen contentClassName="pb-8">
      <AppHeader title={t("rate.title")} />

      {bookingQuery.isLoading || !booking ? (
        <TripDetailsSkeleton />
      ) : (
        <View className="px-4">
          <Card className="items-center">
            <Avatar
              initials={driver?.initials ?? "AP"}
              photo={driver?.photo}
              size="lg"
              verified={Boolean(driver)}
            />
            <Text className="text-lg font-bold text-text mt-3">
              {driver?.name ?? t("common.highwayCaptain")}
            </Text>
            <Text className="text-sm text-secText mt-1">
              {t(`common.${trip?.from.toLowerCase() ?? "kandahar"}`)} →{" "}
              {t(`common.${trip?.to.toLowerCase() ?? "kabul"}`)} · {booking.code}
            </Text>

            <View className="flex-row items-center gap-2 mt-5">
              {STARS.map((value) => (
                <Ripple
                  key={value}
                  onPress={() => setRating(value)}
                  accessibilityLabel={t("rate.stars", { count: value })}
                  accessibilityState={{ selected: rating >= value }}
                  className="p-1"
                >
                  <Icon
                    name={rating >= value ? "star" : "star-border"}
                    size={34}
                    color={rating >= value ? colors.warning : colors.muted}
                  />
                </Ripple>
              ))}
            </View>
            <Text className={cn("text-sm mt-2", rating > 0 ? "text-text font-semibold" : "text-muted")}>
              {rating > 0 ? t(`rate.label${rating}`) : t("rate.tapToRate")}
            </Text>
          </Card>

          <Field
            className="mt-3"
            label={t("rate.review")}
            placeholder={t("rate.reviewPlaceholder")}
            value={review}
            onChangeText={setReview}
            multiline
          />

          <AppButton
            className="mt-4"
            label={t("rate.submit")}
            icon="send"
            loading={rateBooking.isPending}
            onPress={submit}
          />
        </View>
      )}
    </Screen>
  );
}
