import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors TripCard: date row, driver, route strip, car row, fare + CTA. */
export function TripCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: rows }).map((_, index) => (
        <Card key={index} className="p-4">
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-1.5 flex-1">
              <Skeleton className="w-3 h-3 rounded-sm" />
              <Skeleton className="h-2.5 w-32" />
            </View>
            <Skeleton className="h-5 w-16 rounded-full" />
          </View>

          <View className="flex-row items-center gap-3 mt-3">
            <Skeleton className="w-11 h-11 rounded-full" />
            <View className="flex-1 gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </View>
          </View>

          <Skeleton className="h-[64px] w-full rounded-base mt-3" />

          <View className="flex-row items-center gap-2.5 mt-3">
            <Skeleton className="w-9 h-9 rounded-base" />
            <View className="flex-1 gap-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-24" />
            </View>
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </View>

          <View className="flex-row items-end justify-between gap-2 mt-3.5">
            <View className="gap-1.5">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-3 w-20" />
            </View>
            <Skeleton className="h-10 w-28 rounded-full" />
          </View>
        </Card>
      ))}
    </View>
  );
}
