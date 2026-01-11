import { useEffect, useState } from "react";
import RouteStops from "./RouteStops";
import BaseMap from "../components/Basemap/Basemap";

/* ================= OSRM ROUTE API ================= */
const getRoute = async (from, to) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  return data.routes?.[0]?.geometry?.coordinates || [];
};

export default function AddRoute({ onSaved }) {
  const [form, setForm] = useState({
    route_code: "",
    from_place: "",
    to_place: "",
  });

  /* ---------- FROM / TO GEO ---------- */
  const [fromGeo, setFromGeo] = useState(null);
  const [toGeo, setToGeo] = useState(null);

  /* ---------- SUGGESTIONS ---------- */
  const [fromSug, setFromSug] = useState([]);
  const [toSug, setToSug] = useState([]);
  const [fromLocked, setFromLocked] = useState(false);
  const [toLocked, setToLocked] = useState(false);

  /* ---------- MAP ---------- */
  const [routeLine, setRouteLine] = useState([]);
  const [mapCenter, setMapCenter] = useState([11.0168, 76.9558]);

  const [loading, setLoading] = useState(false);
  const [showStops, setShowStops] = useState(false);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= FETCH FROM SUGGESTIONS ================= */
  useEffect(() => {
    if (!form.from_place.trim() || fromLocked) {
      setFromSug([]);
      return;
    }

    const t = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${form.from_place}`
      );
      const data = await res.json();
      setFromSug(data.slice(0, 5));
    }, 400);

    return () => clearTimeout(t);
  }, [form.from_place, fromLocked]);

  /* ================= FETCH TO SUGGESTIONS ================= */
  useEffect(() => {
    if (!form.to_place.trim() || toLocked) {
      setToSug([]);
      return;
    }

    const t = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${form.to_place}`
      );
      const data = await res.json();
      setToSug(data.slice(0, 5));
    }, 400);

    return () => clearTimeout(t);
  }, [form.to_place, toLocked]);

  /* ================= SELECT FROM ================= */
  const selectFrom = (p) => {
    setForm((f) => ({ ...f, from_place: p.display_name }));
    setFromGeo({ lat: +p.lat, lng: +p.lon });
    setMapCenter([+p.lat, +p.lon]);
    setFromSug([]);
    setFromLocked(true);
  };

  /* ================= SELECT TO ================= */
  const selectTo = (p) => {
    setForm((f) => ({ ...f, to_place: p.display_name }));
    setToGeo({ lat: +p.lat, lng: +p.lon });
    setMapCenter([+p.lat, +p.lon]);
    setToSug([]);
    setToLocked(true);
  };

  /* ================= FIND ROUTE ================= */
  const handleFindRoute = async () => {
    if (!fromGeo || !toGeo) {
      alert("Select both From and To");
      return;
    }

    const coords = await getRoute(fromGeo, toGeo);

    const latlngs = coords.map(([lng, lat]) => [lat, lng]);
    setRouteLine(latlngs);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!form.route_code || !form.from_place || !form.to_place) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to add route");
        return;
      }

      alert("✅ Route added successfully");
      setShowStops(true);
      onSaved?.();
    } catch {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ---------- ROUTE FORM ---------- */}
      {!showStops && (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow border border-black">
          <h2 className="text-xl font-semibold mb-6">Add Route</h2>

          {/* ROUTE CODE */}
          <input
            name="route_code"
            value={form.route_code}
            onChange={handleChange}
            placeholder="Route Code"
            className="w-full mb-4 rounded-lg border px-3 py-2"
          />

          {/* FROM */}
          <div className="relative mb-4">
            <input
              name="from_place"
              value={form.from_place}
              onChange={(e) => {
                handleChange(e);
                setFromLocked(false);
              }}
              placeholder="From"
              className="w-full rounded-lg border px-3 py-2"
            />

            {fromSug.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded shadow">
                {fromSug.map((p) => (
                  <div
                    key={p.place_id}
                    onClick={() => selectFrom(p)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {p.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO */}
          <div className="relative mb-4">
            <input
              name="to_place"
              value={form.to_place}
              onChange={(e) => {
                handleChange(e);
                setToLocked(false);
              }}
              placeholder="To"
              className="w-full rounded-lg border px-3 py-2"
            />

            {toSug.length > 0 && (
              <div className="absolute z-10 w-full bg-white border rounded shadow">
                {toSug.map((p) => (
                  <div
                    key={p.place_id}
                    onClick={() => selectTo(p)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {p.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PREVIEW */}
          {(form.route_code || form.from_place || form.to_place) && (
            <div className="mb-4 text-sm">
              <b>Preview:</b> {form.route_code} — {form.from_place} →{" "}
              {form.to_place}
            </div>
          )}

          {/* FIND ROUTE */}
          <button
            onClick={handleFindRoute}
            className="w-full mb-4 rounded-lg bg-gray-800 text-white py-2"
          >
            🗺 Find Route
          </button>

          {/* MAP */}
          {routeLine.length > 0 && (
            <div className="mb-4">
              <BaseMap
                center={mapCenter}
                route={routeLine}
                markers={[
                  { position: [fromGeo.lat, fromGeo.lng] },
                  { position: [toGeo.lat, toGeo.lng] },
                ]}
                height={280}
              />
            </div>
          )}

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 text-white py-2"
          >
            {loading ? "Saving..." : "Save Route"}
          </button>
        </div>
      )}

      {/* ---------- STOPS ---------- */}
      {showStops && <RouteStops route={form} />}
    </>
  );
}
