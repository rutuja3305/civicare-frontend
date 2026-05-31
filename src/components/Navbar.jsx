export default function Navbar({ user, role, onLogout, onNavigate, currentPage }) {
  return (
    <nav style={{
      background: "#fff", borderBottom: "1px solid #eee",
      padding: "0 32px", height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "#1a1a1a", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 14, color: "#fff", fontWeight: 700
        }}>C</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>CiviCare AI</span>
      </div>

      {user ? (
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {role === "citizen" && (
            <>
              {["submit", "track", "mine"].map(p => (
                <button key={p} onClick={() => onNavigate(p)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, color: currentPage === p ? "#1a1a1a" : "#888",
                  fontWeight: currentPage === p ? 600 : 400, padding: "4px 0"
                }}>
                  {{ submit: "Raise Complaint", track: "Track", mine: "My Complaints" }[p]}
                </button>
              ))}
            </>
          )}
          {role === "admin" && (
            <>
              {["dashboard", "complaints", "analytics"].map(p => (
                <button key={p} onClick={() => onNavigate(p)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 14, color: currentPage === p ? "#1a1a1a" : "#888",
                  fontWeight: currentPage === p ? 600 : 400, padding: "4px 0"
                }}>
                  {{ dashboard: "Dashboard", complaints: "All Complaints", analytics: "Analytics" }[p]}
                </button>
              ))}
            </>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: role === "admin" ? "#1a1a1a" : "#E6F1FB",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              color: role === "admin" ? "#fff" : "#185FA5"
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: "#555" }}>{user.name}</span>
            <button onClick={onLogout} style={{
              padding: "5px 14px", borderRadius: 8,
              border: "1px solid #eee", background: "#fff",
              fontSize: 13, cursor: "pointer", color: "#888"
            }}>Logout</button>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 13, color: "#aaa" }}>Smart Civic Complaint Management</div>
      )}
    </nav>
  );
}