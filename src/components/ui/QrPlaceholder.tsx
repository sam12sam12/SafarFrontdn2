import { View } from "react-native";

import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

type Props = {
  value: string;
  size?: number;
  className?: string;
};

const GRID = 21;

/** Deterministic faux-QR: real scanning is out of scope until the backend
 * issues signed ticket codes, but the block is stable per booking code so
 * two tickets never look alike. */
function buildCells(value: string): boolean[] {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return Array.from({ length: GRID * GRID }, (_, index) => {
    const row = Math.floor(index / GRID);
    const col = index % GRID;
    const isFinder =
      (row < 7 && col < 7) || (row < 7 && col >= GRID - 7) || (row >= GRID - 7 && col < 7);
    if (isFinder) {
      const nearEdge =
        row % 6 === 0 || col % 6 === 0 || (row % 6 >= 2 && row % 6 <= 4 && col % 6 >= 2 && col % 6 <= 4);
      return nearEdge;
    }
    hash = (hash * 1103515245 + 12345) >>> 0;
    return (hash >>> (index % 16)) % 3 === 0;
  });
}

export function QrPlaceholder({ value, size = 84, className }: Props) {
  const cells = buildCells(value);
  const cell = size / GRID;

  return (
    <View
      className={cn("bg-card p-1.5 rounded-sm", className)}
      style={{ width: size, height: size }}
      accessibilityLabel={`Ticket code ${value}`}
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap", width: size, height: size }}>
        {cells.map((filled, index) => (
          <View
            key={index}
            style={{
              width: cell,
              height: cell,
              backgroundColor: filled ? colors.text : "transparent",
            }}
          />
        ))}
      </View>
    </View>
  );
}
