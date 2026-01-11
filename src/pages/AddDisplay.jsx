// import { useEffect, useState } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import BaseMap from "../components/Basemap/Basemap";

// export default function AddDisplay() {
//   const [mode, setMode] = useState(null);
//   const [showMap, setShowMap] = useState(false);

//   const [latLng, setLatLng] = useState(null);
//   const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);

//   const [form, setForm] = useState({
//     displayName: "",
//     locationName: "",
//     direction: "forward", // ✅ NEW
//   });

//   const DISPLAY_UID = `DISPLAY-${Date.now()}`;
//   const installUrl = `${window.location.origin}/?install=1&deviceId=${DISPLAY_UID}`;

//   /* ================= MAP SEARCH ================= */
//   const [mapSearch, setMapSearch] = useState("");
//   const [mapResults, setMapResults] = useState([]);
//   const [searchLocked, setSearchLocked] = useState(false);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   /* ================= SEARCH LOCATION ================= */
//   useEffect(() => {
//     if (!mapSearch.trim() || searchLocked) {
//       setMapResults([]);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${mapSearch}`
//         );
//         const data = await res.json();
//         setMapResults(data.slice(0, 5));
//       } catch {
//         setMapResults([]);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [mapSearch, searchLocked]);

//   const selectSearchPlace = (p) => {
//     const lat = Number(p.lat);
//     const lng = Number(p.lon);

//     setMapCenter([lat, lng]);
//     setMapSearch(p.display_name);
//     setMapResults([]);
//     setSearchLocked(true);

//     setLatLng(null);
//     setForm((prev) => ({ ...prev, locationName: "" }));
//   };

//   /* ================= MAP PICK ================= */
//   const handleMapPick = async (pos) => {
//     const lat = pos.lat.toFixed(6);
//     const lng = pos.lng.toFixed(6);

//     setLatLng({ lat, lng });

//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
//       );
//       const data = await res.json();

//       const place =
//         data.address?.suburb ||
//         data.address?.neighbourhood ||
//         data.address?.city ||
//         data.address?.town ||
//         data.display_name ||
//         "";

//       setForm((prev) => ({ ...prev, locationName: place }));
//     } catch {}
//   };

//   /* ================= SAVE ================= */
//   const handleSaveDesktop = async () => {
//     if (!form.displayName || !latLng) {
//       alert("Display name and location are required");
//       return;
//     }

//     const payload = {
//       deviceId: DISPLAY_UID,
//       displayName: form.displayName,
//       locationName: form.locationName,
//       direction: form.direction, // ✅ NEW
//       installerName: "master",
//       latitude: String(latLng.lat),
//       longitude: String(latLng.lng),
//       method: "desktop",
//     };

//     try {
//       const res = await fetch("http://localhost:8000/displays", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         alert(err.detail || "Failed to save");
//         return;
//       }

//       alert("🟡 Display saved successfully");
//       setForm({ displayName: "", locationName: "", direction: "forward" });
//       setLatLng(null);
//       setShowMap(false);
//       setMode(null);
//     } catch {
//       alert("Backend not reachable");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-6">Add Display</h2>

//       {!mode && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div
//             onClick={() => setMode("desktop")}
//             className="cursor-pointer rounded-xl border p-6 hover:shadow-md"
//           >
//             <h3 className="text-lg font-semibold">🖥️ Desktop Entry</h3>
//             <p className="text-sm text-gray-600">
//               Add display manually & pin location
//             </p>
//           </div>

//           <div
//             onClick={() => setMode("physical")}
//             className="cursor-pointer rounded-xl border p-6 hover:shadow-md"
//           >
//             <h3 className="text-lg font-semibold">📱 Physical Demo</h3>
//             <p className="text-sm text-gray-600">
//               Installer scans QR to install
//             </p>
//           </div>
//         </div>
//       )}

//       {mode === "desktop" && (
//         <div className="mt-8 bg-sky-100 rounded-xl p-6">
//           <h3 className="text-lg font-semibold mb-4">🖥️ Desktop Entry</h3>

