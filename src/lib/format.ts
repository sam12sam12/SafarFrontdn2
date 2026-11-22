export function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

/** "1,200 AFN" is too long for the tight Figma rows, so money is rendered
 * as a number plus a small unit by the call sites that need it. */
export function formatAFN(value: number) {
  return `${formatNumber(value)} AFN`;
}

export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function seatList(seats: string[]) {
  if (seats.length === 1) return `Seat ${seats[0]}`;
  return `Seats ${seats.join(", ")}`;
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function cityPair(from: string, to: string) {
  return `${from} → ${to}`;
}

/** "01:15" + "PM" → "13:15" — storage always keeps a 24-hour clock. */
export function to24Hour(time: string, period: string) {
  const [hours, minutes] = time.split(":").map(Number);
  if (period === "AM") {
    return `${String(hours === 12 ? 0 : hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  return `${String(hours === 12 ? 12 : hours + 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function minusMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const total = (hours * 60 + mins - minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
