import { useState } from "react";

const NODE_SIZE = 28;
const CENTER_Y = 36;

export default function StopTimeline({ onSave, onCancel }) {
  /* ================= STATE ================= */

  const [blueStops, setBlueStops] = useState([]);
  const [yellowStops, setYellowStops] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  /* ================= ADD ================= */

  const addBlueStop = () => {
    const name = prompt("Enter BLUE stop name");
    if (!name) return;
    setBlueStops((p) => [...p, { id: Date.now(), name }]);
  };

  const addYellowStop = () => {
    const name = prompt("Enter YELLOW stop name");
    if (!name) return;

    setYellowStops((p) => [
        { id: Date.now(), name }, // 👈 new stop goes FIRST
        ...p,
    ]);
    };


  /* ================= DELETE ================= */

  const deleteBlue = (id) =>
    setBlueStops((p) => p.filter((s) => s.id !== id));

  const deleteYellow = (id) =>
    setYellowStops((p) => p.filter((s) => s.id !== id));

  /* ================= UI ================= */

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 30,
        border: "1px solid #e5e7eb",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <h3 style={{ fontSize: 20, fontWeight: 700 }}>
          Stops Timeline
        </h3>

        {/* ✅ EDIT + DELETE (UI ONLY) */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setIsEditing((p) => !p)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #c7d2fe",
              background: isEditing ? "#2563eb" : "#eef2ff",
              color: isEditing ? "#fff" : "#2563eb",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isEditing ? "Done" : "Edit"}
          </button>

          {/* ❌ DELETE BUTTON — UI ONLY */}
          <button
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #fecaca",
              background: "#fee2e2",
              color: "#b91c1c",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ================= BLUE TIMELINE ================= */}
      <Timeline
        color="#2563eb"
        left="Start"
        right="End"
        stops={blueStops}
        onDelete={deleteBlue}
        isEditing={isEditing}
      />

      {isEditing && (
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <button style={btn("#2563eb")} onClick={addBlueStop}>
            + Add Blue Stop
          </button>
        </div>
      )}

      {/* ================= YELLOW TIMELINE ================= */}
      <Timeline
        color="#f59e0b"
        left="End"
        right="Start"
        stops={yellowStops}
        onDelete={deleteYellow}
        isEditing={isEditing}
      />

      {isEditing && (
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <button style={btn("#f59e0b")} onClick={addYellowStop}>
            + Add Yellow Stop
          </button>
        </div>
      )}

      {/* ================= SAVE ================= */}
      <div style={{ textAlign: "center" }}>
        <button
          style={btn("#16a34a")}
          onClick={() =>
            onSave?.({
              blue: blueStops,
              yellow: yellowStops,
            })
          }
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ================= TIMELINE ================= */

function Timeline({ color, left, right, stops, onDelete, isEditing }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          position: "relative",
          padding: `0 ${NODE_SIZE}px`,
          height: 90,
        }}
      >
        {/* LINE */}
        <div
          style={{
            position: "absolute",
            top: CENTER_Y,
            left: NODE_SIZE,
            right: NODE_SIZE,
            height: 4,
            background: color,
            borderRadius: 4,
          }}
        />

        {/* NODES */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Circle label={left} />

          {stops.map((s) => (
            <Square
              key={s.id}
              name={s.name}
              onDelete={() => onDelete(s.id)}
              isEditing={isEditing}
            />
          ))}

          <Circle label={right} />
        </div>
      </div>
    </div>
  );
}

/* ================= NODES ================= */

function Circle({ label }) {
  return (
    <div style={{ width: 90, position: "relative", textAlign: "center" }}>
      <div
        style={{
          position: "absolute",
          top: CENTER_Y - NODE_SIZE / 2,
          left: "50%",
          transform: "translateX(-50%)",
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: "50%",
          background: "#000",
        }}
      />
      <div style={{ marginTop: CENTER_Y + 18, fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

function Square({ name, onDelete, isEditing }) {
  return (
    <div style={{ width: 90, position: "relative", textAlign: "center" }}>
      {/* STOP NAME */}
      <div
        style={{
          position: "absolute",
          top: CENTER_Y - NODE_SIZE / 2 - 22,
          width: "100%",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {name}
      </div>

      {/* BOX */}
      <div
        style={{
          position: "absolute",
          top: CENTER_Y - NODE_SIZE / 2,
          left: "50%",
          transform: "translateX(-50%)",
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: 6,
          background: "#9ca3af",
          color: "#fff",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {name[0].toUpperCase()}
      </div>

      {/* DELETE (EDIT MODE ONLY) */}
      {isEditing && (
        <button
          onClick={onDelete}
          style={{
            marginTop: CENTER_Y + 20,
            fontSize: 12,
            color: "red",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}

/* ================= BUTTON ================= */

const btn = (bg) => ({
  padding: "10px 22px",
  borderRadius: 10,
  border: "none",
  background: bg,
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
});
