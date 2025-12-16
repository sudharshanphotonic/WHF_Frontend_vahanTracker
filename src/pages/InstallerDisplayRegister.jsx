import { useState, useEffect } from "react";

/* 🔐 Local installer credentials */
const INSTALLER_USERNAME = "psdas";
const INSTALLER_PASSWORD = "psdas";

export default function InstallerDisplayRegister() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get("deviceId");

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // Installer form state
  const [form, setForm] = useState({
    displayName: "",
    locationName: "",
    installerName: "",
    latitude: "",
    longitude: "",
  });

  const [locationError, setLocationError] = useState("");

  // ❌ Block if QR not scanned
  if (!deviceId) {
    return <h3>❌ Scan QR from display to continue</h3>;
  }

  /* ================= GET GPS FROM MOBILE ================= */
  useEffect(() => {
    if (!loggedIn) return;

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported on this device");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      (err) => {
        setLocationError("Location permission denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [loggedIn]);

  const handleLogin = () => {
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (u === INSTALLER_USERNAME && p === INSTALLER_PASSWORD) {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: 450, padding: 20 }}>
      <h2>Installer – Register Display</h2>

      {/* ================= LOGIN ================= */}
      {!loggedIn && (
        <>
          <h3>Installer Login</h3>

          <input
            placeholder="Username"
            value={username}
            autoCapitalize="none"
            autoCorrect="off"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            autoCapitalize="none"
            autoCorrect="off"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={handleLogin}>Login</button>

          {error && (
            <p style={{ color: "red", marginTop: 10 }}>{error}</p>
          )}
        </>
      )}

      {/* ================= INSTALLER FORM ================= */}
      {loggedIn && (
        <>
          <h3>Display Installation Details</h3>

          <p><b>Device UID:</b> {deviceId}</p>

          <input
            name="displayName"
            placeholder="Display Name"
            onChange={handleChange}
          />
          <br /><br />

          <input
            name="locationName"
            placeholder="Location Name (Bus Stop / Area)"
            onChange={handleChange}
          />
          <br /><br />

          <input
            name="installerName"
            placeholder="Installer Name"
            onChange={handleChange}
          />
          <br /><br />

          {/* GPS STATUS */}
          {locationError ? (
            <p style={{ color: "red" }}>📍 {locationError}</p>
          ) : form.latitude ? (
            <>
              <p>📍 Latitude: {form.latitude}</p>
              <p>📍 Longitude: {form.longitude}</p>
            </>
          ) : (
            <p>📍 Fetching location from mobile…</p>
          )}

          <hr />
          <h3>Preview</h3>

          <div style={{ background: "#f2f2f2", padding: 10 }}>
            <p><b>Device:</b> {deviceId}</p>
            <p><b>Display:</b> {form.displayName}</p>
            <p><b>Location:</b> {form.locationName}</p>
            <p><b>Installer:</b> {form.installerName}</p>
            <p><b>Lat:</b> {form.latitude}</p>
            <p><b>Lng:</b> {form.longitude}</p>
          </div>
        </>
      )}
    </div>
  );
}
