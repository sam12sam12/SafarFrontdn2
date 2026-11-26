import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { TripCardSkeleton } from "./TripCardSkeleton";

export function TripListSkeleton({ rows = 3 }: { rows?: number }) {
  return <TripCardSkeleton rows={rows} />;
}

export function HomeSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Skeleton className="h-[132px] w-full rounded-[18px] mt-3" />
      <Skeleton className="h-3 w-16 mt-1" />
      <View className="flex-row gap-2">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </View>
      <TripCardSkeleton rows={2} />
    </View>
  );
}

export function BookingsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Skeleton className="h-11 w-full rounded-full" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <Skeleton className="h-[160px] w-full rounded-lg" />
      <Skeleton className="h-14 w-full rounded-lg" />
      <TripListSkeleton rows={1} />
    </View>
  );
}

export function TripDetailsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Card>
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </View>
        <Skeleton className="h-[64px] w-full rounded-base mt-3" />
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center gap-2">
            <Skeleton className="w-9 h-9 rounded-base" />
            <View className="gap-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </View>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Skeleton className="h-5 w-10 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </View>
        </View>
      </Card>

      <Skeleton className="h-[190px] w-full rounded-xl" />

      <Card className="gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-36" />
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </View>
        <Skeleton className="h-2 w-full rounded-full" />
      </Card>

      <Card className="gap-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    </View>
  );
}

export function SearchResultsSkeleton() {
  return <TripCardSkeleton rows={4} />;
}

export function SeatSelectionSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Skeleton className="h-[210px] w-full rounded-lg" />
      <Card className="gap-3">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-[300px] w-full rounded-[40px]" />
      </Card>
      <Skeleton className="h-[150px] w-full rounded-lg" />
    </View>
  );
}

export function PaymentSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Card className="gap-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-11 w-full" />
        <View className="flex-row gap-2">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 flex-1" />
        </View>
        <Skeleton className="h-11 w-full rounded-full" />
      </Card>
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-[190px] w-full rounded-lg" />
    </View>
  );
}

export function DriverDetailsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Card className="items-center gap-3">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-36" />
        <View className="flex-row gap-2 w-full">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 flex-1" />
        </View>
      </Card>
      <Skeleton className="h-[280px] w-full rounded-lg" />
      <Skeleton className="h-[210px] w-full rounded-lg" />
    </View>
  );
}

export function TrackingSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Card className="gap-3">
        <View className="flex-row items-start justify-between">
          <View className="gap-1.5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-36" />
          </View>
          <Skeleton className="h-6 w-24 rounded-full" />
        </View>
        <Skeleton className="h-2 w-full rounded-full mt-2" />
        <Skeleton className="h-12 w-full mt-2" />
      </Card>
      <Card className="flex-row items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-full" />
        <View className="flex-1 gap-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </View>
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </Card>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Card className="flex-row items-center gap-3">
        <Skeleton className="w-20 h-20 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </View>
      </Card>
      {[0, 1, 2].map((group) => (
        <View key={group} className="gap-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </View>
      ))}
    </View>
  );
}
