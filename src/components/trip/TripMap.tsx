import { Image, type ImageSource } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useCSSVariable } from "uniwind";

import type { City, Driver } from "@/lib/db/types";

// Highway 1 (Ring Road) — the corridor stops, drawn in the trip's direction.
const KANDAHAR = { latitude: 31.6133, longitude: 65.7101 };
const QALAT = { latitude: 32.1061, longitude: 66.907 };
const GHAZNI = { latitude: 33.5486, longitude: 68.4231 };
const KABUL = { latitude: 34.5553, longitude: 69.2075 };
const COORDS: Record<City, { latitude: number; longitude: number }> = {
  Kandahar: KANDAHAR,
  Kabul: KABUL,
};

// Region that frames the whole corridor with a little padding.
const REGION = {
  latitude: 33.08,
  longitude: 67.46,
  latitudeDelta: 4.2,
  longitudeDelta: 5.0,
};

type Props = { height?: number; driver?: Driver; from?: City; to?: City };

export function TripMap({ height = 180, driver, from = "Kandahar", to = "Kabul" }: Props) {
  const { t } = useTranslation();
  const [primary, success, error] = useCSSVariable([
    "--color-primary",
    "--color-success",
    "--color-error",
  ]) as string[];

  const route =
    from === "Kabul" ? [KABUL, GHAZNI, QALAT, KANDAHAR] : [KANDAHAR, QALAT, GHAZNI, KABUL];
  const origin = COORDS[from];
  const destination = COORDS[to];

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
        <Polyline coordinates={route} strokeColor={primary} strokeWidth={4} />

        {/* Start of the corridor: the driver's profile instead of a plain pin. */}
        {driver ? (
          <DriverMarker driver={driver} ringColor={primary} coordinate={origin} />
        ) : (
          <Marker coordinate={origin} title={t(`common.${from.toLowerCase()}`)} pinColor={success} />
        )}

        {/* Destination stays a clean pin. */}
        <Marker coordinate={destination} title={t(`common.${to.toLowerCase()}`)} pinColor={error} />
      </MapView>
    </View>
  );
}

/** A circular driver avatar dropped at the start point, with a pointer tail so
 * the bottom tip lands on the exact coordinate. */
function DriverMarker({
  driver,
  ringColor,
  coordinate,
}: {
  driver: Driver;
  ringColor: string;
  coordinate: { latitude: number; longitude: number };
}) {
  // Re-render the marker bitmap until the photo has loaded, then freeze it so
  // the map stays smooth while panning (react-native-maps perf guidance).
  const [tracking, setTracking] = useState(true);

  return (
    <Marker
      coordinate={coordinate}
      title={driver.name}
      description={driver.vehicleModel}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={tracking}
    >
      <View style={{ alignItems: "center" }}>
        <View
          className="rounded-full bg-card p-0.5 shadow-md"
          style={{ borderWidth: 2, borderColor: ringColor }}
        >
          <View className="w-11 h-11 rounded-full overflow-hidden bg-primarySoft items-center justify-center">
            {driver.photo ? (
              <Image
                source={driver.photo as ImageSource | number}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                onLoadEnd={() => setTracking(false)}
              />
            ) : (
              <Text className="text-base-lg font-bold text-primary">{driver.initials}</Text>
            )}
          </View>
        </View>
        {/* Pointer tail that lands on the coordinate. */}
        <View
          className="bg-card"
          style={{
            width: 12,
            height: 12,
            marginTop: -7,
            transform: [{ rotate: "45deg" }],
            borderRightWidth: 2,
            borderBottomWidth: 2,
            borderColor: ringColor,
          }}
        />
      </View>
    </Marker>
  );
}
