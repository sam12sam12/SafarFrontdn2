/**
 * Raw color values for the few places that cannot take a `className`
 * (icon `color` props, SVG fills, toast config, gradient stops).
 * Keep in sync with `UniwindTokens/colors.css` — that file is the source of truth.
 */
export const colors = {
  mainBack: "#F5F8FD",
  card: "#FFFFFF",
  text: "#0B1220",
  secText: "#64748B",
  muted: "#94A3B8",
  violet: "#6366F1",
  placeholder: "#A8B3C4",
  slate: "#CBD5E1",
  primary: "#1D4ED8",
  primaryDark: "#1E3A8A",
  primaryLight: "#3B82F6",
  primarySoft: "#EAF1FF",
  primaryBorder: "#CBDCFB",
  mapGrid: "#DCE8FA",
  gradientStart: "#EAF3FF",
  gradientMid: "#F7FAFE",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  teal: "#0F766E",
  onPrimary: "#FFFFFF",
} as const;
