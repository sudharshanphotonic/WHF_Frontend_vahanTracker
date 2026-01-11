// import { useState } from "react";
// import InstallerDisplayRegister from "./pages/InstallerDisplayRegister";
// import Home from "./pages/Home";
// import Login from "./pages/Login";

// export default function App() {
//   // 🔍 Detect QR installer flow
//   const params = new URLSearchParams(window.location.search);
//   const deviceId = params.get("deviceId");

//   // 🔐 Normal app login state
//   const [loggedIn, setLoggedIn] = useState(false);

//   /* ================= INSTALLER FLOW ================= */
//   // If QR scanned → ALWAYS show installer page
//   if (deviceId) {
//     return <InstallerDisplayRegister />;
//   }

//   /* ================= NORMAL APP FLOW ================= */
//   // No QR → normal login + dashboard
//   return loggedIn ? (
//     <Home />
//   ) : (
//     <Login onLogin={() => setLoggedIn(true)} />
//   );
// }
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import InstallerDisplayRegister from "./pages/InstallerDisplayRegister";
import Home from "./pages/Home";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import AddDisplay from "./pages/AddDisplay";
import AddBus from "./pages/AddBus";
import AddRoute from "./pages/AddRoute";
import AddStops from "./pages/AddStops";
import AddUser from "./pages/AddUser";

import ProtectedRoute from "./ProtectedRoute";
import BusDetails from "./components/BusDetails/BusDetails";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Installer */}
        <Route path="/install" element={<InstallerDisplayRegister />} />

        {/* Login – NO AUTH CHECK HERE */}
        <Route path="/login" element={<Login />} />

        {/* Protected App */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="displays/add" element={<AddDisplay />} />
          <Route path="buses/add" element={<AddBus />} />
          <Route path="routes/add" element={<AddRoute />} />
          <Route path="stops/add" element={<AddStops />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="busdetails" element={<BusDetails/>}/>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
