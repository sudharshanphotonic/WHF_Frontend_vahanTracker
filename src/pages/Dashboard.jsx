export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>

      {/* Static Counts */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
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

      {/* Static Map Placeholder */}
      <div
        style={{
          height: 400,
          background: "#ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3>Map (Static)</h3>
      </div>
    </div>
  );
}
