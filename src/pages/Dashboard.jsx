import { useState } from "react";

export default function Dashboard({ displayCount = 0, loading = false }) {
  const [showList, setShowList] = useState(false);
  const [displays, setDisplays] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const fetchDisplays = async () => {
    setListLoading(true);
    try {
      const res = await fetch("http://localhost:8000/displays");
      const data = await res.json();
      setDisplays(data);
    } catch (e) {
      setDisplays([]);
    } finally {
      setListLoading(false);
    }
  };

  const handleTotalClick = () => {
    if (!showList) {
      fetchDisplays();
    }
    setShowList(!showList);
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* ================= COUNTS ================= */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        {/* TOTAL DISPLAYS (CLICKABLE) */}
        <div
          style={{
            padding: 20,
            background: "#e0f2fe",
            width: 180,
            cursor: "pointer",
            border: "1px solid #90cdf4",
          }}
          onClick={handleTotalClick}
        >
          <h4>Total Displays</h4>
          <p style={{ fontSize: 24, fontWeight: "bold" }}>
            {loading ? "Loading..." : displayCount}
          </p>
          <p style={{ fontSize: 12 }}>
            Click to {showList ? "hide" : "view"} list
          </p>
        </div>

        {/* STATIC CARDS */}
        <div style={{ padding: 20, background: "#eee", width: 150 }}>
          <h4>Total Buses</h4>
          <p>12</p>
        </div>

        <div style={{ padding: 20, background: "#eee", width: 150 }}>
          <h4>Active Buses</h4>
          <p>9</p>
        </div>

        <div style={{ padding: 20, background: "#eee", width: 150 }}>
          <h4>Pending</h4>
          <p>3</p>
        </div>
      </div>

      {/* ================= DISPLAY LIST ================= */}
      {showList && (
        <div style={{ marginTop: 20 }}>
          <h3>Registered Displays</h3>

          {listLoading ? (
            <p>Loading list...</p>
          ) : displays.length === 0 ? (
            <p>No displays found</p>
          ) : (
            <table
              border="1"
              cellPadding="8"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead style={{ background: "#f5f5f5" }}>
                <tr>
                  <th>Device ID</th>
                  <th>Display Name</th>
                  <th>Location</th>
                  <th>Installer</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {displays.map((d, i) => (
                  <tr key={i}>
                    <td>{d.deviceId}</td>
                    <td>{d.displayName}</td>
                    <td>{d.locationName}</td>
                    <td>{d.installerName || "-"}</td>
                    <td>{d.latitude}</td>
                    <td>{d.longitude}</td>
                    <td>{d.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* MAP PLACEHOLDER */}
      <div
        style={{
          height: 400,
          background: "#ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        <h3>Map (Static)</h3>
      </div>
    </div>
  );
}
