import { useState } from "react";

/* 🔐 LOCAL INSTALLER CREDENTIALS */
const INSTALLER_USERNAME = "psdas";
const INSTALLER_PASSWORD = "psdas";

export default function InstallerDisplayRegister() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get("deviceId");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  // ❌ Block if QR not scanned
  if (!deviceId) {
    return <h3>❌ Scan QR from display to continue</h3>;
  }

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

  return (
    <div style={{ maxWidth: 400, padding: 20 }}>
      <h2>Installer Login</h2>

      {!loggedIn ? (
        <>
          <input
            placeholder="Username"
            value={username}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
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
      ) : (
        <h3>✅ Login Success – Installer Page Only</h3>
      )}
    </div>
  );
}
