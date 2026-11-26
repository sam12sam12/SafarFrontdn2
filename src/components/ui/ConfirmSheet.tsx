import { useTranslation } from "react-i18next";
import { Text } from "react-native";

import { AppButton } from "./AppButton";
import { BottomSheet } from "./BottomSheet";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
};

/** One reusable yes/no sheet for destructive confirms (cancel a booking). */
export function ConfirmSheet({
  visible,
  onClose,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <Text className="text-base text-secText leading-6">{message}</Text>
      <AppButton
        label={confirmLabel}
        variant={danger === false ? "primary" : "danger"}
        className="mt-5"
        onPress={() => {
          onConfirm();
          onClose();
        }}
      />
      <AppButton
        label={cancelLabel ?? t("common.close")}
        variant="secondary"
        className="mt-2.5"
        onPress={onClose}
      />
    </BottomSheet>
  );
}
