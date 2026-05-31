import { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export default function AdminLogin({ onLoginSuccess, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) { setError("Fill both fields."); return; }
    setError(""); setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/admin/login`, { username, password });
      localStorage.setItem("civicare_user", JSON.stringify({ name: res.data.name }));
      localStorage.setItem("civicare_role", "admin");
      onLoginSuccess({ name: res.data.name });
    } catch {
      setError("Invalid credentials. Try admin / civicare123");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8f8f6",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "40px",
        width: "100%", maxWidth: 400, border: "1px solid #eee"
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: "#888", marginBottom: 24, padding: 0
        }}>← Back</button>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Admin Login</div>
          <div style={{ fontSize: 14, color: "#888" }}>Municipal Government Portal</div>
        </div>

        {error && (
          <div style={{
            background: "#FCEBEB", border: "1px solid #F7C1C1",
            borderRadius: 10, padding: "10px 14px",
            fontSize: 13, color: "#A32D2D", marginBottom: 16
          }}>{error}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" type="password"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <button onClick={handleLogin} disabled={loading} style={{
            padding: "12px", borderRadius: 10, border: "none",
            background: loading ? "#ccc" : "#1a1a1a", color: "#fff",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: 4
          }}>{loading ? "Logging in..." : "Login as Admin"}</button>
        </div>

        <div style={{ marginTop: 20, padding: "12px 16px", background: "#f8f8f6", borderRadius: 10, fontSize: 12, color: "#999" }}>
          Demo credentials: <strong style={{ color: "#555" }}>admin</strong> / <strong style={{ color: "#555" }}>civicare123</strong>
        </div>
      </div>
    </div>
  );
}