import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import AddDisplay from "./AddDisplay";
import AddBus from "./AddBus";
import AddStops from "./AddStops";

export default function Home() {
  const [view, setView] = useState("dashboard"); // DEFAULT

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setView={setView} />

      <div style={{ padding: 20, width: "100%" }}>
        {view === "dashboard" && <Dashboard />}
        {view === "addDisplay" && <AddDisplay />}
        {view === "addBus" && <AddBus />}
        {view === "addStop" && <AddStops />}
      </div>
    </div>
  );
}
