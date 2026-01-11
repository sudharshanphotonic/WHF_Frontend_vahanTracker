import { useState, useEffect } from "react";
import { FaBus, FaArrowRight } from "react-icons/fa";

/* ================= DEMO DATA ================= */
const buses = [
  {
    id: "BUS_001",
    name: "TN38 AB 1234",
    from: "Gandhipuram",
    to: "Ukkadam",
    stops: [
      { name: "Omni Bus Stand", eta: "10:05 AM" },
      { name: "Lakshmi Mills", eta: "10:12 AM" },
      { name: "Sungam", eta: "10:20 AM" },
      { name: "Ukkadam", eta: "10:35 AM" },
    ],
    currentStopIndex: 2,
  },
  {
    id: "BUS_002",
    name: "TN37 XY 5678",
    from: "Saravanampatti",
    to: "Railway Station",
    stops: [
      { name: "Keeranatham", eta: "09:40 AM" },
      { name: "Peelamedu", eta: "09:55 AM" },
      { name: "Railway Station", eta: "10:15 AM" },
    ],
    currentStopIndex: 1,
  },
  {
    id: "BUS_003",
    name: "TN23 CC 9090",
    from: "Vellore",
    to: "Vellore",
    stops: [
      { name: "Vellore", eta: "09:00 AM" },
      { name: "Adukkamparai", eta: "09:15 AM" },
      { name: "Kaniyambadi", eta: "09:30 AM" },
      { name: "Kannamangalam", eta: "09:50 AM" },
      { name: "Kaniyambadi", eta: "10:10 AM" },
      { name: "Adukkamparai", eta: "10:25 AM" },
      { name: "Vellore", eta: "10:45 AM" },
    ],
    currentStopIndex: 3,
  },
];

/* ================= MAIN COMPONENT ================= */
export default function BusDetails() {
  const [selectedBus, setSelectedBus] = useState(null);
  const [stopShape, setStopShape] = useState("circle"); // circle | square | triangle

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <h2 className="text-2xl font-semibold mb-6">🚌 Bus Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => {
          const isRoundRoute =
            bus.stops[0].name ===
            bus.stops[bus.stops.length - 1].name;

          return (
            <div
              key={bus.id}
              onClick={() => setSelectedBus(bus)}
              className="cursor-pointer rounded-xl bg-white p-5 shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <FaBus className="text-blue-600 text-xl" />
                <h3 className="font-semibold text-lg">{bus.name}</h3>
              </div>

              <p className="text-sm text-gray-600">
                <b>Route:</b> {bus.from} → {bus.to}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                <b>Bus ID:</b> {bus.id}
              </p>

              <MiniTimeline
                stops={bus.stops}
                currentIndex={bus.currentStopIndex}
              />

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs rounded ${
                  isRoundRoute
                    ? "bg-purple-100 text-purple-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isRoundRoute ? "🔁 Round Route" : "🟢 Linear Route"}
              </span>
            </div>
          );
        })}
      </div>

      {selectedBus &&
        (selectedBus.stops[0].name ===
        selectedBus.stops[selectedBus.stops.length - 1].name ? (
          <RoundBusTimeline
            bus={selectedBus}
            onClose={() => setSelectedBus(null)}
            stopShape={stopShape}
            setStopShape={setStopShape}
          />
        ) : (
          <BusTimeline
            bus={selectedBus}
            onClose={() => setSelectedBus(null)}
            stopShape={stopShape}
            setStopShape={setStopShape}
          />
        ))}
    </div>
  );
}

/* ================= MINI TIMELINE ================= */
function MiniTimeline({ stops, currentIndex }) {
  return (
    <div className="flex items-center gap-1 mt-3">
      {stops.map((_, index) => (
        <span
          key={index}
          className={`w-3 h-3 rounded-full ${
            index < currentIndex
              ? "bg-gray-700"
              : index === currentIndex
              ? "bg-blue-600"
              : "bg-gray-300"
          }`}
        />
      ))}
      <FaArrowRight className="ml-2 text-gray-500 text-sm" />
    </div>
  );
}

/* ================= SHAPE SELECTOR ================= */
function ShapeSelector({ stopShape, setStopShape }) {
  return (
    <div className="flex items-center gap-2">
      <div
        onClick={() => setStopShape("circle")}
        className={`w-5 h-5 border cursor-pointer rounded-full ${
          stopShape === "circle" ? "bg-blue-600" : "bg-white"
        }`}
      />
      <div
        onClick={() => setStopShape("square")}
        className={`w-5 h-5 border cursor-pointer ${
          stopShape === "square" ? "bg-blue-600" : "bg-white"
        }`}
      />
      {/* <div
        onClick={() => setStopShape("triangle")}
        className="cursor-pointer"
        style={{
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderBottom:
            stopShape === "triangle"
              ? "15px solid #2563eb"
              : "15px solid #d1d5db",
        }}
      /> */}
    </div>
  );
}

