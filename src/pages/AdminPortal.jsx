import { useState, useEffect } from "react";
import axios from "axios";
import Badge from "../components/Badge";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL;
const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

export default function AdminPortal({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API}/api/complaints/all`);
      setComplaints(res.data.data || []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API}/api/complaints/update-status/${id}`, { status: newStatus });
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
    } catch { /* silent */ }
  };

  const stats = {
    total: complaints.length,
    high: complaints.filter(c => c.priority === "High").length,
    medium: complaints.filter(c => c.priority === "Medium").length,
    low: complaints.filter(c => c.priority === "Low").length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar user={user} role="admin" onLogout={onLogout} onNavigate={setPage} currentPage={page} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
        {page === "dashboard"   && <Dashboard stats={stats} complaints={complaints} loading={loading} />}
        {page === "complaints"  && <ComplaintsTable complaints={complaints} loading={loading} onUpdateStatus={updateStatus} />}
        {page === "analytics"   && <Analytics complaints={complaints} />}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ stats, complaints, loading }) {
  const recentHigh = complaints.filter(c => c.priority === "High").slice(0, 5);

  const statCards = [
    { label: "Total Complaints", value: stats.total, color: "#1a1a1a", bg: "#f0f0ee" },
    { label: "High Priority", value: stats.high, color: "#A32D2D", bg: "#FCEBEB" },
    { label: "Pending", value: stats.pending, color: "#854F0B", bg: "#FAEEDA" },
    { label: "In Progress", value: stats.inProgress, color: "#185FA5", bg: "#E6F1FB" },
    { label: "Resolved", value: stats.resolved, color: "#3B6D11", bg: "#EAF3DE" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>Dashboard Overview</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Real-time civic complaint analytics</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 32 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: s.color, opacity: 0.7, marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{loading ? "—" : s.value}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 24px" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 16 }}>Complaints by Priority</div>
          {[
            { label: "High", value: stats.high, total: stats.total, color: "#E24B4A" },
            { label: "Medium", value: stats.medium, total: stats.total, color: "#BA7517" },
            { label: "Low", value: stats.low, total: stats.total, color: "#639922" },
          ].map(p => (
            <div key={p.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "#555" }}>{p.label}</span>
                <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{p.value}</span>
              </div>
              <div style={{ background: "#f0f0ee", borderRadius: 4, height: 6 }}>
                <div style={{
                  width: `${p.total ? Math.round((p.value / p.total) * 100) : 0}%`,
                  background: p.color, height: 6, borderRadius: 4, transition: "width 0.5s"
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 24px" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 16 }}>Resolution Status</div>
          {[
            { label: "Pending", value: stats.pending, total: stats.total, color: "#888780" },
            { label: "In Progress", value: stats.inProgress, total: stats.total, color: "#378ADD" },
            { label: "Resolved", value: stats.resolved, total: stats.total, color: "#639922" },
          ].map(p => (
            <div key={p.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "#555" }}>{p.label}</span>
                <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{p.value}</span>
              </div>
              <div style={{ background: "#f0f0ee", borderRadius: 4, height: 6 }}>
                <div style={{
                  width: `${p.total ? Math.round((p.value / p.total) * 100) : 0}%`,
                  background: p.color, height: 6, borderRadius: 4, transition: "width 0.5s"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent High Priority */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 24px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 16 }}>
          🚨 Recent High Priority Complaints
        </div>
        {recentHigh.length === 0 ? (
          <div style={{ fontSize: 13, color: "#aaa", padding: "20px 0", textAlign: "center" }}>No high priority complaints</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentHigh.map(c => (
              <div key={c._id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: "#fafafa", borderRadius: 10
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "#1a1a1a" }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{c.category} · {c.location}</div>
                </div>
                <Badge label={c.status} type="status" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── COMPLAINTS TABLE ──────────────────────────────────────────
function ComplaintsTable({ complaints, loading, onUpdateStatus }) {
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = complaints.filter(c => {
    if (filterPriority !== "All" && c.priority !== filterPriority) return false;
    if (filterStatus !== "All" && c.status !== filterStatus) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) &&
        !c.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUpdate = async (id, status) => {
    setUpdatingId(id);
    await onUpdateStatus(id, status);
    setUpdatingId(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>All Complaints</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Manage and update complaint statuses</p>
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or location..."
          style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13, width: 220 }} />

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13 }}>
          {["All", "High", "Medium", "Low"].map(p => <option key={p}>{p === "All" ? "All Priorities" : p}</option>)}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", fontSize: 13 }}>
          {["All", "Pending", "In Progress", "Resolved"].map(s => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>

        <span style={{ marginLeft: "auto", fontSize: 13, color: "#aaa" }}>{filtered.length} complaints</span>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#aaa" }}>Loading complaints...</div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}>
                {["#", "Title", "Category", "Location", "Priority", "Status", "AI Reason", "Update"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, color: "#555", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#aaa" }}>No complaints found</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "12px 14px", color: "#bbb", fontSize: 12 }}>#{i + 1}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 500, color: "#1a1a1a", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "#ccc", marginTop: 2 }}>{c.createdAt?.slice(0, 10)}</div>
                  </td>
                  <td style={{ padding: "12px 14px", color: "#666" }}>{c.category}</td>
                  <td style={{ padding: "12px 14px", color: "#666" }}>{c.location}</td>
                  <td style={{ padding: "12px 14px" }}><Badge label={c.priority || "Low"} type="priority" /></td>
                  <td style={{ padding: "12px 14px" }}><Badge label={c.status || "Pending"} type="status" /></td>
                  <td style={{ padding: "12px 14px", color: "#999", fontSize: 12, maxWidth: 180 }}>
                    <div style={{ overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {c.reason || "—"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <select value={c.status || "Pending"}
                      disabled={updatingId === c._id}
                      onChange={e => handleUpdate(c._id, e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, cursor: "pointer", opacity: updatingId === c._id ? 0.5 : 1 }}>
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

//ANALYTICS page
function Analytics({ complaints }) {

  const categoryMap = {};
  complaints.forEach(c => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const maxCategory = Math.max(...categoryData.map(d => d.value), 1);

  const priorityData = [
    { name: "High",   value: complaints.filter(c => c.priority === "High").length,   color: "#E24B4A", bg: "#FCEBEB" },
    { name: "Medium", value: complaints.filter(c => c.priority === "Medium").length, color: "#BA7517", bg: "#FAEEDA" },
    { name: "Low",    value: complaints.filter(c => c.priority === "Low").length,    color: "#639922", bg: "#EAF3DE" },
  ];

  const statusData = [
    { name: "Pending",     value: complaints.filter(c => c.status === "Pending").length,     color: "#888780", bg: "#F1EFE8" },
    { name: "In Progress", value: complaints.filter(c => c.status === "In Progress").length, color: "#378ADD", bg: "#E6F1FB" },
    { name: "Resolved",    value: complaints.filter(c => c.status === "Resolved").length,    color: "#639922", bg: "#EAF3DE" },
  ];

  const resolutionRate = complaints.length
    ? Math.round((complaints.filter(c => c.status === "Resolved").length / complaints.length) * 100)
    : 0;

  const highRate = complaints.length
    ? Math.round((complaints.filter(c => c.priority === "High").length / complaints.length) * 100)
    : 0;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>Analytics</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Complaint trends and performance overview</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total Complaints", value: complaints.length, color: "#1a1a1a", bg: "#f0f0ee" },
          { label: "Resolution Rate",  value: `${resolutionRate}%`, color: "#3B6D11", bg: "#EAF3DE" },
          { label: "High Priority Rate", value: `${highRate}%`, color: "#A32D2D", bg: "#FCEBEB" },
          { label: "Pending Action", value: complaints.filter(c => c.status === "Pending").length, color: "#854F0B", bg: "#FAEEDA" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, color: s.color, opacity: 0.8, marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Priority + Status Side by Side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Priority Breakdown */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 24px" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 20 }}>Complaints by Priority</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {priorityData.map(p => (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />
                    <span style={{ color: "#555", fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{p.value}</span>
                </div>
                <div style={{ background: "#f0f0ee", borderRadius: 6, height: 8 }}>
                  <div style={{
                    width: `${complaints.length ? Math.round((p.value / complaints.length) * 100) : 0}%`,
                    background: p.color, height: 8, borderRadius: 6, transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 24px" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 20 }}>Complaints by Status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {statusData.map(p => (
              <div key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} />
                    <span style={{ color: "#555", fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{p.value}</span>
                </div>
                <div style={{ background: "#f0f0ee", borderRadius: 6, height: 8 }}>
                  <div style={{
                    width: `${complaints.length ? Math.round((p.value / complaints.length) * 100) : 0}%`,
                    background: p.color, height: 8, borderRadius: 6, transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Category Bar Chart — Pure CSS */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 20 }}>Complaints by Category</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, paddingBottom: 30, position: "relative" }}>
          {categoryData.map((d, i) => (
            <div key={d.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#378ADD" }}>{d.value}</div>
              <div style={{
                width: "100%", background: "#378ADD", borderRadius: "6px 6px 0 0",
                height: `${Math.round((d.value / maxCategory) * 130)}px`,
                transition: "height 0.6s ease", minHeight: 4
              }} />
              <div style={{ fontSize: 10, color: "#888", textAlign: "center", position: "absolute", bottom: 0, width: `${100 / categoryData.length}%`, left: `${(i / categoryData.length) * 100}%`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 2px" }}>
                {d.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution Summary */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "20px 24px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 20 }}>Resolution Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {statusData.map(s => (
            <div key={s.name} style={{ background: s.bg, borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.color, fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: s.color, opacity: 0.7, marginTop: 4 }}>
                {complaints.length ? Math.round((s.value / complaints.length) * 100) : 0}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}