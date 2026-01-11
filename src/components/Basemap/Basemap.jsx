import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";

/* ================= SAFE DEFAULT ICON ================= */
const defaultIcon = new L.Icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

/* ================= RECENTER ================= */
function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && Array.isArray(center)) {
      map.flyTo(center, map.getZoom(), { duration: 0.8 });
    }
  }, [center, map]);

  return null;
}

/* ================= MAP CLICK HANDLER ================= */
function MapClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng);
    },
  });
  return null;
}

export default function BaseMap({
  center,
  zoom = 13,
  markers = [],
  route = [],
  onMapClick,
  height = 300,
}) {
  /* ================= SAFETY NORMALIZATION ================= */
  const safeMarkers = useMemo(
    () =>
      Array.isArray(markers)
        ? markers.filter((m) => m && Array.isArray(m.position))
        : [],
    [markers]
  );

  const safeRoute = useMemo(
    () =>
      Array.isArray(route)
        ? route.filter(
            (p) => Array.isArray(p) && p.length === 2
          )
        : [],
    [route]
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: 10 }}
      preferCanvas
    >
      {/* 🔄 RECENTER */}
      <RecenterMap center={center} />

      {/* 🖱 MAP CLICK */}
      {onMapClick && <MapClickHandler onClick={onMapClick} />}

      {/* 🗺 BASE LAYER */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 📍 MARKERS */}
      {safeMarkers.map((m, i) => (
        <Marker
          key={i}
          position={m.position}
          icon={m.icon ?? defaultIcon}
        >
          {m.popup && <Popup>{m.popup}</Popup>}
        </Marker>
      ))}

      {/* 🧭 ROUTE */}
      {safeRoute.length > 0 && (
        <Polyline
          positions={safeRoute}
          pathOptions={{
            color: "#2563eb",
            weight: 4,
          }}
        />
      )}
    </MapContainer>
  );
}
