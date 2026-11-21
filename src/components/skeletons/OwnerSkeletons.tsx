import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function RowSkeleton() {
  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <View className="flex-1 gap-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </View>
        <Skeleton className="h-6 w-16 rounded-full" />
      </View>
    </Card>
  );
}

export function OwnerTripsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <View className="flex-row items-center justify-between py-2">
        <View className="flex-row items-center gap-2.5">
          <Skeleton className="w-10 h-10 rounded-base" />
          <View className="gap-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </View>
        </View>
        <Skeleton className="w-9 h-9 rounded-full" />
      </View>
      <View className="flex-row gap-2.5">
        <Skeleton className="h-20 flex-1 rounded-lg" />
        <Skeleton className="h-20 flex-1 rounded-lg" />
      </View>
      <View className="flex-row gap-2.5">
        <Skeleton className="h-20 flex-1 rounded-lg" />
        <Skeleton className="h-20 flex-1 rounded-lg" />
      </View>
      <View className="flex-row gap-2 mt-1">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 flex-1 rounded-base" />
        ))}
      </View>
      <Skeleton className="h-9 w-full rounded-full" />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </View>
  );
}

export function OwnerBookingsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <View className="gap-1.5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-48" />
      </View>
      <Skeleton className="h-11 w-full rounded-base" />
      <View className="flex-row gap-2.5">
        <Skeleton className="h-20 flex-1 rounded-lg" />
        <Skeleton className="h-20 flex-1 rounded-lg" />
      </View>
      <Skeleton className="h-9 w-full rounded-full" />
      <Skeleton className="h-9 w-full rounded-full" />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </View>
  );
}

export function OwnerDriversSkeleton() {
  return (
    <View className="px-4 gap-3">
      <View className="gap-1.5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-44" />
      </View>
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-11 w-full rounded-base" />
      <Skeleton className="h-9 w-full rounded-full" />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
      <RowSkeleton />
    </View>
  );
}

export function OwnerStatsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <View className="gap-1.5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-48" />
      </View>
      <Skeleton className="h-9 w-full rounded-full" />
      <Skeleton className="h-[160px] w-full rounded-xl" />
      <View className="flex-row gap-2.5">
        <Skeleton className="h-20 flex-1 rounded-lg" />
        <Skeleton className="h-20 flex-1 rounded-lg" />
      </View>
      <View className="flex-row gap-2.5">
        <Skeleton className="h-20 flex-1 rounded-lg" />
        <Skeleton className="h-20 flex-1 rounded-lg" />
      </View>
      <Card className="gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[120px] w-full" />
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </Card>
    </View>
  );
}

export function OwnerManageTripSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-10 rounded-base" />
          <Skeleton className="h-8 w-20" />
        </View>
        <Skeleton className="h-6 w-full rounded-full" />
      </Card>
      <Card className="flex-row items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-full" />
        <View className="flex-1 gap-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-28" />
        </View>
        <Skeleton className="h-6 w-20 rounded-full" />
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-4 w-24" />
        <View className="flex-row gap-2">
          <Skeleton className="h-14 flex-1 rounded-md" />
          <Skeleton className="h-14 flex-1 rounded-md" />
        </View>
        <View className="flex-row gap-2">
          <Skeleton className="h-14 flex-1 rounded-md" />
          <Skeleton className="h-14 flex-1 rounded-md" />
        </View>
        <Skeleton className="h-16 w-full" />
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </Card>
    </View>
  );
}

export function OwnerBookingDetailsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Card className="gap-3">
        <View className="flex-row items-center gap-3">
          <Skeleton className="w-14 h-14 rounded-full" />
          <View className="flex-1 gap-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-28" />
          </View>
        </View>
        <View className="flex-row gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </View>
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-16 w-full" />
      </Card>
      <View className="flex-row gap-2.5">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 flex-1 rounded-full" />
      </View>
    </View>
  );
}

export function OwnerDriverProfileSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Card className="items-center gap-2 py-5">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-28" />
      </Card>
      <View className="flex-row gap-2.5">
        <Skeleton className="h-16 flex-1 rounded-lg" />
        <Skeleton className="h-16 flex-1 rounded-lg" />
        <Skeleton className="h-16 flex-1 rounded-lg" />
      </View>
      <Card className="gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-14 w-full" />
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    </View>
  );
}
