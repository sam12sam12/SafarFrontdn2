import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Icon } from "@/components/ui/Icon";
import { Ripple } from "@/components/ui/Ripple";
import { cn } from "@/utils/cn";
import { colors } from "@/utils/theme";

export type RouteFilter = "all" | "to-kabul" | "to-kandahar";
export type KindFilter = "all" | "shared" | "vip";
export type StatusFilter = "all" | "on-road" | "boarding" | "scheduled" | "full" | "needs-driver";

type IconName = Parameters<typeof Icon>[0]["name"];
type Option<T> = { value: T; labelKey: string; icon: IconName };

const ROUTE_OPTIONS: Option<RouteFilter>[] = [
  { value: "all", labelKey: "owner.allRoutes", icon: "swap-horiz" },
  { value: "to-kabul", labelKey: "home.routeToKabul", icon: "arrow-forward" },
  { value: "to-kandahar", labelKey: "home.routeToKandahar", icon: "arrow-forward" },
];

const KIND_OPTIONS: Option<KindFilter>[] = [
  { value: "all", labelKey: "owner.allKinds", icon: "filter-list" },
  { value: "shared", labelKey: "owner.bookingFilterShared", icon: "groups" },
  { value: "vip", labelKey: "owner.bookingFilterVip", icon: "star" },
];

const STATUS_OPTIONS: Option<StatusFilter>[] = [
  { value: "all", labelKey: "owner.allStatuses", icon: "filter-list" },
  { value: "on-road", labelKey: "owner.filterOnRoad", icon: "near-me" },
  { value: "boarding", labelKey: "owner.filterBoarding", icon: "login" },
  { value: "scheduled", labelKey: "owner.filterScheduled", icon: "schedule" },
  { value: "full", labelKey: "owner.filterFull", icon: "event-seat" },
  { value: "needs-driver", labelKey: "owner.filterNeedsDriver", icon: "person-off" },
];

function SelectSheet<T extends string>({
  visible,
  onClose,
  title,
  options,
  value,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: Option<T>[];
  value: T;
  onSelect: (value: T) => void;
}) {
  const { t } = useTranslation();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View className="gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <Ripple
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              accessibilityLabel={t(option.labelKey)}
              accessibilityState={{ selected: active }}
              className={cn(
                "flex-row items-center gap-3 rounded-base border px-4 py-3.5",
                active ? "border-primary bg-primarySoft" : "border-border bg-card",
              )}
            >
              <View className="w-9 h-9 rounded-full bg-disable items-center justify-center">
                <Icon name={option.icon} size={18} color={active ? colors.primary : colors.secText} />
              </View>
              <Text className="flex-1 text-base-lg font-semibold text-text">{t(option.labelKey)}</Text>
              <Icon
                name={active ? "check-circle" : "radio-button-unchecked"}
                size={20}
                color={active ? colors.primary : colors.slate}
              />
            </Ripple>
          );
        })}
      </View>
    </BottomSheet>
  );
}

export function RouteFilterSheet(props: {
  visible: boolean;
  onClose: () => void;
  value: RouteFilter;
  onSelect: (value: RouteFilter) => void;
}) {
  const { t } = useTranslation();
  return <SelectSheet {...props} title={t("owner.filterRoute")} options={ROUTE_OPTIONS} />;
}

export function KindFilterSheet(props: {
  visible: boolean;
  onClose: () => void;
  value: KindFilter;
  onSelect: (value: KindFilter) => void;
}) {
  const { t } = useTranslation();
  return <SelectSheet {...props} title={t("owner.filterKind")} options={KIND_OPTIONS} />;
}

export function StatusFilterSheet(props: {
  visible: boolean;
  onClose: () => void;
  value: StatusFilter;
  onSelect: (value: StatusFilter) => void;
}) {
  const { t } = useTranslation();
  return <SelectSheet {...props} title={t("owner.filterStatus")} options={STATUS_OPTIONS} />;
}
