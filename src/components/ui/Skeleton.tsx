import { useEffect, useRef } from "react";
import { Animated } from "react-native";

import { cn } from "@/utils/cn";

type Props = {
  className?: string;
};

export function Skeleton({ className }: Props) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 720,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 720,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className={cn("bg-skeleton rounded-base", className)}
    />
  );
}
