import { useState } from "react";

export default function AddBus({ onSaved }) {
  const [form, setForm] = useState({
    registration_no: "",
    depot: "",
    device_id: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.registration_no || !form.depot || !form.device_id) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/buses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to add bus");
        return;
      }

      alert("✅ Bus added successfully");

      setForm({
        registration_no: "",
        depot: "",
        device_id: "",
      });

      onSaved?.(); // optional callback
    } catch {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-2xl shadow border border-black">
      <h2 className="text-xl font-semibold mb-6">Add Bus</h2>

      {/* Bus Registration */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Bus Registration No
        </label>
        <input
          name="registration_no"
          value={form.registration_no}
          onChange={handleChange}
          placeholder="TN-38-AB-1234"
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Depot */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Depot</label>
        <input
          name="depot"
          value={form.depot}
          onChange={handleChange}
          placeholder="Gandhipuram Depot"
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Device ID */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          GPS / Display Device ID
        </label>
        <input
          name="device_id"
          value={form.device_id}
          onChange={handleChange}
          placeholder="862360073810165"
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Bus"}
      </button>
    </div>
  );
}
