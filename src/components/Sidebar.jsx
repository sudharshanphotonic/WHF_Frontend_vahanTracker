export default function Sidebar({ setView }) {
  return (
    <div style={{ width: 220, background: "#eee", padding: 20 }}>
      <h3>Menu</h3>

      <button onClick={() => setView("dashboard")}>
        Dashboard
      </button>
      <br /><br />

      <button onClick={() => setView("addDisplay")}>
        Add Display
      </button>
      <br /><br />

      <button onClick={() => setView("addBus")}>
        Add Bus
      </button>
      <br /><br />
      <button onClick={() => setView("addRoute")}>
        Add Routes
      </button>
      <br /><br />  

      <button onClick={() => setView("addStop")}>
        Add Stop
      </button>
    </div>
  );
}
