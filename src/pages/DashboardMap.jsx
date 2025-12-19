import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

// 🔧 Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔵 Physical marker
const blueIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1178/1178847.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🟡 Preview marker
const yellowIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/1042/1042263.png",
  // shadowUrl:
  //   "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [50, 41],
  iconAnchor: [12, 41],
});

/* ✅ MAP RECENTER CONTROLLER (DO NOT REMOVE) */
function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 0.8 });
    }
  }, [center, map]);

  return null;
}

export default function DashboardMap() {
  const [displays, setDisplays] = useState([]);
  const [search, setSearch] = useState("");
  const [places, setPlaces] = useState([]);

  /* ✅ NEW STATE FOR CENTER */
  const [mapCenter, setMapCenter] = useState([11.0168, 76.9558]);

  const mapRef = useRef(null);

  // 🔹 Load displays
  useEffect(() => {
    fetch("http://localhost:8000/displays")
      .then((r) => r.json())
      .then(setDisplays)
      .catch(() => setDisplays([]));
  }, []);

  // 🔹 Fetch place suggestions (Nominatim)
  useEffect(() => {
    if (search.trim().length < 3) {
      setPlaces([]);
      return;
    }

    const controller = new AbortController();

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        search
      )}&limit=5`,
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "en",
        },
      }
    )
      .then((res) => res.json())
      .then(setPlaces)
      .catch(() => {});

    return () => controller.abort();
  }, [search]);

  // 🔹 When place selected (FIXED)
  const handlePlaceSelect = (p) => {
    setSearch(p.display_name);
    setPlaces([]);

    const lat = Number(p.lat);
    const lon = Number(p.lon);

    /* ✅ THIS IS THE KEY FIX */
    setMapCenter([lat, lon]);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          background: "#fff",
          padding: 12,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* 🔍 HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h3 style={{ margin: 0, fontWeight: 600 }}>
            Displays Map
          </h3>

          <div style={{ position: "relative", width: 320 }}>
            <input
              type="text"
              placeholder="Search place (city / area)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />

            {/* 🌍 PLACE SUGGESTIONS */}
            {places.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 42,
                  right: 0,
                  width: "100%",
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                  maxHeight: 240,
                  overflowY: "auto",
                  zIndex: 1000,
                }}
              >
                {places.map((p) => (
                  <div
                    key={p.place_id}
                    onClick={() => handlePlaceSelect(p)}
                    style={{
                      padding: 10,
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    📍 {p.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🗺 MAP */}
        <MapContainer
          center={mapCenter}
          zoom={11}
          style={{ height: 420, width: "100%", borderRadius: 10 }}
          whenCreated={(map) => (mapRef.current = map)}
        >
          {/* ✅ THIS LINE MAKES RECENTER WORK */}
          <RecenterMap center={mapCenter} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {displays.map((d) => (
            <Marker
              key={d.deviceId}
              position={[Number(d.latitude), Number(d.longitude)]}
              icon={d.method === "physical" ? blueIcon : yellowIcon}
            >
              <Popup>
                <b>{d.displayName}</b>
                <br />
                <small>{d.deviceId}</small>
                <hr />
                📍 {d.locationName}
                <br />
                👷 {d.installerName || "Master"}
                <br />
                🟡 {d.method}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
