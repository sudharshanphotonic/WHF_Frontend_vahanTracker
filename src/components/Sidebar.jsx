// export default function Sidebar({ setView }) {
//   const role = (localStorage.getItem("role") || "").toLowerCase();

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   return (
//     <div
//       style={{
//         width: 220,
//         background: "#eee",
//         padding: 20,
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* ===== MENU ===== */}
//       <div>
//         <h3>Menu</h3>

//         <button onClick={() => setView("dashboard")}>
//           Dashboard
//         </button>
//         <br /><br />

//         <button onClick={() => setView("addDisplay")}>
//           Add Display
//         </button>
//         <br /><br />

//         <button onClick={() => setView("addBus")}>
//           Add Bus
//         </button>
//         <br /><br />

//         <button onClick={() => setView("addRoute")}>
//           Add Routes
//         </button>
//         <br /><br />

//         <button onClick={() => setView("addStop")}>
//           Add Stop
//         </button>
//         <br /><br />

//         {/* 🔐 MASTER ONLY */}
//         {role === "master" && (
//           <>
//             <button onClick={() => setView("addUser")}>
//               Add Users
//             </button>
//             <br /><br />
//           </>
//         )}
//       </div>

//       {/* ===== LOGOUT ===== */}
//       <div style={{ marginTop: "auto" }}>
//         <button
//           onClick={handleLogout}
//           style={{
//             width: "100%",
//             background: "#dc2626",
//             color: "#fff",
//             padding: "10px",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }




// import { useNavigate, useLocation } from "react-router-dom";

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const role = (localStorage.getItem("role") || "").toLowerCase();

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   // helper to highlight active menu (optional but useful)
//   const isActive = (path) => location.pathname === path;

//   return (
//     <div
//       style={{
//         width: 220,
//         background: "#eee",
//         padding: 20,
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* ===== MENU ===== */}
//       <div>
//         <h3>Menu</h3>

//         <button
//           onClick={() => navigate("/dashboard")}
//           style={{ fontWeight: isActive("/dashboard") ? "bold" : "normal" }}
//         >
//           Dashboard
//         </button>
//         <br /><br />

//         <button
//           onClick={() => navigate("/displays/add")}
//           style={{ fontWeight: isActive("/displays/add") ? "bold" : "normal" }}
//         >
//           Add Display
//         </button>
//         <br /><br />

//         <button
//           onClick={() => navigate("/buses/add")}
//           style={{ fontWeight: isActive("/buses/add") ? "bold" : "normal" }}
//         >
//           Add Bus
//         </button>
//         <br /><br />

//         <button
//           onClick={() => navigate("/routes/add")}
//           style={{ fontWeight: isActive("/routes/add") ? "bold" : "normal" }}
//         >
//           Add Routes
//         </button>
//         <br /><br />

//         <button
//           onClick={() => navigate("/stops/add")}
//           style={{ fontWeight: isActive("/stops/add") ? "bold" : "normal" }}
//         >
//           Add Stop
//         </button>
//         <br /><br />

//         {/* 🔐 MASTER ONLY */}
//         {role === "master" && (
//           <>
//             <button
//               onClick={() => navigate("/users/add")}
//               style={{ fontWeight: isActive("/users/add") ? "bold" : "normal" }}
//             >
//               Add Users
//             </button>
//             <br /><br />
//           </>
//         )}
//       </div>

//       {/* ===== LOGOUT ===== */}
//       <div style={{ marginTop: "auto" }}>
//         <button
//           onClick={handleLogout}
//           style={{
//             width: "100%",
//             background: "#dc2626",
//             color: "#fff",
//             padding: "10px",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "/photonic.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = (localStorage.getItem("role") || "").toLowerCase();
  const [openAdd, setOpenAdd] = useState(false);

  const isActive = (path) => location.pathname === path;

  /* ===== MENU ITEM ===== */
  const menuItem = (label, path, icon, isChild = false) => {
    const active = isActive(path);

    return (
      <button
        key={path}
        onClick={() => navigate(path)}
        className={`
          flex items-center gap-3 w-full rounded-lg
          ${isChild ? "pl-10 pr-3 py-2" : "px-3 py-2"}
          text-left font-medium transition
          ${active
            ? "bg-indigo-100 text-indigo-600"
            : "text-slate-700 hover:bg-indigo-50"}
        `}
      >
        <span className="text-lg">{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <aside className="w-60 h-screen bg-slate-50 border-r border-slate-200 flex flex-col">
      
      {/* ===== HEADER ===== */}
      <div className="px-4 pt-6 pb-6 flex flex-col items-center gap-2">
        <img
          src={logo}
          alt="Smart Bus Station Logo"
          className="h-14 w-auto"
        />
        <h2 className="text-lg font-bold text-slate-800 text-center">
          Smart Bus Station
        </h2>
      </div>

      {/* ===== MENU ===== */}
      <nav className="px-3 flex flex-col gap-1">
        
        {/* Dashboard */}
        {menuItem("Dashboard", "/dashboard", "🏠")}

        {/* Bus Details (OUTSIDE ADD) */}
        {menuItem("Bus Details", "/busdetails", "📋")}

        {/* ADD DROPDOWN */}
        <button
          onClick={() => setOpenAdd(!openAdd)}
          className={`
            flex items-center justify-between w-full rounded-lg px-3 py-2
            font-medium transition
            ${openAdd
              ? "bg-indigo-100 text-indigo-600"
              : "text-slate-700 hover:bg-indigo-50"}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">➕</span>
            Add
          </div>
          <span
            className={`transition-transform ${
              openAdd ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {/* ADD CHILD ITEMS */}
        {openAdd && (
          <div className="flex flex-col gap-1">
            {menuItem("Add Stops / Display", "/displays/add", "📺", true)}
            {menuItem("Add Bus", "/buses/add", "🚌", true)}
            {menuItem("Add Route", "/routes/add", "🗺️", true)}
            {menuItem("Add Stop", "/stops/add", "📍", true)}
            {role === "master" &&
              menuItem("Add Users", "/users/add", "👥", true)}
          </div>
        )}
      </nav>

      {/* ===== FOOTER ===== */}
      <div className="mt-auto px-4 pb-6">
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login", { replace: true });
          }}
          className="
            w-full rounded-lg py-2
            bg-red-100 text-red-700 font-semibold
            hover:bg-red-200 transition
          "
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

