import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      onLogin();
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Master Login</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <br /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