//           <p className="text-sm mb-4">
//             <b>Display UID:</b> {DISPLAY_UID}
//           </p>

//           <input
//             name="displayName"
//             placeholder="Stop Name"
//             value={form.displayName}
//             onChange={handleChange}
//             className="w-full mb-3 rounded-lg border px-3 py-2"
//           />

//           {/* ✅ Direction */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-2">
//               Direction
//             </label>

//             <div className="flex gap-4">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="direction"
//                   value="forward"
//                   checked={form.direction === "forward"}
//                   onChange={handleChange}
//                 />
//                 <span className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm">
//                   Blue (Forward)
//                 </span>
//               </label>

//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   name="direction"
//                   value="backward"
//                   checked={form.direction === "backward"}
//                   onChange={handleChange}
//                 />
//                 <span className="px-3 py-1 rounded-md bg-yellow-400 text-black text-sm">
//                   Yellow (Backward)
//                 </span>
//               </label>
//             </div>
//           </div>

//           <input
//             value={form.locationName}
//             placeholder="Location Name (auto)"
//             readOnly
//             className="w-full mb-4 rounded-lg border bg-gray-100 px-3 py-2"
//           />

//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <input
//               value={latLng?.lat || ""}
//               placeholder="Latitude"
//               readOnly
//               className="rounded-lg border bg-gray-100 px-3 py-2"
//             />
//             <input
//               value={latLng?.lng || ""}
//               placeholder="Longitude"
//               readOnly
//               className="rounded-lg border bg-gray-100 px-3 py-2"
//             />
//           </div>

//           <button
//             onClick={() => setShowMap((s) => !s)}
//             className="rounded-lg bg-blue-600 px-4 py-2 text-white"
//           >
//             {latLng ? "🔁 Re-pin Location" : "📍 Pin Location"}
//           </button>

//           {showMap && (
//             <div className="relative mt-4 rounded-lg overflow-hidden border">
//               {/* 🔍 SEARCH BAR (RESTORED) */}
//               <div className="absolute top-3 right-3 z-[1000] w-72">
//                 <input
//                   value={mapSearch}
//                   onChange={(e) => {
//                     setMapSearch(e.target.value);
//                     setSearchLocked(false);
//                   }}
//                   placeholder="Search place..."
//                   className="w-full rounded-lg border px-3 py-2 text-sm"
//                 />

//                 {mapResults.length > 0 && (
//                   <div className="bg-white mt-1 rounded-lg shadow max-h-48 overflow-auto">
//                     {mapResults.map((p) => (
//                       <div
//                         key={p.place_id}
//                         onClick={() => selectSearchPlace(p)}
//                         className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
//                       >
//                         {p.display_name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <BaseMap
//                 center={mapCenter}
//                 zoom={13}
//                 height={300}
//                 onMapClick={handleMapPick}
//                 markers={
//                   latLng ? [{ position: [latLng.lat, latLng.lng] }] : []
//                 }
//               />
//             </div>
//           )}

//           <div className="mt-6 flex gap-3">
//             <button
//               disabled={!latLng}
//               onClick={handleSaveDesktop}
//               className="rounded-lg bg-green-600 px-5 py-2 text-white disabled:opacity-50"
//             >
//               💾 Add Display
//             </button>

//             <button
//               onClick={() => setMode(null)}
//               className="rounded-lg bg-red-600 px-5 py-2 text-white"
//             >
//               ← Back
//             </button>
//           </div>
//         </div>
//       )}

//       {mode === "physical" && (
//         <div className="mt-8 max-w-sm bg-white rounded-xl shadow p-6">
//           <h3 className="text-lg font-semibold mb-4">
//             📱 Physical Installation
//           </h3>

//           <div className="flex flex-col items-center border rounded-lg p-4">
//             <QRCodeCanvas size={180} value={installUrl} />
//             <p className="mt-3 text-sm">{DISPLAY_UID}</p>
//           </div>

