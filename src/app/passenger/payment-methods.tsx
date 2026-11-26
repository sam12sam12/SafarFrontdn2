import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { AppHeader } from "@/components/ui/AppHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { Screen } from "@/components/ui/Screen";
import type { PaymentMethod } from "@/lib/db/types";
import { useDefaultPaymentMethod, useSetDefaultPaymentMethod } from "@/lib/queries/passengersQueries";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

const METHODS: { value: PaymentMethod; titleKey: string; subKey: string; icon: IconName }[] = [
  { value: "hesabpay", titleKey: "paymentMethods.hesabpay", subKey: "paymentMethods.hesabpaySub", icon: "credit-card" },
  { value: "cash", titleKey: "paymentMethods.cash", subKey: "paymentMethods.cashSub", icon: "payments" },
];

export default function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const { data: selected } = useDefaultPaymentMethod();
  const setDefault = useSetDefaultPaymentMethod();

  return (
    <Screen contentClassName="pb-8">
      <AppHeader title={t("paymentMethods.title")} />

      <View className="px-4 gap-3">
        {METHODS.map((method) => {
          const active = selected === method.value;
          return (
            <Ripple
              key={method.value}
              onPress={() => setDefault.mutate(method.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t(method.titleKey)}
              className={cn(
                "flex-row items-start gap-3 rounded-lg border bg-card px-3.5 py-3.5",
                active ? "border-primary" : "border-border",
              )}
            >
              <View
                className={cn(
                  "w-5 h-5 rounded-full border items-center justify-center mt-0.5",
                  active ? "border-primary" : "border-secBorder",
                )}
              >
                {active ? <View className="w-2.5 h-2.5 rounded-full bg-primary" /> : null}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base font-bold text-text">{t(method.titleKey)}</Text>
                  {active ? <Badge label={t("paymentMethods.default")} tone="green" compact /> : null}
                </View>
                <Text className="text-xs text-secText mt-1 leading-4">{t(method.subKey)}</Text>
              </View>
              <Icon
                name={method.icon}
                size={19}
                color={active ? colors.primary : colors.secText}
              />
            </Ripple>
          );
        })}

        <Card flat className="flex-row items-start gap-2.5 bg-disable border-transparent mt-1">
          <Icon name="info-outline" size={17} color={colors.secText} />
          <Text className="text-sm text-secText flex-1 leading-5">{t("paymentMethods.note")}</Text>
        </Card>
      </View>
    </Screen>
  );
}
