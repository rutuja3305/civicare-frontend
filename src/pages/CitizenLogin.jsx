import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function CitizenLogin({ onLoginSuccess, onBack }) {
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!name.trim() || !phone.trim()) { setError("Enter name and phone."); return; }
    if (phone.length < 10) { setError("Enter valid 10-digit phone number."); return; }
    setError(""); setLoading(true);
    try {
  const res = await axios.post(`${API}/api/auth/citizen/send-otp`, { name, phone });
  setOtp(res.data.otp); // ← auto-fills the OTP input
  setStep("otp");
  } catch {
      setError("Failed to send OTP. Check if backend is running.");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp.trim()) { setError("Enter the OTP."); return; }
    setError(""); setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/citizen/verify-otp`, { phone, otp });
      localStorage.setItem("civicare_user", JSON.stringify(res.data.citizen));
      localStorage.setItem("civicare_role", "citizen");
      onLoginSuccess(res.data.citizen);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP. Try again.");
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
        width: "100%", maxWidth: 420, border: "1px solid #eee"
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 13, color: "#888", marginBottom: 24, padding: 0
        }}>← Back</button>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>
            {step === "form" ? "Citizen Login" : "Verify OTP"}
          </div>
          <div style={{ fontSize: 14, color: "#888" }}>
            {step === "form"
              ? "Enter your name and phone number to continue"
              : `OTP sent to ${phone}. Check your Flask terminal.`}
          </div>
        </div>

        {error && (
          <div style={{
            background: "#FCEBEB", border: "1px solid #F7C1C1",
            borderRadius: 10, padding: "10px 14px",
            fontSize: 13, color: "#A32D2D", marginBottom: 16
          }}>{error}</div>
        )}

        {step === "form" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210" maxLength={10} type="tel"
                onKeyDown={e => e.key === "Enter" && sendOtp()}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
            </div>
            <button onClick={sendOtp} disabled={loading} style={{
              padding: "12px", borderRadius: 10, border: "none",
              background: loading ? "#ccc" : "#1a1a1a", color: "#fff",
              fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: 4
            }}>{loading ? "Sending OTP..." : "Send OTP"}</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{
  background: "#EAF3DE", borderRadius: 10, padding: "12px 16px",
  fontSize: 13, color: "#3B6D11"
}}>
  Your OTP is: <strong style={{ fontSize: 20, letterSpacing: 4 }}>{otp}</strong>
</div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Enter 6-digit OTP</label>
              <input value={otp} onChange={e => setOtp(e.target.value)}
                placeholder="e.g. 482910" maxLength={6} type="number"
                onKeyDown={e => e.key === "Enter" && verifyOtp()}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 18, letterSpacing: 6, textAlign: "center", boxSizing: "border-box" }} />
            </div>
            <button onClick={verifyOtp} disabled={loading} style={{
              padding: "12px", borderRadius: 10, border: "none",
              background: loading ? "#ccc" : "#1a1a1a", color: "#fff",
              fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
            }}>{loading ? "Verifying..." : "Verify & Login"}</button>
            <button onClick={() => { setStep("form"); setOtp(""); setError(""); }} style={{
              background: "none", border: "none", fontSize: 13,
              color: "#888", cursor: "pointer", textAlign: "center"
            }}>Resend OTP</button>
          </div>
        )}
      </div>
    </div>
  );
}