//           <button
//             onClick={() => setMode(null)}
//             className="mt-4 rounded-lg border px-4 py-2"
//           >
//             ← Back
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function AddDisplay() {
  const [mode, setMode] = useState(null);
  const [displayUid, setDisplayUid] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    district: "",
    state: "",
    locationName: "",
    latitude: "",
    longitude: "",
    direction: "forward",
  });

  // ✅ PREVIEW STATE
  const [previewList, setPreviewList] = useState([]);

  // ✅ STOPPING LIST TOGGLE STATE (NEW)
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const installUrl = displayUid
    ? `${window.location.origin}/?install=1&deviceId=${displayUid}`
    : "";

  const isEmpty = (val) => submitted && !val;

  const handleSaveDesktop = async () => {
    setSubmitted(true);

    if (
      !displayUid ||
      !form.displayName ||
      !form.locationName ||
      !form.latitude ||
      !form.longitude
    ) {
      return;
    }

    const payload = {
      deviceId: displayUid,
      displayName: form.displayName,
      district: form.district,
      state: form.state,
      locationName: form.locationName,
      latitude: form.latitude,
      longitude: form.longitude,
      direction: form.direction,
      installerName: "master",
      method: "desktop",
    };

    try {
      const res = await fetch("http://localhost:8000/displays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      // ✅ ADD TO PREVIEW TABLE (IMMEDIATE)
      setPreviewList((prev) => [
        ...prev,
        {
          id: displayUid,
          stopName: form.displayName,
          direction: form.direction,
          latitude: form.latitude,
          longitude: form.longitude,
          district: form.district,
          state: form.state,
        },
      ]);

      // ✅ AUTO OPEN STOPPING LIST AFTER ADD
      setShowPreview(true);

      setForm({
        displayName: "",
        district: "",
        state: "",
        locationName: "",
        latitude: "",
        longitude: "",
        direction: "forward",
      });

      setDisplayUid("");
      setSubmitted(false);
      setMode(null);
    } catch {
      alert("Failed to save display");
    }
  };

  const inputBase =
    "w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2";
  const normal = "border focus:ring-blue-400";
  const error = "border border-red-500 focus:ring-red-400";

  return (
    <div className="min-h-screen bg-sky-50 flex justify-center px-6 py-10">
      <div className="w-full max-w-4xl">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-semibold">Add Display</h2>
          </div>

          <div className="flex items-center gap-3">
            <input
              placeholder="Search by Display ID"
              className="rounded-lg border px-3 py-2 text-sm w-48"
            />
            <input
              placeholder="Search by Stop Name"
              className="rounded-lg border px-3 py-2 text-sm w-48"
            />
            <select className="rounded-lg border px-3 py-2 text-sm">
              <option>Recent</option>
              <option>Last 1 Week</option>
              <option>Last 3 Weeks</option>
            </select>

            {/* ✅ STOPPING LIST BUTTON (NEW) */}
            <button
              onClick={() => setShowPreview((prev) => !prev)}
              className="ml-3 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm"
            >
              📋 Stopping List
            </button>
          </div>
        </div>

        {/* ===== MODE SELECT ===== */}
        {!mode && (
          <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div
              onClick={() => setMode("desktop")}
              className="cursor-pointer rounded-xl border bg-white p-6 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">🖥 Desktop Entry</h3>
              <p className="text-sm text-gray-500">
                Manual display installation
              </p>
            </div>

            <div
              onClick={() => setMode("physical")}
              className="cursor-pointer rounded-xl border bg-white p-6 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">📱 Physical Install</h3>
              <p className="text-sm text-gray-500">
                Installer scans QR
              </p>
            </div>
          </div>
        )}

        {/* ===== DESKTOP ENTRY ===== */}
        {mode === "desktop" && (
          <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
            <h3 className="text-xl font-semibold mb-6">
              🖥 Desktop Entry
            </h3>

            <p className="text-sm font-semibold text-gray-600 mb-3">
              Basic Details
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Display UID <span className="text-red-500">*</span>
                </label>
                <input
                  value={displayUid}
                  onChange={(e) => setDisplayUid(e.target.value)}
                  className={`${inputBase} ${
                    isEmpty(displayUid) ? error : normal
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Stop Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  className={`${inputBase} ${
                    isEmpty(form.displayName) ? error : normal
                  }`}
                />
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-600 mb-3">
              Location Details
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  District
                </label>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className={`${inputBase} ${normal}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  State
                </label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`${inputBase} ${normal}`}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="locationName"
                  value={form.locationName}
                  onChange={handleChange}
                  className={`${inputBase} ${
                    isEmpty(form.locationName) ? error : normal
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className={`${inputBase} ${
                    isEmpty(form.latitude) ? error : normal
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className={`${inputBase} ${
                    isEmpty(form.longitude) ? error : normal
                  }`}
                />
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-600 mb-2">
              Direction
            </p>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() =>
                  setForm({ ...form, direction: "forward" })
                }
                className={`px-5 py-2 rounded-lg text-sm font-medium ${
                  form.direction === "forward"
                    ? "bg-blue-600 text-white"
                    : "border"
                }`}
              >
                🔵 Blue Line
              </button>

              <button
                onClick={() =>
                  setForm({ ...form, direction: "backward" })
                }
                className={`px-5 py-2 rounded-lg text-sm font-medium ${
                  form.direction === "backward"
                    ? "bg-yellow-400 text-black"
                    : "border"
                }`}
              >
                🟡 Yellow Line
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setMode(null)}
                className="px-6 py-2 rounded-lg border"
              >
                ← Back
              </button>

              <button
                onClick={handleSaveDesktop}
                className="px-6 py-2 rounded-lg bg-green-600 text-white"
              >
                💾 Add Stops
              </button>
            </div>
          </div>
        )}

        {/* ===== PREVIEW TABLE (SHOW ONLY ON BUTTON CLICK) ===== */}
        {showPreview && previewList.length > 0 && (
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
            <h4 className="text-lg font-semibold mb-4">
              📋 Added Stops Preview
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-2">ID</th>
                    <th className="border px-2 py-2">Stop</th>
                    <th className="border px-2 py-2">Direction</th>
                    <th className="border px-2 py-2">Lat</th>
                    <th className="border px-2 py-2">Long</th>
                    <th className="border px-2 py-2">District</th>
                    <th className="border px-2 py-2">State</th>
                  </tr>
                </thead>

                <tbody>
                  {previewList.map((row, i) => (
                    <tr key={i} className="text-center">
                      <td className="border px-2 py-2">{row.id}</td>
                      <td className="border px-2 py-2 font-medium">
                        {row.stopName}
                      </td>

                      <td className="border px-2 py-2">
                        <div className="flex items-center justify-center gap-4">
                          <span
                            className={`w-12 h-5 rounded ${
                              row.direction === "forward"
                                ? "bg-blue-600"
                                : "bg-yellow-400"
                            }`}
                          ></span>

                          <div className="relative flex items-center">
                            <span
                              className={`w-12 h-[2px] ${
                                row.direction === "forward"
                                  ? "bg-blue-600"
                                  : "bg-yellow-500"
                              }`}
                            ></span>

                            {row.direction === "forward" ? (
                              <FaArrowRight className="absolute right-[-6px] text-blue-600 text-xl" />
                            ) : (
                              <FaArrowLeft className="absolute left-[-6px] text-yellow-500 text-xl" />
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="border px-2 py-2">{row.latitude}</td>
                      <td className="border px-2 py-2">{row.longitude}</td>
                      <td className="border px-2 py-2">{row.district}</td>
                      <td className="border px-2 py-2">{row.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== PHYSICAL MODE ===== */}
        {mode === "physical" && (
          <div className="mt-10 max-w-sm mx-auto bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              📱 Physical Installation
            </h3>

            {!displayUid && (
              <p className="text-sm text-red-600 mb-3">
                Enter Display UID to generate QR
              </p>
            )}

            {displayUid && (
              <div className="flex flex-col items-center border rounded-lg p-4">
                <QRCodeCanvas size={180} value={installUrl} />
                <p className="mt-3 text-sm">{displayUid}</p>
              </div>
            )}

            <button
              onClick={() => setMode(null)}
              className="mt-4 rounded-lg border px-4 py-2"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
