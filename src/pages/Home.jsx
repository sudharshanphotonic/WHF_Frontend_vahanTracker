// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Dashboard from "./Dashboard";
// import AddDisplay from "./AddDisplay";
// import AddBus from "./AddBus";
// import AddStops from "./AddStops";
// import AddRoute from "./AddRoute";
// import AddUser from "./Adduser";

// export default function Home() {
//   const [view, setView] = useState("dashboard");

//   const [displayCount, setDisplayCount] = useState(0);
//   const [busCount, setBusCount] = useState(0);
//   const [routeCount, setRouteCount] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // 🔄 Fetch display count
//   const fetchDisplayCount = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/displays/count");
//       const data = await res.json();
//       setDisplayCount(data.total);
//     } catch {
//       setDisplayCount(0);
//     }
//   };

//   // 🔄 Fetch bus count
//   const fetchBusCount = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/buses/count");
//       const data = await res.json();
//       setBusCount(data.total);
//     } catch {
//       setBusCount(0);
//     }
//   };

//   // 🔄 Fetch route count
//   const fetchRouteCount = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/routes/count");
//       const data = await res.json();
//       setRouteCount(data.total);
//     } catch {
//       setRouteCount(0);
//     }
//   };

//   // 🔁 Refresh counts when dashboard opens
//   useEffect(() => {
//     if (view === "dashboard") {
//       setLoading(true);
//       Promise.all([
//         fetchDisplayCount(),
//         fetchBusCount(),
//         fetchRouteCount(),
//       ]).finally(() => setLoading(false));
//     }
//   }, [view]);

//   return (
//     // 🔒 FULL HEIGHT CONTAINER
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       {/* ================= SIDEBAR (FIXED) ================= */}
//       <div
//         style={{
//           width: 220,
//           flexShrink: 0,
//           background: "#eee",
//           borderRight: "1px solid #ddd",
//         }}
//       >
//         <Sidebar setView={setView} />
//       </div>

//       {/* ================= CONTENT (SCROLL ONLY HERE) ================= */}
//       <div
//         style={{
//           flexGrow: 1,
//           overflowY: "auto",
//           padding: 20,
//         }}
//       >
//         {view === "dashboard" && (
//           <Dashboard
//             displayCount={displayCount}
//             busCount={busCount}
//             routeCount={routeCount}
//             loading={loading}
//           />
//         )}

//         {view === "addDisplay" && (
//           <AddDisplay onSaved={fetchDisplayCount} />
//         )}

//         {view === "addBus" && (
//           <AddBus onSaved={fetchBusCount} />
//         )}

//         {view === "addRoute" && (
//           <AddRoute onSaved={fetchRouteCount} />
//         )}

//         {view === "addStop" && <AddStops />}

//         {view === "addUser" && <AddUser />}
//       </div>
//     </div>
//   );
// }


import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const SIDEBAR_WIDTH = 240;

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#f8fafc", // simple neutral background
      }}
    >
      {/* ================= FIXED SIDEBAR ================= */}
      <div
        style={{
          position: "fixed",
          inset: "0 auto 0 0",
          width: SIDEBAR_WIDTH,
          background: "rgba(15,23,42,0.9)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          zIndex: 20,
        }}
      >
        <Sidebar />
      </div>

      {/* ================= CONTENT ================= */}
      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          height: "100vh",
          overflowY: "auto",
          padding: 5,
          background: "#f8fafc",
        }}
      >
        {/* ROUTED PAGES */}
        <Outlet />
      </div>
    </div>
  );
}
