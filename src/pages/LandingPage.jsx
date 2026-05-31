export default function LandingPage({ onCitizenLogin, onAdminLogin }) {
  const features = [
    { icon: "🤖", title: "AI Priority Detection", desc: "Automatically detects urgent complaints using AI" },
    { icon: "📍", title: "Location Tracking", desc: "Track issues by area and monitor problem zones" },
    { icon: "⚡", title: "Faster Response", desc: "High priority issues get immediate attention" },
    { icon: "📊", title: "Real-time Analytics", desc: "Powerful dashboards for data-driven decisions" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #eee",
        padding: "0 40px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: "#1a1a1a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#fff", fontWeight: 700
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>CiviCare AI</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCitizenLogin} style={{
            padding: "8px 20px", borderRadius: 8, border: "1px solid #ddd",
            background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500
          }}>Citizen Login</button>
          <button onClick={onAdminLogin} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: "#1a1a1a", color: "#fff", fontSize: 14,
            cursor: "pointer", fontWeight: 500
          }}>Admin Login</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "80px 40px 60px",
        textAlign: "center"
      }}>
        <div style={{
          display: "inline-block", background: "#EAF3DE", color: "#3B6D11",
          fontSize: 12, fontWeight: 600, padding: "4px 14px",
          borderRadius: 20, marginBottom: 24
        }}>
          AI-Powered Civic Management
        </div>
        <h1 style={{
          fontSize: 48, fontWeight: 800, color: "#1a1a1a",
          lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-1px"
        }}>
          Smart Civic Complaint<br />
          <span style={{ color: "#4a90d9" }}>Management Powered by AI</span>
        </h1>
        <p style={{ fontSize: 18, color: "#666", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.6 }}>
          AI detects urgency, prioritizes complaints and helps authorities respond faster.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
          <button onClick={onCitizenLogin} style={{
            padding: "14px 32px", borderRadius: 10, border: "none",
            background: "#1a1a1a", color: "#fff", fontSize: 16,
            fontWeight: 600, cursor: "pointer"
          }}>🚨 Raise a Complaint</button>
          <button onClick={onAdminLogin} style={{
            padding: "14px 32px", borderRadius: 10,
            border: "1px solid #ddd", background: "#fff",
            fontSize: 16, fontWeight: 600, cursor: "pointer", color: "#1a1a1a"
          }}>View Dashboard</button>
        </div>
      </div>

      {/* Features */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "0 40px 80px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20
      }}>
        {features.map(f => (
          <div key={f.title} style={{
            background: "#fff", borderRadius: 14, padding: "24px 20px",
            border: "1px solid #eee", textAlign: "center"
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: "#1a1a1a" }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}