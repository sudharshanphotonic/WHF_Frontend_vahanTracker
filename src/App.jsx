import InstallerDisplayRegister from "./InstallerDisplayRegister";
import Dashboard from "./Dashboard";

function App() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get("deviceId");

  // INSTALLER FLOW (QR scanned)
  if (deviceId) {
    return <InstallerDisplayRegister />;
  }

  // NORMAL WEB APP FLOW
  return <Dashboard />;
}

export default App;
