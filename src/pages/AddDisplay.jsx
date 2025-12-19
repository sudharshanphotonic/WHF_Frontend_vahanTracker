import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { QRCodeCanvas } from "qrcode.react";
import L from "leaflet";

/* ================= LEAFLET FIX ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= MAP CLICK PICKER ================= */
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

/* ================= MAP RECENTER HELPER ================= */
function RecenterMap({ center }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 0.8 });
    }
  }, [center, map]);
  return null;
}

export default function AddDisplay() {
  const [mode, setMode] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const [latLng, setLatLng] = useState(null);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // ✅ FIX

  const [form, setForm] = useState({
    displayName: "",
    locationName: "",
  });

  const DISPLAY_UID = `DISPLAY-${Date.now()}`;
  const installUrl = `${window.location.origin}/?install=1&deviceId=${DISPLAY_UID}`;

  /* ================= MAP SEARCH ================= */
  const [mapSearch, setMapSearch] = useState("");
  const [mapResults, setMapResults] = useState([]);
  const [searchLocked, setSearchLocked] = useState(false); // ✅ FIX

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SEARCH LOCATION (RECENTER ONLY) ================= */
  useEffect(() => {
    if (!mapSearch.trim() || searchLocked) {
      setMapResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${mapSearch}`
        );
        const data = await res.json();
        setMapResults(data.slice(0, 5));
      } catch {
        setMapResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [mapSearch, searchLocked]);

  const selectSearchPlace = (p) => {
    const lat = Number(p.lat);
    const lng = Number(p.lon);

    setMapCenter([lat, lng]); // ✅ FIX: recenter map
    setMapSearch(p.display_name);
    setMapResults([]);
    setSearchLocked(true); // ✅ FIX: stop refetch loop

    // clear old pin
    setLatLng(null);
    setForm((prev) => ({ ...prev, locationName: "" }));
  };

  /* ================= MAP PICK + REVERSE GEOCODE ================= */
  const handleMapPick = async (pos) => {
    const lat = pos.lat.toFixed(6);
    const lng = pos.lng.toFixed(6);

    setLatLng({ lat, lng });

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      const place =
        data.address?.suburb ||
        data.address?.neighbourhood ||
        data.address?.city ||
        data.address?.town ||
        data.display_name ||
        "";

      setForm((prev) => ({ ...prev, locationName: place }));
    } catch {}
  };

  /* ================= SAVE ================= */
  const handleSaveDesktop = async () => {
    if (!form.displayName || !latLng) {
      alert("Display name and location are required");
      return;
    }

    const payload = {
      deviceId: DISPLAY_UID,
      displayName: form.displayName,
      locationName: form.locationName,
      installerName: "master",
      latitude: String(latLng.lat),
      longitude: String(latLng.lng),
      method: "desktop",
    };

    try {
      const res = await fetch("http://localhost:8000/displays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to save");
        return;
      }

      alert("🟡 Display saved successfully");
      setForm({ displayName: "", locationName: "" });
      setLatLng(null);
      setShowMap(false);
      setMode(null);
    } catch {
      alert("Backend not reachable");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <h2 className="text-2xl font-semibold mb-6">Add Display</h2>

      {/* ================= METHOD SELECTION ================= */}
      {!mode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div
            onClick={() => setMode("desktop")}
            className="cursor-pointer rounded-xl border p-6 hover:shadow-md "
          >
            <h3 className="text-lg font-semibold">🖥️ Desktop Entry</h3>
            <p className="text-sm text-gray-600">
              Add display manually & pin location
            </p>
          </div>

          <div
            onClick={() => setMode("physical")}
            className="cursor-pointer rounded-xl border p-6 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold">📱 Physical Demo</h3>
            <p className="text-sm text-gray-600">
              Installer scans QR to install
            </p>
          </div>
        </div>
      )}

      {/* ================= DESKTOP ENTRY ================= */}
      {mode === "desktop" && (
        <div className="mt-8 bg-sky-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">🖥️ Desktop Entry</h3>

          <p className="text-sm mb-4">
            <b>Display UID:</b> {DISPLAY_UID}
          </p>

          <input
            name="displayName"
            placeholder="Display Name"
            value={form.displayName}
            onChange={handleChange}
            className="w-full mb-3 rounded-lg border px-3 py-2"
          />

          <input
            value={form.locationName}
            placeholder="Location Name (auto)"
            readOnly
            className="w-full mb-4 rounded-lg border bg-gray-100 px-3 py-2"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              value={latLng?.lat || ""}
              placeholder="Latitude"
              readOnly
              className="rounded-lg border bg-gray-100 px-3 py-2"
            />
            <input
              value={latLng?.lng || ""}
              placeholder="Longitude"
              readOnly
              className="rounded-lg border bg-gray-100 px-3 py-2"
            />
          </div>

          <button
            onClick={() => setShowMap((s) => !s)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            {latLng ? "🔁 Re-pin Location" : "📍 Pin Location"}
          </button>

          {/* ================= MAP ================= */}
          {showMap && (
            <div className="relative mt-4 rounded-lg overflow-hidden border">
              {/* SEARCH BAR */}
              <div className="absolute top-3 right-3 z-[1000] w-72">
                <input
                  value={mapSearch}
                  onChange={(e) => {
                    setMapSearch(e.target.value);
                    setSearchLocked(false);
                  }}
                  placeholder="Search place..."
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                {mapResults.length > 0 && (
                  <div className="bg-white mt-1 rounded-lg shadow max-h-48 overflow-auto">
                    {mapResults.map((p) => (
                      <div
                        key={p.place_id}
                        onClick={() => selectSearchPlace(p)}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        {p.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <MapContainer
                center={mapCenter}
                zoom={13}
                className="h-[300px] w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RecenterMap center={mapCenter} />
                <LocationPicker onPick={handleMapPick} />
                {latLng && (
                  <Marker position={[latLng.lat, latLng.lng]} />
                )}
              </MapContainer>
            </div>
          )}

          <div className="mt-4 text-sm">
            Status:{" "}
            <span className="text-orange-500 font-semibold">
              🟡 Preview
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              disabled={!latLng}
              onClick={handleSaveDesktop}
              className="rounded-lg bg-green-600 px-5 py-2 text-white disabled:opacity-50"
            >
              💾 Save Display
            </button>

            <button
              onClick={() => setMode(null)}
              className="rounded-lg bg-red-600 px-5 py-2 text-white"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* ================= PHYSICAL DEMO ================= */}
      {mode === "physical" && (
        <div className="mt-8 max-w-sm bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            📱 Physical Installation
          </h3>

          <div className="flex flex-col items-center border rounded-lg p-4">
            <QRCodeCanvas size={180} value={installUrl} />
            <p className="mt-3 text-sm">{DISPLAY_UID}</p>
          </div>

          <button
            onClick={() => setMode(null)}
            className="mt-4 rounded-lg border px-4 py-2"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