/* ================= LINEAR TIMELINE ================= */
function BusTimeline({ bus, onClose, stopShape, setStopShape }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percent =
      (bus.currentStopIndex / (bus.stops.length - 1)) * 100;
    const t = setTimeout(() => setProgress(percent), 300);
    return () => clearTimeout(t);
  }, [bus]);

  return (
    <div className="mt-10 bg-white rounded-2xl shadow p-8 overflow-x-auto">
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">
            Timeline – {bus.name}
          </h3>
          <p className="text-sm text-gray-500">
            {bus.from} → {bus.to}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ShapeSelector stopShape={stopShape} setStopShape={setStopShape} />
          <button onClick={onClose} className="border px-4 py-1 rounded">
            ✕ Close
          </button>
        </div>
      </div>

      <div className="relative min-w-max px-6 py-8">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-blue-600 transition-all duration-[1600ms]"
          style={{ width: `${progress}%` }}
        />

        <FaBus
          className="absolute top-1/2 -translate-y-1/2 text-yellow-600 text-3xl transition-all duration-[1600ms] z-20"
          style={{ left: `calc(${progress}% - 15px)` }}
        />

        <div className="flex justify-between">
          {bus.stops.map((stop, index) => {
            const isPast = index < bus.currentStopIndex;
            const isCurrent = index === bus.currentStopIndex;

            return (
              <div
                key={index}
                className="relative flex flex-col items-center"
                style={{ minWidth: 140 }}
              >
                {/* 🔵 stop shape (circle / square only) */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${
                    stopShape === "circle" ? "rounded-full" : ""
                  } ${
                    isCurrent
                      ? "bg-blue-600 scale-125"
                      : isPast
                      ? "bg-gray-800"
                      : "bg-gray-300"
                  }`}
                />

                <div className="mt-20 text-center">
                  <p
                    className={`text-sm ${
                      isCurrent
                        ? "text-blue-600 font-semibold"
                        : isPast
                        ? "text-gray-800"
                        : "text-gray-400"
                    }`}
                  >
                    {stop.name}
                  </p>
                  <p className="text-xs text-gray-400">{stop.eta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= ROUND / CIRCULAR TIMELINE ================= */
function RoundBusTimeline({ bus, onClose, stopShape, setStopShape }) {
  const size = 320;
  const center = size / 2;
  const radius = 120;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;

  const [progress, setProgress] = useState(0);
  const angle = progress * 2 * Math.PI - Math.PI / 2;

  useEffect(() => {
    const percent =
      bus.currentStopIndex / (bus.stops.length - 1);
    const t = setTimeout(() => setProgress(percent), 300);
    return () => clearTimeout(t);
  }, [bus]);

  return (
    <div className="mt-10 bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">
            🔁 Round Route – {bus.name}
          </h3>
          <p className="text-sm text-gray-500">{bus.from} (Loop)</p>
        </div>

        <div className="flex items-center gap-4">
          <ShapeSelector stopShape={stopShape} setStopShape={setStopShape} />
          <button onClick={onClose} className="border px-4 py-1 rounded">
            ✕ Close
          </button>
        </div>
      </div>

      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#111827"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#2563eb"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.6s ease-in-out",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>

        {bus.stops.map((stop, index) => {
          const a =
            (index / bus.stops.length) * 2 * Math.PI - Math.PI / 2;

          const x = center + radius * Math.cos(a);
          const y = center + radius * Math.sin(a);

          const labelOffset = 22;
          const lx = center + (radius + labelOffset) * Math.cos(a);
          const ly = center + (radius + labelOffset) * Math.sin(a);

          const isPast = index < bus.currentStopIndex;
          const isCurrent = index === bus.currentStopIndex;

          return (
            <div key={index}>
              {/* 🔵 stop shape (circle / square only) */}
              <div
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className={`w-4 h-4 ${
                    stopShape === "circle" ? "rounded-full" : ""
                  } ${
                    isCurrent
                      ? "bg-blue-600 scale-125"
                      : isPast
                      ? "bg-green-600"
                      : "bg-gray-400"
                  }`}
                />
              </div>

              {/* label */}
              <div
                className="absolute text-xs text-gray-600 w-24 text-center"
                style={{
                  left: lx,
                  top: ly,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {stop.name}
              </div>
            </div>
          );
        })}

        <FaBus
          className="absolute text-yellow-600 text-3xl transition-transform duration-[1600ms]"
          style={{
            left: center,
            top: center,
            transform: `
              translate(-50%, -50%)
              rotate(${angle}rad)
              translate(${radius}px)
              rotate(${-angle}rad)
            `,
          }}
        />
      </div>
    </div>
  );
}
