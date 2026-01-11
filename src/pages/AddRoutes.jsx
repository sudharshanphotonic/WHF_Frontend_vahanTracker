import { useState } from "react";

export default function AddRoute({ onSaved }) {
  const [form, setForm] = useState({
    route_code: "",
    from_place: "",
    to_place: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

      setForm({
        route_code: "",
        from_place: "",
        to_place: "",
      });

      onSaved?.();
    } catch {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-6">Add Route</h2>

      {/* Route Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Route Code
        </label>
        <input
          name="route_code"
          value={form.route_code}
          onChange={handleChange}
          placeholder="1A / 22 / S3"
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* From */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          From
        </label>
        <input
          name="from_place"
          value={form.from_place}
          onChange={handleChange}
          placeholder="Ondipudur"
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* To */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          To
        </label>
        <input
          name="to_place"
          value={form.to_place}
          onChange={handleChange}
          placeholder="Vadavalli"
          className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Preview */}
      {(form.route_code || form.from_place || form.to_place) && (
        <div className="mb-4 text-sm text-gray-700">
          <b>Preview:</b>{" "}
          {form.route_code} — {form.from_place} → {form.to_place}
        </div>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Route"}
      </button>
    </div>
  );
}
