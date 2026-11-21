import { Text, View } from "react-native";

import type { Booking, Trip } from "@/lib/db/types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Ripple } from "../ui/Ripple";
import { colors } from "@/utils/theme";

type Props = {
  booking: Booking;
  trip?: Trip;
  onAccept: () => void;
  onDecline: () => void;
  onOpen: () => void;
  busy?: boolean;
};

export function OwnerBookingCard({ booking, trip, onAccept, onDecline, onOpen, busy }: Props) {
  const paid = booking.paymentStatus === "paid";

  return (
    <Card className="gap-2.5">
      <View className="flex-row items-center gap-3">
        <Avatar initials={booking.initials} size="md" />
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-base-lg font-bold text-text" numberOfLines={1}>
              {booking.passengerName}
            </Text>
            {booking.thirdTrip ? <Badge label="3rd trip" tone="slate" compact /> : null}
          </View>
          <Text className="text-sm text-secText mt-0.5">
            {booking.code} · {booking.people} adult{booking.people > 1 ? "s" : ""}
            {booking.kids ? ` · ${booking.kids}` : ""}
          </Text>
        </View>
        <Ripple onPress={onOpen} accessibilityLabel={`Open ${booking.code}`} className="rounded-full">
          <Icon name="chevron-right" size={20} color={colors.muted} />
        </Ripple>
      </View>

      <View className="rounded-base bg-elevated border border-secBorder px-3 py-2.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-base-lg font-semibold text-text">
            {trip ? `${trip.from} → ${trip.to}` : "Highway trip"}
          </Text>
          <Badge
            label={trip?.service === "vip" ? "VIP whole car" : "Shared"}
            tone={trip?.service === "vip" ? "teal" : "blue"}
            compact
          />
        </View>
        <Text className="text-sm text-secText mt-1">
          {trip?.dateLabel ?? "—"} · {trip?.departTime} {trip?.departPeriod} · Seat{" "}
          {booking.seats.join(", ")}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View>
          <View className="flex-row items-baseline gap-1">
            <Text className="text-xl font-bold text-text">
              {booking.amount.toLocaleString("en-US")}
            </Text>
            <Text className="text-sm font-semibold text-secText">AFN</Text>
          </View>
          <Badge
            label={paid ? "Paid · HesabPay" : "Pays at agency"}
            tone={paid ? "green" : "amber"}
            compact
            className="mt-1"
          />
        </View>

        {booking.status === "new" ? (
          <View className="flex-row gap-2">
            <Ripple
              onPress={onDecline}
              disabled={busy}
              accessibilityLabel={`Decline ${booking.code}`}
              className="rounded-full border border-border px-3.5 py-2"
            >
              <Text className="text-base-lg font-semibold text-secText">Decline</Text>
            </Ripple>
            <Ripple
              onPress={onAccept}
              disabled={busy}
              accessibilityLabel={`Accept ${booking.code}`}
              className="rounded-full bg-primary px-3.5 py-2 shadow-button shadow-buttonShadow"
            >
              <Text className="text-base-lg font-bold text-onPrimary">Accept</Text>
            </Ripple>
          </View>
        ) : (
          <Badge
            label={booking.status === "cancelled" ? "Cancelled" : "Confirmed"}
            tone={booking.status === "cancelled" ? "red" : "green"}
            icon={booking.status === "cancelled" ? "cancel" : "check-circle"}
          />
        )}
      </View>
    </Card>
  );
}
