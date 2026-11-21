import { Stack } from "expo-router";
import { colors } from "@/utils/theme";

export default function OwnerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.mainBack },
      }}
    />
  );
}
