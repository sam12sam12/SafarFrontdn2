import { useTranslation } from "react-i18next";
import { View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useCSSVariable } from "uniwind";

// Highway 1 (Ring Road) corridor — fixed Kandahar → Kabul for now.
const KANDAHAR = { latitude: 31.6133, longitude: 65.7101 };
const QALAT = { latitude: 32.1061, longitude: 66.907 };
const GHAZNI = { latitude: 33.5486, longitude: 68.4231 };
const KABUL = { latitude: 34.5553, longitude: 69.2075 };
const ROUTE = [KANDAHAR, QALAT, GHAZNI, KABUL];

// Region that frames the whole corridor with a little padding.
const REGION = {
  latitude: 33.08,
  longitude: 67.46,
  latitudeDelta: 4.2,
  longitudeDelta: 5.0,
};

type Props = { height?: number };

export function TripMap({ height = 180 }: Props) {
  const { t } = useTranslation();
  const [primary, success, error] = useCSSVariable([
    "--color-primary",
    "--color-success",
    "--color-error",
  ]) as string[];

  return (
    <View style={{ height, borderRadius: 16, overflow: "hidden" }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={REGION}
        pitchEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}
        loadingEnabled
      >
        <Polyline coordinates={ROUTE} strokeColor={primary} strokeWidth={4} />
        <Marker coordinate={KANDAHAR} title={t("common.kandahar")} pinColor={success} />
        <Marker coordinate={KABUL} title={t("common.kabul")} pinColor={error} />
      </MapView>
    </View>
  );
}
