import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function DriverTripsSkeleton() {
  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between py-2">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </View>

      <View className="flex-row items-center gap-3 mt-2">
        <Skeleton className="w-12 h-12 rounded-base" />
        <View className="flex-1 gap-1.5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-5 w-52" />
        </View>
        <Skeleton className="w-10 h-10 rounded-full" />
      </View>

      <Skeleton className="h-[292px] w-full rounded-xl mt-4" />
      <Skeleton className="h-11 w-full rounded-full mt-3" />

      <View className="gap-3 mt-3">
        {[0, 1, 2].map((index) => (
          <Card key={index} className="flex-row gap-3 p-3">
            <Skeleton className="w-12 h-14 rounded-md" />
            <View className="flex-1 gap-2">
              <View className="flex-row justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </View>
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

export function DriverManifestSkeleton() {
  return (
    <View className="gap-3 mt-3">
      {[0, 1, 2, 3].map((index) => (
        <Card key={index} className="p-3.5 gap-2.5">
          <View className="flex-row items-center gap-3">
            <Skeleton className="w-12 h-14 rounded-md" />
            <View className="flex-1 gap-2">
              <View className="flex-row justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </View>
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-28" />
            </View>
          </View>
          <Skeleton className="h-3 w-full" />
        </Card>
      ))}
    </View>
  );
}

export function DriverTripDetailsSkeleton() {
  return (
    <View className="px-4 gap-3">
      <Skeleton className="h-[176px] w-full rounded-xl" />
      <Card className="gap-3">
        <View className="flex-row justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </View>
        <View className="flex-row justify-between">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </View>
        <Skeleton className="h-[340px] w-full rounded-[40px]" />
        <Skeleton className="h-9 w-full rounded-full" />
      </Card>
      <Card className="gap-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </Card>
      <Skeleton className="h-20 w-full rounded-lg" />
    </View>
  );
}

export function DriverStatsSkeleton() {
  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between mt-4">
        <View className="gap-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-7 w-32" />
        </View>
        <Skeleton className="h-9 w-28 rounded-full" />
      </View>
      <Skeleton className="h-11 w-full rounded-full mt-4" />
      <Skeleton className="h-[196px] w-full rounded-xl mt-3" />
      <View className="flex-row gap-2 mt-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-16 flex-1 rounded-lg" />
        ))}
      </View>
      <View className="flex-row gap-2 mt-2">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-16 flex-1 rounded-lg" />
        ))}
      </View>
      <Skeleton className="h-[230px] w-full rounded-lg mt-3" />
      <View className="flex-row gap-3 mt-3">
        <Skeleton className="h-36 flex-1 rounded-lg" />
        <Skeleton className="h-36 flex-1 rounded-lg" />
      </View>
      <Skeleton className="h-[220px] w-full rounded-lg mt-3" />
    </View>
  );
}

export function DriverProfileSkeleton() {
  return (
    <View className="px-4">
      <View className="flex-row items-center justify-between mt-4">
        <View className="gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-32" />
        </View>
        <View className="flex-row gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </View>
      </View>
      <Skeleton className="h-[218px] w-full rounded-lg mt-3" />
      <Skeleton className="h-[180px] w-full rounded-lg mt-3" />
      <Skeleton className="h-[214px] w-full rounded-lg mt-3" />
      <Skeleton className="h-[190px] w-full rounded-lg mt-3" />
      <Skeleton className="h-12 w-full rounded-base mt-3" />
    </View>
  );
}
