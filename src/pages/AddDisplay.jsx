import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function DisplayDevice() {
  const DEVICE_UID = "DISPLAY-UID-001";
  const [showQR, setShowQR] = useState(false);

  return (
    <div
      style={{
        height: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>BUS STOP DISPLAY</h2>

      {!showQR && (
        <>
          <p>Display Running...</p>
          <button
            style={{ padding: "10px 20px", marginTop: 20 }}
            onClick={() => setShowQR(true)}
          >
            🔘 Physical Install Button
          </button>
        </>
      )}

      {showQR && (
        <div style={{ background: "white", padding: 15, marginTop: 20 }}>
          <QRCodeCanvas
            size={180}
            value={`${window.location.origin}/install?deviceId=${DEVICE_UID}`}
          />
          <p style={{ color: "black", marginTop: 10 }}>
            {DEVICE_UID}
          </p>
        </div>
      )}
    </div>
  );
}
