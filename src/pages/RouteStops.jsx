import { useState } from "react";
import "../App.css";

export default function RouteStops({ routeCode, from, to }) {
  const [stops, setStops] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalDots = stops.length + 2; // start + stops + end

  const addStop = () => {
    const name = prompt("Enter stop name");
    if (!name) return;
    setStops([...stops, name]);
  };

  const editStop = (i) => {
    const name = prompt("Edit stop name", stops[i]);
    if (!name) return;
    const copy = [...stops];
    copy[i] = name;
    setStops(copy);
  };

  const deleteStop = (i) => {
    if (!confirm("Delete stop?")) return;
    setStops(stops.filter((_, idx) => idx !== i));
  };

  return (
    <div className="route-wrapper">
      <h3 className="route-title">Route {routeCode}</h3>

      {/* TIMELINE */}
      <div className="timeline-container">
        <div
          className="timeline-line"
          style={{
            background: `linear-gradient(
              to right,
              #2c3e50 ${(activeIndex / (totalDots - 1)) * 100}%,
              #aeb6bf ${(activeIndex / (totalDots - 1)) * 100}%
            )`,
          }}
        />

        {/* START */}
        <Dot
          label={from}
          index={0}
          activeIndex={activeIndex}
          onClick={setActiveIndex}
          type="start"
        />

        {/* STOPS */}
        {stops.map((stop, i) => (
          <Dot
            key={i}
            label={stop}
            index={i + 1}
            activeIndex={activeIndex}
            onClick={setActiveIndex}
            onEdit={() => editStop(i)}
            onDelete={() => deleteStop(i)}
            type="middle"
          />
        ))}

        {/* END */}
        <Dot
          label={to}
          index={totalDots - 1}
          activeIndex={activeIndex}
          onClick={setActiveIndex}
          type="end"
        />
      </div>

      {/* ADD */}
      <button className="add-stop" onClick={addStop}>
        + Add Stop
      </button>
    </div>
  );
}

/* DOT */
function Dot({
  label,
  index,
  activeIndex,
  onClick,
  onEdit,
  onDelete,
  type,
}) {
  return (
    <div
      className={`dot ${type} ${index <= activeIndex ? "active" : ""}`}
      onClick={() => onClick(index)}
    >
      <span className="dot-label">{label}</span>

      {type === "middle" && (
        <div className="dot-actions">
          <button onClick={(e) => (e.stopPropagation(), onEdit())}>✏</button>
          <button onClick={(e) => (e.stopPropagation(), onDelete())}>🗑</button>
        </div>
      )}
    </div>
  );
}
