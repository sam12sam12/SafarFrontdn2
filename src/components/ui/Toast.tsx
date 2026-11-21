import { toast, Toaster } from "sonner-native";
import { useThemeStore } from "@/Stores/useThemeStore";

import { Icon } from "./Icon";

const TOAST_COLORS = {
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
} as const;

export function showToast(
  type: keyof typeof TOAST_COLORS,
  title: string,
  description?: string,
  action?: { label: string; onPress: () => void },
) {
  toast[type](title, {
    description,
    action: action && { label: action.label, onClick: action.onPress },
    styles: { title: { color: TOAST_COLORS[type] } },
  });
}

export function Toast() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Toaster
      closeButton
      theme={theme}
      icons={{
        success: <Icon name="check-circle" size={24} color={TOAST_COLORS.success} />,
        error: <Icon name="cancel" size={24} color={TOAST_COLORS.error} />,
        warning: <Icon name="warning" size={24} color={TOAST_COLORS.warning} />,
        info: <Icon name="info" size={24} color={TOAST_COLORS.info} />,
      }}
      toastOptions={{
        titleStyle: { fontWeight: "bold", marginBottom: 3, fontSize: 16 },
      }}
      style={{ borderRadius: 14, marginTop: 10 }}
      enableStacking
    />
  );
}
