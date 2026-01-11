// import { useState } from "react";

// export default function AddBus({ onSaved }) {
//   const [form, setForm] = useState({
//     registration_no: "",
//     depot: "",
//     device_id: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     if (!form.registration_no || !form.depot || !form.device_id) {
//       alert("All fields are required");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8000/buses", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         alert(err.detail || "Failed to add bus");
//         return;
//       }

//       alert("✅ Bus added successfully");

//       setForm({
//         registration_no: "",
//         depot: "",
//         device_id: "",
//       });

//       onSaved?.(); // optional callback
//     } catch {
//       alert("Backend not reachable");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 rounded-2xl shadow border border-black">
//       <h2 className="text-xl font-semibold mb-6">Add Bus</h2>

//       {/* Bus Registration */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">
//           Bus Registration No
//         </label>
//         <input
//           name="registration_no"
//           value={form.registration_no}
//           onChange={handleChange}
//           placeholder="TN-38-AB-1234"
//           className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Depot */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-1">Depot</label>
//         <input
//           name="depot"
//           value={form.depot}
//           onChange={handleChange}
//           placeholder="Gandhipuram Depot"
//           className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Device ID */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-1">
//           GPS / Display Device ID
//         </label>
//         <input
//           name="device_id"
//           value={form.device_id}
//           onChange={handleChange}
//           placeholder="862360073810165"
//           className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Save Button */}
//       <button
//         onClick={handleSave}
//         disabled={loading}
//         className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
//       >
//         {loading ? "Saving..." : "Save Bus"}
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import StopTimeline from "../components/StopTimeline/StopTimeline";

export default function AddBus({ onSaved }) {
  const [form, setForm] = useState({
    registration_no: "",
    device_id: "",
    from: "",
    to: "",
    start_time: "",
    trips: "",
    district: "",
    state: "",
    depot: "",
  });

  const [searchBus, setSearchBus] = useState("");
  const [searchDevice, setSearchDevice] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.registration_no || !form.device_id || !form.depot) {
      alert("Required fields missing");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_no: form.registration_no,
          device_id: form.device_id,
          depot: form.depot,
        }),
      });

      if (!res.ok) {
        alert("Failed to add bus");
        return;
      }

      alert("✅ Bus added");
      onSaved?.();
    } catch {
      alert("Backend not reachable");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">

      {/* ===== TOP TITLE BAR ===== */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Add Bus
        </h2>

        <div className="flex gap-4">
          <input
            value={searchBus}
            onChange={(e) => setSearchBus(e.target.value)}
            placeholder="Search Bus Name"
            className="search"
          />

          <input
            value={searchDevice}
            onChange={(e) => setSearchDevice(e.target.value)}
            placeholder="Search Unique ID"
            className="search"
          />
        </div>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-10">

        <div className="grid grid-cols-2 gap-x-20 gap-y-6">

          {/* LEFT FULL WIDTH */}
          <VerticalField label="Bus number" required>
            <input
              name="registration_no"
              value={form.registration_no}
              onChange={handleChange}
              className="input"
            />
          </VerticalField>

          <div />

          <VerticalField label="Unique ID" required>
            <input
              name="device_id"
              value={form.device_id}
              onChange={handleChange}
              className="input"
            />
          </VerticalField>

          <div />

          {/* COMPACT ROWS */}
          <HorizontalField label="From">
            <input
              name="from"
              value={form.from}
              onChange={handleChange}
              className="input small"
            />
          </HorizontalField>

          <HorizontalField label="No. of trips">
            <input
              name="trips"
              value={form.trips}
              onChange={handleChange}
              className="input small"
            />
          </HorizontalField>

          <HorizontalField label="To">
            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              className="input small"
            />
          </HorizontalField>

          <HorizontalField label="District">
            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              className="input small"
            />
          </HorizontalField>

          <HorizontalField label="Start time">
            <input
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="input small"
            />
          </HorizontalField>

          <HorizontalField label="State">
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="input small"
            />
          </HorizontalField>

          <div />

          <HorizontalField label="Depot" required>
            <input
              name="depot"
              value={form.depot}
              onChange={handleChange}
              className="input small"
            />
          </HorizontalField>
        </div>

        {/* ACTION */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleSave}
            className="px-16 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </div>
      {/* ===== STOP TIMELINE (CORRECT PLACE) ===== */}
      <StopTimeline />
    </div>
  );
}

/* ---------- FIELD COMPONENTS ---------- */

const VerticalField = ({ label, required, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-600">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const HorizontalField = ({ label, required, children }) => (
  <div className="flex items-center gap-4">
    <label className="w-32 text-sm font-medium text-slate-600">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);
