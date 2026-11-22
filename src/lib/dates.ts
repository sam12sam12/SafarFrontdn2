import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

import "dayjs/locale/en";
import "dayjs/locale/fa";

import i18n from "@/utils/i18n";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(localeData);

export type AppLanguage = "en" | "fa" | "ps";

const DATE_LOCALES: Record<AppLanguage, string> = { en: "en", fa: "fa", ps: "ps" };
const ISO_DATE = "YYYY-MM-DD";
const EASTERN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** The demo is anchored to a fixed day so "Today / Tomorrow / in N days" never
 * drift with the wall clock while the seeded data is being reviewed. */
export const DEMO_TODAY = "2026-11-19";

/** Frozen "now" used by relative booking timestamps. */
export const DEMO_NOW = `${DEMO_TODAY}T18:00:00Z`;

/* Pashto is not shipped with dayjs, so the locale is registered here.
 * Weekday names deliberately use the Dari (Persian) forms: in Afghanistan the
 * Dari weekday names are the ones commonly spoken and written in Pashto too, so
 * Dari and Pashto render identical day names. Month names stay Pashto. */
const DARI_WEEKDAYS = ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
const DARI_WEEKDAYS_MIN = ["ی", "د", "س", "چ", "پ", "ج", "ش"];
const PS_MONTHS = [
  "جنوري",
  "فبروري",
  "مارچ",
  "اپرېل",
  "مې",
  "جون",
  "جولای",
  "اګست",
  "سپتمبر",
  "اکتوبر",
  "نومبر",
  "دسمبر",
];

dayjs.locale({
  name: "ps",
  weekdays: DARI_WEEKDAYS,
  weekdaysShort: DARI_WEEKDAYS,
  weekdaysMin: DARI_WEEKDAYS_MIN,
  months: PS_MONTHS,
  monthsShort: PS_MONTHS,
  weekStart: 6,
  formats: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "YYYY/MM/DD",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd, D MMMM YYYY HH:mm",
  },
  ordinal: (value: number) => `${value}`,
  relativeTime: {
    future: "په %s کې",
    past: "%s مخکې",
    s: "څو ثانیې",
    m: "یوه دقیقه",
    mm: "%d دقیقې",
    h: "یوه ساعت",
    hh: "%d ساعته",
    d: "یوه ورځ",
    dd: "%d ورځې",
    M: "یوه میاشت",
    MM: "%d میاشتې",
    y: "یو کال",
    yy: "%d کاله",
  },
}, undefined, true);

// registration above can change dayjs's global locale — keep the default stable
dayjs.locale("en");

export function appLanguage(lng?: string): AppLanguage {
  const base = (lng ?? i18n.language ?? "en").toLowerCase().split("-")[0];
  return base === "fa" || base === "ps" ? base : "en";
}

export function dateLocale(lng?: string) {
  return DATE_LOCALES[appLanguage(lng)];
}

/** Persian and Pashto write numerals with Eastern Arabic glyphs. */
function localizeDigits(value: string, lng?: string) {
  if (appLanguage(lng) === "en") return value;
  return value.replace(/\d/g, (digit) => EASTERN_DIGITS[Number(digit)] ?? digit);
}

/** Trip dates are calendar days, not instants: they are parsed and formatted in
 * UTC so a timezone or DST offset can never move a trip to another day. */
export function parseDate(dateISO: string): Dayjs {
  const parsed = dayjs.utc(dateISO, ISO_DATE, true);
  return parsed.isValid() ? parsed : dayjs.utc(DEMO_TODAY, ISO_DATE);
}

export function parseDateTime(isoDateTime: string): Dayjs {
  const parsed = dayjs.utc(isoDateTime);
  return parsed.isValid() ? parsed : dayjs.utc(DEMO_NOW);
}

export function toISODate(value: Dayjs) {
  return value.format(ISO_DATE);
}

export function addDaysISO(dateISO: string, days: number) {
  return toISODate(parseDate(dateISO).add(days, "day"));
}

export function tomorrowISO() {
  return addDaysISO(DEMO_TODAY, 1);
}

export function daysUntil(dateISO: string) {
  return Math.max(0, parseDate(dateISO).diff(parseDate(DEMO_TODAY), "day"));
}

export function isSameDay(a: string, b: string) {
  return parseDate(a).isSame(parseDate(b), "day");
}

