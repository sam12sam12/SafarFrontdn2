# Express Highway — Project Guide

Intercity ride booking for the Kabul ⇄ Kandahar corridor (Highway 1). React Native + Expo Router, TypeScript strict, **bun** as package manager.

## Stack

- Expo SDK 58, React Native 0.88, React 19.3, Expo Router (typed routes). Tabs come from `expo-router/js-tabs`.
- **Uniwind** (Tailwind CSS v4 for React Native) for all styling — `className` props, tokens from `src/utils/UniwindTokens/`.
- **TanStack Query** for all reads/writes. There is **no backend yet**: a mock database in `src/lib/db/` stands in for it (see below).
- `sonner-native` for toasts (`showToast` from `src/components/ui/Toast`), Reanimated for motion.
- Maps are drawn with `react-native-svg` (`MapPanel`) — no map SDK, so no API keys are needed for builds.
- Dev build: `eas build --profile development --platform android` (no OTA/`expo-updates` yet; add with `eas update:configure` when needed).

## Structuree

```
src/
  app/                     # Expo Router routes ONLY
    index.tsx              # splash / onboarding + role entry
    passenger/             # rider app: (tabs) + trip, seats, checkout, tracking…
    driver/                # driver app: (tabs) trips, manifest, stats, profile + trip/[id]
    owner/                 # agency app: (tabs) trips, bookings, drivers, stats + forms
  components/
    ui/                    # design-system primitives (Card, Button, Badge, …)
    passenger/ driver/ owner/   # composed, screen-specific sections
  lib/
    db/                    # mock database: types, seed data, query helpers
    queries/               # TanStack Query keys + hooks (one file per domain)
    format.ts              # money/time/date formatters
  Stores/                  # session + role (zustand)
  utils/UniwindTokens/     # colors.css, tokens.css
  utils/theme.ts           # raw color values for icon/SVG props (mirror of colors.css)
```

## Rules

- **Design tokens only.** No hex/rgba in components — use `bg-primary`, `text-secText`, `border-border`, `bg-primarySoft`, `text-success`, etc. Raw values belong in `colors.css`; props that can't take a `className` (icon `color`, SVG fills) use `colors` from `@/utils/theme`.
- **Every UI-chrome string goes through `t()`.** Locales live in `src/utils/i18n/locales/{en,fa,ps}.json`, one shared key namespace per role/screen area (`common`, `tabs`, `home`, `trip`, `tracking`, `support`, `about`, `payment`, `driver`, `owner`, …), kept in exact key-parity across all three files. Mock **data content** (seed rows, driver reviews, FAQ-style const arrays) is the one exemption — it stands in for a future backend response, not UI copy.
- **Every screen that reads a query hook gates on `isLoading`** and renders the matching skeleton from `src/components/skeletons/{Passenger,Driver,Owner}Skeletons.tsx` instead of a blank/undefined flash.
- **Mock data is the single source of truth** while there is no backend: read through `src/lib/queries/*` hooks, never import seed arrays directly in a screen. Mutations must go through the mock DB helpers so the query cache invalidation stays honest.
- **One component per file**, named export matching the file; screen-specific sections live next to their screen in `components/<role>/`.
- Money is AFN, formatted with `formatAFN`. Times are `HH:MM AM/PM` strings in the seed data — keep them consistent.
- Lists: `@shopify/flash-list` for long lists; static 3–8 item lists on a screen can be `.map()`.
- Every tappable element has pressed feedback (`Ripple` / `Pressable`) and an accessibility label.

## Screens (Figma parity)

Passenger: splash/onboarding, home, search results, trip details, seat selection, checkout, booking confirmed, bookings, live tracking, profile, support, about, driver details.
Driver: trips, manifest, stats, profile.
Owner: trips, bookings, drivers, stats, schedule trip, add driver, manage trip, booking details, driver profile.
