import { useTranslation } from "react-i18next";

import { SelectMenuSheet, type SelectOption } from "@/components/ui/SelectMenuSheet";
import type { IconName } from "@/components/ui/Icon";

export type RouteFilter = "all" | "to-kabul" | "to-kandahar";
export type KindFilter = "all" | "shared" | "vip";
export type StatusFilter = "all" | "on-road" | "boarding" | "scheduled" | "full" | "needs-driver";

type Spec<T extends string> = { value: T; labelKey: string; icon: IconName };

const ROUTE_SPEC: Spec<RouteFilter>[] = [
  { value: "all", labelKey: "owner.allRoutes", icon: "swap-horiz" },
  { value: "to-kabul", labelKey: "home.routeToKabul", icon: "arrow-forward" },
  { value: "to-kandahar", labelKey: "home.routeToKandahar", icon: "arrow-forward" },
];

const KIND_SPEC: Spec<KindFilter>[] = [
  { value: "all", labelKey: "owner.allKinds", icon: "filter-list" },
  { value: "shared", labelKey: "owner.bookingFilterShared", icon: "groups" },
  { value: "vip", labelKey: "owner.bookingFilterVip", icon: "star" },
];

const STATUS_SPEC: Spec<StatusFilter>[] = [
  { value: "all", labelKey: "owner.allStatuses", icon: "filter-list" },
  { value: "on-road", labelKey: "owner.filterOnRoad", icon: "near-me" },
  { value: "boarding", labelKey: "owner.filterBoarding", icon: "login" },
  { value: "scheduled", labelKey: "owner.filterScheduled", icon: "schedule" },
  { value: "full", labelKey: "owner.filterFull", icon: "event-seat" },
  { value: "needs-driver", labelKey: "owner.filterNeedsDriver", icon: "person-off" },
];

function useOptions<T extends string>(spec: Spec<T>[]): SelectOption<T>[] {
  const { t } = useTranslation();
  return spec.map((item) => ({ value: item.value, label: t(item.labelKey), icon: item.icon }));
}

export function RouteFilterSheet(props: {
  visible: boolean;
  onClose: () => void;
  value: RouteFilter;
  onSelect: (value: RouteFilter) => void;
}) {
  const { t } = useTranslation();
  return <SelectMenuSheet {...props} title={t("owner.filterRoute")} options={useOptions(ROUTE_SPEC)} clearTo="all" />;
}

export function KindFilterSheet(props: {
  visible: boolean;
  onClose: () => void;
  value: KindFilter;
  onSelect: (value: KindFilter) => void;
}) {
  const { t } = useTranslation();
  return <SelectMenuSheet {...props} title={t("owner.filterKind")} options={useOptions(KIND_SPEC)} clearTo="all" />;
}

export function StatusFilterSheet(props: {
  visible: boolean;
  onClose: () => void;
  value: StatusFilter;
  onSelect: (value: StatusFilter) => void;
}) {
  const { t } = useTranslation();
  return <SelectMenuSheet {...props} title={t("owner.filterStatus")} options={useOptions(STATUS_SPEC)} clearTo="all" />;
}
