import { useMemo } from "react";
import { View } from "react-native";

import { cn } from "@/utils/cn";

type Props = {
  value: string;
  className?: string;
  height?: number;
};

export function Barcode({ value, className, height = 30 }: Props) {
  const bars = useMemo(() => {
    let hash = 7;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 131 + value.charCodeAt(index)) >>> 0;
    }
    return Array.from({ length: 44 }, (_, index) => {
      hash = (hash * 1103515245 + 12345) >>> 0;
      const width = 1 + ((hash >>> (index % 12)) % 3);
      const tall = ((hash >>> (index % 7)) & 1) === 0;
      return { width, tall };
    });
  }, [value]);

  return (
    <View className={cn("flex-row items-end", className)} style={{ height }}>
      {bars.map((bar, index) => (
        <View
          key={index}
          className="bg-text mr-[1.5px] rounded-[0.5px]"
          style={{ width: bar.width, height: bar.tall ? height : height * 0.78 }}
        />
      ))}
    </View>
  );
}