export function isToday(dateISO: string) {
  return isSameDay(dateISO, DEMO_TODAY);
}

/** True for any day strictly before the demo "today" — the past. */
export function isPastDay(dateISO: string) {
  return parseDate(dateISO).isBefore(parseDate(DEMO_TODAY), "day");
}

/** Localize a number into the active language's digits ("19" → "۱۹"). */
export function localizeNumber(value: number | string, lng?: string) {
  return localizeDigits(String(value), lng);
}

/** Localized "MMMM YYYY" header, e.g. "November 2026" / "نومبر ۲۰۲۶". */
export function formatMonthYear(dateISO: string, lng?: string) {
  return formatDate(dateISO, "MMMM YYYY", lng);
}

/** Seven weekday initials, Saturday-first (the Afghan week start). */
export function weekdayInitials(lng?: string): string[] {
  const names = parseDate(DEMO_TODAY).locale(dateLocale(lng)).localeData().weekdaysMin();
  // dayjs returns Sunday-first; rotate so Saturday leads.
  return [names[6], names[0], names[1], names[2], names[3], names[4], names[5]];
}

/**
 * A 6×7 grid of ISO day strings for the month that contains `anchorISO`,
 * Saturday-first with `null` for the leading/trailing blank cells.
 */
export function monthGrid(anchorISO: string): (string | null)[] {
  const first = parseDate(anchorISO).startOf("month");
  // Column of the 1st: Saturday(6) → 0, Sunday(0) → 1, … Friday(5) → 6.
  const lead = (first.day() + 1) % 7;
  const total = first.daysInMonth();
  const cells: (string | null)[] = [];
  for (let i = 0; i < lead; i += 1) cells.push(null);
  for (let d = 0; d < total; d += 1) cells.push(toISODate(first.add(d, "day")));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Last selectable day of the month that contains `anchorISO`. */
export function endOfMonthISO(anchorISO: string) {
  return toISODate(parseDate(anchorISO).endOf("month"));
}

function formatDate(dateISO: string, pattern: string, lng?: string) {
  const formatted = parseDate(dateISO).locale(dateLocale(lng)).format(pattern);
  return localizeDigits(formatted, lng);
}

/** "Thu" / "پنجشنبه" / "پينځنۍ" */
export function formatWeekday(dateISO: string, lng?: string) {
  return formatDate(dateISO, "ddd", lng);
}

/** "19" / "۱۹" */
export function formatDayNumber(dateISO: string, lng?: string) {
  return formatDate(dateISO, "D", lng);
}

/** "19 Nov" / "۱۹ نوامبر" / "۱۹ نومبر" */
export function formatDayMonth(dateISO: string, lng?: string) {
  return formatDate(dateISO, "D MMM", lng);
}

/** "Thu 19 Nov" / "پنجشنبه ۱۹ نوامبر" / "پينځنۍ ۱۹ نومبر" */
export function formatTripDate(dateISO: string, lng?: string) {
  return formatDate(dateISO, "ddd D MMM", lng);
}

/** "19 Nov 2026" — history rows, receipts. */
export function formatDateWithYear(dateISO: string, lng?: string) {
  return formatDate(dateISO, "D MMM YYYY", lng);
}

/** Long form for headings: "Thursday, 19 November 2026". */
export function formatLongDate(dateISO: string, lng?: string) {
  return formatDate(dateISO, "dddd, D MMMM YYYY", lng);
}

/** Today / Tomorrow / Yesterday / weekday + day + month, already localized. */
export function formatRelativeDay(dateISO: string, lng?: string) {
  const day = parseDate(dateISO);
  const today = parseDate(DEMO_TODAY);
  const options = lng ? { lng } : undefined;

  if (day.isSame(today, "day")) return i18n.t("common.today", options);
  if (day.isSame(today.add(1, "day"), "day")) return i18n.t("common.tomorrow", options);
  if (day.isSame(today.subtract(1, "day"), "day")) return i18n.t("common.yesterday", options);
  return formatTripDate(dateISO, lng);
}

/** Relative timestamp in the active language: "12 minutes ago", "پریروز". */
export function formatRelativeDateTime(isoDateTime: string, lng?: string) {
  const anchor = parseDateTime(DEMO_NOW);
  const then = parseDateTime(isoDateTime);
  const moment = then.isAfter(anchor) ? anchor : then;
  return localizeDigits(moment.locale(dateLocale(lng)).from(anchor), lng);
}

