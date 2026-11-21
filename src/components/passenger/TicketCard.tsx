import { Text, View } from "react-native";

import type { Booking, Trip } from "@/lib/db/types";
import { seatList } from "@/lib/format";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { QrPlaceholder } from "../ui/QrPlaceholder";
import { colors } from "@/utils/theme";

type Props = {
  booking: Booking;
  trip?: Trip;
  className?: string;
};

export function TicketCard({ booking, trip, className }: Props) {
  const paid = booking.paymentStatus === "paid";

  return (
    <Card className={className}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-base bg-primary items-center justify-center">
            <Icon name="route" size={17} color={colors.onPrimary} />
          </View>
          <View>
            <Text className="text-2xs font-bold uppercase tracking-[1.2px] text-muted">
              Your next trip
            </Text>
            <Text className="text-base-lg font-bold text-text">
              {trip ? `${trip.from} → ${trip.to}` : "Highway journey"}
            </Text>
          </View>
        </View>
        <Badge
          label={paid ? "Paid" : "Due at boarding"}
          tone={paid ? "green" : "amber"}
          icon={paid ? "verified" : "payments"}
        />
      </View>

      <View className="flex-row items-center justify-between mt-3.5">
        <View>
          <Text className="text-2xl font-bold text-text">
            {trip?.departTime ?? "06:30"}
            <Text className="text-sm font-semibold text-secText">
              {" "}{trip?.departPeriod ?? "AM"}
            </Text>
          </Text>
          <Text className="text-sm font-semibold text-primary">{trip?.from ?? "Kandahar"}</Text>
        </View>

        <View className="flex-1 items-center px-2">
          <Text className="text-xs text-muted">{trip?.duration ?? "6h 45m"}</Text>
          <View className="flex-row items-center w-full my-1">
            <View className="w-1.5 h-1.5 rounded-full bg-primary" />
            <View className="flex-1 h-[2px] bg-primaryBorder" />
            <Icon name="directions-car" size={14} color={colors.primary} />
            <View className="flex-1 h-[2px] bg-primaryBorder" />
            <View className="w-1.5 h-1.5 rounded-full bg-primary" />
          </View>
          <Text className="text-sm text-secText">{trip?.dateLabel ?? "Sat 21 Nov"}</Text>
        </View>

        <View className="items-end">
          <Text className="text-2xl font-bold text-text">
            {trip?.arriveTime ?? "01:15"}
            <Text className="text-sm font-semibold text-secText">
              {" "}{trip?.arrivePeriod ?? "PM"}
            </Text>
          </Text>
          <Text className="text-sm font-semibold text-primary">{trip?.to ?? "Kabul"}</Text>
        </View>
      </View>

      <View className="flex-row items-center my-3.5">
        <View className="flex-1 h-[1px] bg-border" />
        <View className="w-3 h-3 rounded-full bg-mainBack -ml-1.5" />
        <View className="w-6" />
        <View className="w-3 h-3 rounded-full bg-mainBack -mr-1.5" />
        <View className="flex-1 h-[1px] bg-border" />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="gap-1.5 flex-1">
          <Text className="text-2xs font-bold uppercase tracking-[1px] text-muted">Passenger</Text>
          <Text className="text-base-lg font-bold text-text">{booking.passengerName}</Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <Text className="text-sm text-secText">{seatList(booking.seats)}</Text>
            <View className="w-1 h-1 rounded-full bg-muted" />
            <Text className="text-sm text-secText">Plate {trip?.vehiclePlate ?? "KDR-45210"}</Text>
          </View>
          <View className="flex-row items-baseline gap-1 mt-1">
            <Text className="text-lg font-bold text-text">
              {booking.amount.toLocaleString("en-US")}
            </Text>
            <Text className="text-sm font-semibold text-secText">AFN</Text>
            <Text className="text-sm text-muted">· {booking.code}</Text>
          </View>
        </View>

        <QrPlaceholder value={booking.code} size={78} />
      </View>
    </Card>
  );
}
