// import { useState } from "react";
// import axios from "axios";

// export default function Login({ onLogin }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post("http://localhost:8000/login", {
//         username,
//         password,
//       });

//       // ✅ STORE SESSION (NOW WORKS)
//       localStorage.setItem("username", res.data.username);
//       localStorage.setItem("role", res.data.role);

//       onLogin();
//     } catch {
//       alert("Invalid login");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-80 rounded-xl bg-white p-6 shadow-lg">
//         <h2 className="mb-6 text-center text-xl font-semibold">
//           Master Login
//         </h2>

//         <input
//           placeholder="Username"
//           onChange={(e) => setUsername(e.target.value)}
//           className="mb-4 w-full rounded-lg border px-3 py-2"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//           className="mb-6 w-full rounded-lg border px-3 py-2"
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full rounded-lg bg-blue-600 py-2 text-white"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Login({ onLogin }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post("http://localhost:8000/login", {
//         username,
//         password,
//       });

//       // ✅ STORE SESSION
//       localStorage.setItem("username", res.data.username);
//       localStorage.setItem("role", res.data.role);

//       onLogin();                  // set loggedIn = true
//       navigate("/dashboard");     // 🔥 THIS WAS MISSING
//     } catch {
//       alert("Invalid login");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-80 rounded-xl bg-white p-6 shadow-lg">
//         <h2 className="mb-6 text-center text-xl font-semibold">
//           Master Login
//         </h2>

//         <input
//           placeholder="Username"
//           onChange={(e) => setUsername(e.target.value)}
//           className="mb-4 w-full rounded-lg border px-3 py-2"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//           className="mb-6 w-full rounded-lg border px-3 py-2"
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full rounded-lg bg-blue-600 py-2 text-white"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "/photonic.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 🔔 Toast config (one time)
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  const handleLogin = async () => {
    console.log("LOGIN TRY:", username, password);

    // try {
    //   const res = await axios.post(
    //     "http://localhost:8000/login",
    //     { username, password },
    //     {
    //       validateStatus: () => true, // ✅ prevents console error
    //     }
    //   );

      try {
      const res = await axios.post(
        "https://whf-backend-vahan-tracker.vercel.app/login",
        { username, password },
        {
          validateStatus: () => true, // ✅ prevents console error
        }
      );

      // ✅ LOGIN SUCCESS
      if (res.status === 200) {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("loggedIn", "true");

        toast.fire({
          icon: "success",
          title: `Welcome ${res.data.username}`,
        });

        navigate("/dashboard", { replace: true });
        return;
      }

      // ❌ INVALID PASSWORD
      if (res.status === 401) {
        toast.fire({
          icon: "error",
          title: "Invalid credentials",
        });
        return;
      }

      // ❌ UNAUTHORIZED / BLOCKED
      if (res.status === 403) {
        toast.fire({
          icon: "warning",
          title: "Unauthorized user",
        });
        return;
      }

      // ❌ OTHER FAILURES
      toast.fire({
        icon: "error",
        title: "Login failed",
      });

    } catch (err) {
      // 🚨 real network error
      toast.fire({
        icon: "error",
        title: "Server not reachable",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-700">
      <div className="w-full max-w-md rounded-2xl bg-white px-10 py-8 shadow-xl">

        {/* Title */}
        <h2 className="mb-8 text-center text-4xl font-bold text-black">
          Smart Bus Station
        </h2>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Smart Bus Station Logo" className="h-20 w-auto" />
        </div>

        {/* Username */}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-5 w-full rounded-lg border border-slate-300 px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-8 w-full rounded-lg border border-slate-300 px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Login button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="w-48 rounded-lg bg-blue-600 py-2 text-lg font-medium text-white hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}
