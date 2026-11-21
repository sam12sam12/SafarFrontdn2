import { Text } from "react-native";

import type { Seat } from "@/lib/db/types";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";
import { Ripple } from "./Ripple";
import { colors } from "@/utils/theme";

type Props = {
  seat: Seat;
  selected?: boolean;
  onPress?: () => void;
  compact?: boolean;
};

export function SeatTile({ seat, selected, onPress, compact }: Props) {
  const isDriver = seat.status === "driver";
  const isPaid = seat.status === "paid";
  const isDue = seat.status === "due";
  const isWalkIn = seat.status === "walk-in";
  const isAvailable = seat.status === "available";

  const shell = isDriver
    ? "bg-text border-text"
    : selected
      ? "bg-primary border-primary"
      : isPaid
        ? "bg-primary border-primary"
        : isDue
          ? "bg-warningSoft border-warning"
          : isWalkIn
            ? "bg-elevated border-border border-dashed"
            : "bg-card border-primaryBorder";

  const strongText = isDriver || selected || isPaid ? "text-onPrimary" : "text-text";
  const softText = isDriver || selected || isPaid ? "text-onPrimary/70" : "text-secText";

  return (
    <Ripple
      onPress={onPress}
      disabled={!isAvailable || isDriver}
      accessibilityLabel={`Seat ${seat.id}${seat.occupant ? `, ${seat.occupant}` : ", available"}`}
      className={cn(
        "flex-1 rounded-base border items-center justify-center",
        compact ? "py-2.5 px-2" : "py-3 px-2",
        shell,
      )}
    >
      {isDriver ? (
        <>
          <Icon name="sports-motorsports" size={18} color={colors.onPrimary} />
          <Text className="text-sm font-semibold text-onPrimary mt-1">You (Driver)</Text>
        </>
      ) : (
        <>
          <Text
            className={cn("text-2xs font-bold tracking-[0.8px] uppercase", softText)}
            numberOfLines={1}
          >
            {seat.legroom ? "Front VIP" : `Seat ${seat.id}`}
          </Text>
          <Text
            className={cn("text-base-lg font-bold mt-0.5", strongText)}
            numberOfLines={1}
          >
            {seat.occupant ?? `Seat ${seat.id}`}
          </Text>
          <Text className={cn("text-xs mt-0.5", softText)} numberOfLines={1}>
            {isAvailable
              ? `${seat.price.toLocaleString("en-US")} AFN`
              : isWalkIn
                ? "+ Walk-in"
                : isDue
                  ? `Due ${seat.price.toLocaleString("en-US")}`
                  : `✓ Paid`}
          </Text>
        </>
      )}
    </Ripple>
  );
}
