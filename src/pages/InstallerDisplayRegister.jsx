import { useEffect, useState } from "react";

export default function InstallerDisplayRegister() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get("deviceId");

  const [login, setLogin] = useState({ username: "", password: "" });
  const [loggedIn, setLoggedIn] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    installerName: "",
    latitude: "",
    longitude: "",
  });

  // Block access if QR not scanned
  if (!deviceId) {
    return <h3>❌ Scan QR from display to continue</h3>;
  }

  // Static GPS (demo)
  useEffect(() => {
    setForm((f) => ({
      ...f,
      latitude: "12.9716",
      longitude: "77.5946",
    }));
  }, []);

  const handleLogin = () => {
    if (login.username === "psdas" && login.password === "psdas") {
      setLoggedIn(true);
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ maxWidth: 500, padding: 20 }}>
      <h2>Installer – Register Display</h2>

      {!loggedIn ? (
        <>
          <h3>Installer Login</h3>

          <input
            placeholder="Username"
            onChange={(e) =>
              setLogin({ ...login, username: e.target.value })
            }
          />
          <br /><br />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setLogin({ ...login, password: e.target.value })
            }
          />
          <br /><br />

          <button onClick={handleLogin}>Login</button>
        </>
      ) : (
        <>
          <p><b>Device UID:</b> {deviceId}</p>

          <input
            placeholder="Display Name"
            onChange={(e) =>
              setForm({ ...form, displayName: e.target.value })
            }
          />
          <br /><br />

          <input
            placeholder="Installer Name"
            onChange={(e) =>
              setForm({ ...form, installerName: e.target.value })
            }
          />
          <br /><br />

          <p>📍 Latitude: {form.latitude}</p>
          <p>📍 Longitude: {form.longitude}</p>

          <hr />
          <h3>Preview</h3>

          <div style={{ background: "#f2f2f2", padding: 10 }}>
            <p><b>Device:</b> {deviceId}</p>
            <p><b>Display:</b> {form.displayName}</p>
            <p><b>Installer:</b> {form.installerName}</p>
            <p><b>Lat:</b> {form.latitude}</p>
            <p><b>Lng:</b> {form.longitude}</p>
          </div>
        </>
      )}
    </div>
  );
}
