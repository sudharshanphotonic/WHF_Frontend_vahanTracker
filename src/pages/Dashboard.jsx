import { useEffect, useState } from "react";
import DashboardMap from "./DashboardMap";

export default function Dashboard({
  displayCount = 0,
  loading = false,
}) {
  const [showDisplays, setShowDisplays] = useState(false);
  const [showBuses, setShowBuses] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  const [displays, setDisplays] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [busCount, setBusCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);

  /* ✅ FIX: LOCAL DISPLAY COUNT */
  const [localDisplayCount, setLocalDisplayCount] = useState(displayCount);

  const [listLoading, setListLoading] = useState(false);

  const [editingBus, setEditingBus] = useState(null);
  const [busForm, setBusForm] = useState({});

  const [editingRoute, setEditingRoute] = useState(null);
  const [routeForm, setRouteForm] = useState({});

  const [editingDisplay, setEditingDisplay] = useState(null);
  const [displayForm, setDisplayForm] = useState({});

  /* ================= COUNT ================= */

  const fetchBusCount = async () => {
    const res = await fetch("http://localhost:8000/buses/count");
    const data = await res.json();
    setBusCount(data.total);
  };

  const fetchRouteCount = async () => {
    const res = await fetch("http://localhost:8000/routes/count");
    const data = await res.json();
    setRouteCount(data.total);
  };

  /* ✅ DISPLAY COUNT */
  const fetchDisplayCount = async () => {
    const res = await fetch("http://localhost:8000/displays/count");
    const data = await res.json();
    setLocalDisplayCount(data.total);
  };

  useEffect(() => {
    fetchBusCount();
    fetchRouteCount();
    fetchDisplayCount();
  }, []);

  /* ================= FETCH ================= */

  const fetchDisplays = async () => {
    setListLoading(true);
    try {
      const res = await fetch("http://localhost:8000/displays");
      setDisplays(await res.json());
      fetchDisplayCount();
    } finally {
      setListLoading(false);
    }
  };

  const fetchBuses = async () => {
    setListLoading(true);
    try {
      const res = await fetch("http://localhost:8000/buses");
      const data = await res.json();
      setBuses(data);
      fetchBusCount();
    } finally {
      setListLoading(false);
    }
  };

  const fetchRoutes = async () => {
    setListLoading(true);
    try {
      const res = await fetch("http://localhost:8000/routes");
      const data = await res.json();
      setRoutes(data);
      fetchRouteCount();
    } finally {
      setListLoading(false);
    }
  };

  /* ================= ACTIONS ================= */

  const deleteBus = async (id) => {
    if (!window.confirm("Delete bus?")) return;
    await fetch(`http://localhost:8000/buses/${id}`, { method: "DELETE" });
    fetchBuses();
  };

  const deleteRoute = async (id) => {
    if (!window.confirm("Delete route?")) return;
    await fetch(`http://localhost:8000/routes/${id}`, { method: "DELETE" });
    fetchRoutes();
  };

  const deleteDisplay = async (id) => {
    if (!window.confirm("Delete display?")) return;
    await fetch(`http://localhost:8000/displays/${id}`, { method: "DELETE" });
    fetchDisplays();
    fetchDisplayCount();
  };

  const saveBusEdit = async () => {
    await fetch(`http://localhost:8000/buses/${editingBus.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(busForm),
    });
    setEditingBus(null);
    fetchBuses();
  };

  const saveRouteEdit = async () => {
    await fetch(`http://localhost:8000/routes/${editingRoute.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(routeForm),
    });
    setEditingRoute(null);
    fetchRoutes();
  };

  const saveDisplayEdit = async () => {
    await fetch(`http://localhost:8000/displays/${editingDisplay.deviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(displayForm),
    });
    setEditingDisplay(null);
    fetchDisplays();
    fetchDisplayCount();
  };

  /* ================= UI ================= */

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Card
          title="Total Displays"
          value={loading ? "..." : localDisplayCount}
          onClick={() => {
            if (!showDisplays) fetchDisplays();
            setShowDisplays(!showDisplays);
          }}
        />

        <Card
          title="Total Buses"
          value={busCount}
          onClick={() => {
            if (!showBuses) fetchBuses();
            setShowBuses(!showBuses);
          }}
        />

        <Card
          title="Total Routes"
          value={routeCount}
          onClick={() => {
            if (!showRoutes) fetchRoutes();
            setShowRoutes(!showRoutes);
          }}
        />

        <Card title="Active Buses" value="—" />
      </div>

      {showDisplays && (
        <>
          <h3>Registered Displays</h3>
          <Table headers={["Device ID", "Name", "Location", "Actions"]}>
            {displays.map((d) => (
              <tr key={d.deviceId}>
                <td className="text-center">{d.deviceId}</td>
                <td className="text-center">{d.displayName}</td>
                <td className="text-center">{d.locationName}</td>
                <td>
                  <button onClick={() => { setEditingDisplay(d); setDisplayForm(d); }}>✏</button>
                  <button onClick={() => deleteDisplay(d.deviceId)} style={{ marginLeft: 8, color: "red" }}>🗑</button>
                </td>
              </tr>
            ))}
          </Table>
        </>
      )}

      {showBuses && (
        <>
          <h3>Registered Buses</h3>
          <Table headers={["ID", "Reg No", "Depot", "Device ID", "Actions"]}>
            {buses.map((b) => (
              <tr key={b.id}>
                <td className="text-center">{b.id}</td>
                <td className="text-center">{b.registration_no}</td>
                <td className="text-center">{b.depot}</td>
                <td className="text-center">{b.device_id}</td>
                <td>
                  <button onClick={() => { setEditingBus(b); setBusForm(b); }}>✏</button>
                  <button onClick={() => deleteBus(b.id)} style={{ marginLeft: 8, color: "red" }}>🗑</button>
                </td>
              </tr>
            ))}
          </Table>
        </>
      )}

      {showRoutes && (
        <>
          <h3>Registered Routes</h3>
          <Table headers={["ID", "Route Code", "From", "To", "Actions"]}>
            {routes.map((r) => (
              <tr key={r.id}>
                <td className="text-center">{r.id}</td>
                <td className="text-center">{r.route_code}</td>
                <td className="text-center">{r.from_place}</td>
                <td className="text-center">{r.to_place}</td>
                <td>
                  <button onClick={() => { setEditingRoute(r); setRouteForm(r); }}>✏</button>
                  <button onClick={() => deleteRoute(r.id)} style={{ marginLeft: 8, color: "red" }}>🗑</button>
                </td>
              </tr>
            ))}
          </Table>
        </>
      )}

      <DashboardMap />

      {editingDisplay && (
        <Modal onClose={() => setEditingDisplay(null)}>
          <h3>Edit Display</h3>
          <input value={displayForm.displayName || ""} onChange={(e) => setDisplayForm({ ...displayForm, displayName: e.target.value })} />
          <input value={displayForm.locationName || ""} onChange={(e) => setDisplayForm({ ...displayForm, locationName: e.target.value })} />
          <button onClick={saveDisplayEdit}>Save</button>
        </Modal>
      )}

      {editingBus && (
        <Modal onClose={() => setEditingBus(null)}>
          <h3>Edit Bus</h3>
          <input value={busForm.registration_no || ""} onChange={(e) => setBusForm({ ...busForm, registration_no: e.target.value })} />
          <input value={busForm.depot || ""} onChange={(e) => setBusForm({ ...busForm, depot: e.target.value })} />
          <input value={busForm.device_id || ""} onChange={(e) => setBusForm({ ...busForm, device_id: e.target.value })} />
          <button onClick={saveBusEdit}>Save</button>
        </Modal>
      )}

      {editingRoute && (
        <Modal onClose={() => setEditingRoute(null)}>
          <h3>Edit Route</h3>
          <input value={routeForm.route_code || ""} onChange={(e) => setRouteForm({ ...routeForm, route_code: e.target.value })} />
          <input value={routeForm.from_place || ""} onChange={(e) => setRouteForm({ ...routeForm, from_place: e.target.value })} />
          <input value={routeForm.to_place || ""} onChange={(e) => setRouteForm({ ...routeForm, to_place: e.target.value })} />
          <button onClick={saveRouteEdit}>Save</button>
        </Modal>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Card = ({ title, value, onClick }) => (
  <div onClick={onClick} style={{ padding: 20, background: "#e0f2fe", width: 180, cursor: onClick ? "pointer" : "default", border: "1px solid #90cdf4" }}>
    <h4>{title}</h4>
    <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
  </div>
);

const Table = ({ headers, children }) => (
  <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
    <thead style={{ background: "#f5f5f5" }}>
      <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

const Modal = ({ children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div style={{ background: "#fff", padding: 20, width: 400 }}>
      {children}
      <br />
      <button onClick={onClose}>Cancel</button>
    </div>
  </div>
);
