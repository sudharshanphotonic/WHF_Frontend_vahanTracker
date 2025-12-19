import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import AddDisplay from "./AddDisplay";
import AddBus from "./AddBus";
import AddStops from "./AddStops";
import AddRoute from "./AddRoute";

export default function Home() {
  const [view, setView] = useState("dashboard");

  const [displayCount, setDisplayCount] = useState(0);
  const [busCount, setBusCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0); // ✅ Added route count
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch display count
  const fetchDisplayCount = async () => {
    try {
      const res = await fetch("http://localhost:8000/displays/count");
      const data = await res.json();
      setDisplayCount(data.total);
    } catch {
      setDisplayCount(0);
    }
  };

  // 🔄 Fetch bus count
  const fetchBusCount = async () => {
    try {
      const res = await fetch("http://localhost:8000/buses/count");
      const data = await res.json();
      setBusCount(data.total);
    } catch {
      setBusCount(0);
    }
  };

  // 🔄 Fetch route count
  const fetchRouteCount = async () => {
    try {
      const res = await fetch("http://localhost:8000/routes/count");
      const data = await res.json();
      setRouteCount(data.total);
    } catch {
      setRouteCount(0);
    }
  };

  // 🔁 Refresh all counts when dashboard opens
  useEffect(() => {
    if (view === "dashboard") {
      setLoading(true);
      Promise.all([
        fetchDisplayCount(),
        fetchBusCount(),
        fetchRouteCount(), // ✅ Include route count
      ]).finally(() => setLoading(false));
    }
  }, [view]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setView={setView} />

      <div style={{ padding: 20, width: "100%" }}>
        {view === "dashboard" && (
          <Dashboard
            displayCount={displayCount}
            busCount={busCount}
            routeCount={routeCount} // ✅ Pass route count to Dashboard
            loading={loading}
          />
        )}

        {view === "addDisplay" && (
          <AddDisplay onSaved={fetchDisplayCount} />
        )}

        {view === "addBus" && (
          <AddBus onSaved={fetchBusCount} />
        )}

        {view === "addRoute" && ( // ✅ Ensure view matches "addRoute"
          <AddRoute onSaved={fetchRouteCount} /> // ✅ Update route count after adding
        )}

        {view === "addStop" && <AddStops />}
      </div>
    </div>
  );
}
