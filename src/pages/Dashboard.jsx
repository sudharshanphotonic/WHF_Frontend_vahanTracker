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

  /* ================= TITLE EDIT STATE ================= */
  const [editingTitle, setEditingTitle] = useState(false);
  const [dashboardTitle, setDashboardTitle] = useState("Dashboard");

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
    <div style={{ padding: 0, background: "#f8fafc" }}>
      {/* ================= BRAND NEUTRAL TITLE CARD ================= */}
      <div
        style={{
          background: "#ffffff",
          padding: "32px 24px",
          borderRadius: 16,
          marginBottom: 24,
          position: "relative",
          border: "1px solid #e5e7eb",
        }}
      >
        <button
          onClick={() => setEditingTitle(true)}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #dbeafe",
            background: "#eff6ff",
            color: "#1d4ed8",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Edit
        </button>

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 60,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#0f172a",
            }}
          >
            {dashboardTitle}
          </h1>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div style={{ display: "flex", gap: 20,padding:5, margin:5, marginBottom: 0, flexWrap: "wrap" }}>
        <Card
          title="Total Displays"
          value={loading ? "..." : localDisplayCount}
          onClick={() => {
            if (!showDisplays) fetchDisplays();
            setShowDisplays(true);
          }}
        />

        <Card
          title="Total Buses"
          value={busCount}
          onClick={() => {
            if (!showBuses) fetchBuses();
            setShowBuses(true);
          }}
        />

        <Card
          title="Total Routes"
          value={routeCount}
          onClick={() => {
            if (!showRoutes) fetchRoutes();
            setShowRoutes(true);
          }}
        />

        <Card title="Active Buses" value="—" />
        <Card title="Total Stops" value="—" />
        <Card title="Active Routes" value="—" />
        <Card title="Inactive Displays" value="—" />
        <Card title="Offline Buses" value="—" />
        <Card title="Alerts" value="—" />
      </div>

      <DashboardMap />

      {/* ================= POPUPS ================= */}
      {showDisplays && (
        <Popup title="Registered Displays" onClose={() => setShowDisplays(false)}>
          <StyledTable headers={["Device ID", "Name", "Location", "Actions"]}>
            {displays.map((d) => (
              <tr key={d.deviceId}>
                <td>{d.deviceId}</td>
                <td>{d.displayName}</td>
                <td>{d.locationName}</td>
                <td>
                  <button onClick={() => { setEditingDisplay(d); setDisplayForm(d); }}>✏</button>
                  <button onClick={() => deleteDisplay(d.deviceId)} style={{ marginLeft: 8, color: "red" }}>🗑</button>
                </td>
              </tr>
            ))}
          </StyledTable>
        </Popup>
      )}

      {showBuses && (
        <Popup title="Registered Buses" onClose={() => setShowBuses(false)}>
          <StyledTable headers={["ID", "Reg No", "Depot", "Device ID", "Actions"]}>
            {buses.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.registration_no}</td>
                <td>{b.depot}</td>
                <td>{b.device_id}</td>
                <td>
                  <button onClick={() => { setEditingBus(b); setBusForm(b); }}>✏</button>
                  <button onClick={() => deleteBus(b.id)} style={{ marginLeft: 8, color: "red" }}>🗑</button>
                </td>
              </tr>
            ))}
          </StyledTable>
        </Popup>
      )}

      {showRoutes && (
        <Popup title="Registered Routes" onClose={() => setShowRoutes(false)}>
          <StyledTable headers={["ID", "Route Code", "From", "To", "Actions"]}>
            {routes.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.route_code}</td>
                <td>{r.from_place}</td>
                <td>{r.to_place}</td>
                <td>
                  <button onClick={() => { setEditingRoute(r); setRouteForm(r); }}>✏</button>
                  <button onClick={() => deleteRoute(r.id)} style={{ marginLeft: 8, color: "red" }}>🗑</button>
                </td>
              </tr>
            ))}
          </StyledTable>
        </Popup>
      )}

      {/* ================= TITLE EDIT MODAL ================= */}
      {editingTitle && (
        <Modal onClose={() => setEditingTitle(false)}>
          <h3 style={{ marginBottom: 16 }}>Edit Dashboard Title</h3>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} value={dashboardTitle} onChange={(e) => setDashboardTitle(e.target.value)} />
        </Modal>
      )}

      {editingDisplay && (
        <Modal onClose={() => setEditingDisplay(null)}>
          <h3>Edit Display</h3>
          <input style={inputStyle} value={displayForm.displayName || ""} onChange={(e) => setDisplayForm({ ...displayForm, displayName: e.target.value })} />
          <button onClick={saveDisplayEdit}>Save</button>
        </Modal>
      )}

      {editingBus && (
        <Modal onClose={() => setEditingBus(null)}>
          <h3>Edit Bus</h3>
          <input value={busForm.registration_no || ""} onChange={(e) => setBusForm({ ...busForm, registration_no: e.target.value })} />
          <button onClick={saveBusEdit}>Save</button>
        </Modal>
      )}

      {editingRoute && (
        <Modal onClose={() => setEditingRoute(null)}>
          <h3>Edit Route</h3>
          <input value={routeForm.route_code || ""} onChange={(e) => setRouteForm({ ...routeForm, route_code: e.target.value })} />
          <button onClick={saveRouteEdit}>Save</button>
        </Modal>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Card = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: 20,
      background:
        title === "Total Displays" ? "#dbeafe" :
        title === "Total Buses" ? "#dcfce7" :
        title === "Total Routes" ? "#fef3c7" : "#f1f5f9",
      width: 180,
      cursor: onClick ? "pointer" : "default",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
    }}
  >
    <h4>{title}</h4>
    <p style={{ fontSize: 24, fontWeight: "bold" }}>{value}</p>
  </div>
);

const Popup = ({ title, children, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(6px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 20,
        width: "90%",
        maxHeight: "80vh",
        overflow: "auto",
        borderRadius: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <h3>{title}</h3>
        <button onClick={onClose}>✖</button>
      </div>
      {children}
    </div>
  </div>
);

const StyledTable = ({ headers, children }) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      border: "1px solid #e5e7eb", // 🔹 outer border
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <thead>
      <tr>
        {headers.map((h) => (
          <th
            key={h}
            style={{
              textAlign: "left",
              padding: "12px",
              background: "#f1f5f9",
              fontWeight: 700,
              fontSize: 14,
              borderBottom: "1px solid #e5e7eb",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {children &&
        children.map((row, idx) => (
          <tr
            key={idx}
            style={{
              background: idx % 2 === 0 ? "#ffffff" : "#f9fafb",
            }}
          >
            {row.props.children.map((cell, cIdx) => (
              <td
                key={cIdx}
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  borderBottom: "1px solid #e5e7eb",
                  borderRight: "1px solid #e5e7eb",
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
    </tbody>
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

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #ccc",
  borderRadius: 4,
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  display: "block",
  marginBottom: 6,
};
