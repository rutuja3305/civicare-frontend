import { useState, useEffect } from "react";
import axios from "axios";
import Badge from "../components/Badge";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL;
const CATEGORIES = ["Electricity","Water","Roads","Drainage","Sanitation","Gas","Traffic","Animal Control","Maintenance","Other"];

export default function CitizenPortal({ user, onLogout }) {
  const [page, setPage] = useState("submit");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar user={user} role="citizen" onLogout={onLogout} onNavigate={setPage} currentPage={page} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "36px 24px" }}>
        {page === "submit"  && <SubmitComplaint user={user} />}
        {page === "track"   && <TrackComplaint />}
        {page === "mine"    && <MyComplaints user={user} />}
      </div>
    </div>
  );
}

// ── SUBMIT ────────────────────────────────────────────────────
function SubmitComplaint({ user }) {
  const [form, setForm]       = useState({ title: "", description: "", category: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const [image, setImage]     = useState(null);         // File object
  const [preview, setPreview] = useState(null);         // Object URL for local preview

  // Generate local preview whenever a new file is picked
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB."); return;
    }
    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));   // instant local thumbnail
  };

  // Clean up the object URL when component unmounts or image changes
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.location) {
      setError("Please fill all fields."); return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const formData = new FormData();
      formData.append("title",       form.title);
      formData.append("description", form.description);
      formData.append("category",    form.category);
      formData.append("location",    form.location);
      formData.append("phone",       user.phone);
      if (image) formData.append("image", image);

      // ⚠️  No Content-Type header — browser sets multipart boundary automatically
      const res = await axios.post(`${API}/api/complaints/create`, formData);

      setResult(res.data);
      setForm({ title: "", description: "", category: "", location: "" });
      setImage(null);
      setPreview(null);
    } catch {
      setError("Failed to submit. Make sure backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>Raise a Complaint</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>AI will automatically detect priority based on your description</p>
      </div>

      {result && (
        <div style={{ background: "#EAF3DE", border: "1px solid #C0DD97", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ fontWeight: 600, color: "#3B6D11", marginBottom: 6 }}>✓ Complaint Submitted Successfully</div>
          <div style={{ fontSize: 13, color: "#3B6D11" }}>
            Priority: <strong>{result.priority}</strong>
            {result.reason && ` — ${result.reason}`}
          </div>
          {result.complaint_id && (
            <div style={{ fontSize: 12, color: "#639922", marginTop: 8 }}>
              Your Complaint ID:{" "}
              <code style={{ background: "#fff", padding: "2px 8px", borderRadius: 6, fontWeight: 700, fontSize: 13 }}>
                {result.complaint_id}
              </code>
              <span style={{ marginLeft: 8, color: "#3B6D11" }}>Save this to track your complaint</span>
            </div>
          )}
          {/* Show uploaded image URL confirmation if backend returns it */}
          {result.image_url && (
            <div style={{ marginTop: 12 }}>
              <img
                src={result.image_url}
                alt="Uploaded evidence"
                style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, border: "1px solid #C0DD97", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ background: "#FCEBEB", border: "1px solid #F7C1C1", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#A32D2D" }}>
          {error}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Title */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Complaint Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Broken streetlight near bus stop"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail. The more you describe, the better AI can prioritize."
              rows={4} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          </div>

          {/* Category + Location */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14 }}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Pune - Kothrud"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box" }} />
            </div>
          </div>

          {/* ── IMAGE UPLOAD + PREVIEW ── */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 6 }}>
              Upload Evidence Image <span style={{ fontWeight: 400, color: "#aaa" }}>(optional · max 5 MB)</span>
            </label>

            {/* Custom upload button */}
            <label style={{
              display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
              padding: "10px 14px", borderRadius: 10, border: "1.5px dashed #ddd",
              background: "#fafafa", fontSize: 13, color: "#666", transition: "border-color .2s"
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#aaa"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#ddd"}
            >
              <span style={{ fontSize: 18 }}>📎</span>
              <span>{image ? image.name : "Click to choose an image…"}</span>
              <input type="file" accept="image/*" onChange={handleImageChange}
                style={{ display: "none" }} />
            </label>

            {/* Local preview thumbnail */}
            {preview && (
              <div style={{ marginTop: 12, position: "relative", display: "inline-block" }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 10, border: "1px solid #eee", objectFit: "cover", display: "block" }}
                />
                {/* Remove button */}
                <button
                  onClick={() => { setImage(null); setPreview(null); }}
                  style={{
                    position: "absolute", top: 6, right: 6,
                    background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%",
                    color: "#fff", width: 24, height: 24, cursor: "pointer",
                    fontSize: 14, lineHeight: "24px", textAlign: "center", padding: 0
                  }}
                  title="Remove image"
                >✕</button>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
                  Preview — will be uploaded with your complaint
                </div>
              </div>
            )}
          </div>

          {/* Submit button */}
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: "13px", borderRadius: 10, border: "none",
            background: loading ? "#ccc" : "#1a1a1a", color: "#fff",
            fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
          }}>
            {loading ? "Submitting & Detecting Priority…" : "Submit Complaint"}
          </button>

        </div>
      </div>
    </div>
  );
}

// ── TRACK ─────────────────────────────────────────────────────
function TrackComplaint() {
  const [id, setId]             = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const track = async () => {
    if (!id.trim()) { setError("Enter a complaint ID."); return; }
    setError(""); setLoading(true); setComplaint(null);
    try {
      const res = await axios.get(`${API}/api/complaints/track/${id.trim()}`);
      setComplaint(res.data);
    } catch {
      setError("Complaint not found. Check the ID and try again.");
    }
    setLoading(false);
  };

  const STEPS      = ["Pending", "In Progress", "Resolved"];
  const currentStep = complaint ? STEPS.indexOf(complaint.status) : -1;

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>Track Complaint</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Enter your complaint ID to see current status</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input value={id} onChange={e => setId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && track()}
          placeholder="Paste your complaint ID here…"
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14 }} />
        <button onClick={track} disabled={loading} style={{
          padding: "10px 24px", borderRadius: 10, border: "none",
          background: "#1a1a1a", color: "#fff", fontSize: 14,
          fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
        }}>{loading ? "…" : "Track"}</button>
      </div>

      {error && (
        <div style={{ background: "#FCEBEB", border: "1px solid #F7C1C1", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#A32D2D", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {complaint && (
        <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 4 }}>{complaint.title}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{complaint.category} · {complaint.location}</div>
              </div>
              <Badge label={complaint.priority} type="priority" />
            </div>
            {complaint.description && (
              <p style={{ fontSize: 13, color: "#666", margin: "12px 0 0", lineHeight: 1.6 }}>{complaint.description}</p>
            )}

            {/* ── Evidence image in track view ── */}
            {complaint.image_url && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#999", letterSpacing: 0.4, marginBottom: 6 }}>EVIDENCE</div>
                <img
                  src={complaint.image_url}
                  alt="Complaint evidence"
                  style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 10, border: "1px solid #eee", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => window.open(complaint.image_url, "_blank")}
                  title="Click to view full image"
                />
              </div>
            )}
          </div>

          <div style={{ padding: "20px 24px", background: "#fafafa" }}>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 16, fontWeight: 600, letterSpacing: 0.5 }}>COMPLAINT PROGRESS</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {STEPS.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: i <= currentStep ? "#1a1a1a" : "#e0e0e0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, color: i <= currentStep ? "#fff" : "#aaa", fontWeight: 700
                    }}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 11, color: i <= currentStep ? "#1a1a1a" : "#bbb", fontWeight: i === currentStep ? 700 : 400, whiteSpace: "nowrap" }}>
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: i < currentStep ? "#1a1a1a" : "#e0e0e0", margin: "0 8px", marginBottom: 22 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {complaint.reason && (
            <div style={{ padding: "14px 24px", borderTop: "1px solid #f0f0f0", fontSize: 13, color: "#666" }}>
              <span style={{ fontWeight: 600, color: "#555" }}>AI Reason: </span>{complaint.reason}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MY COMPLAINTS ─────────────────────────────────────────────
function MyComplaints({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState(null);   // _id of the card with image open

  useEffect(() => {
    axios.get(`${API}/api/complaints/mine?phone=${user.phone}`)
      .then(res => setComplaints(res.data.data || []))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>My Complaints</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>All complaints submitted by you</p>
      </div>

      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#aaa" }}>Loading…</div>
      ) : complaints.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", padding: "60px 0", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ color: "#888", fontSize: 15 }}>No complaints submitted yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {complaints.map(c => (
            <div key={c._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #eee", padding: "18px 20px" }}>

              {/* Title + Badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#1a1a1a" }}>{c.title}</div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Badge label={c.priority} type="priority" />
                  <Badge label={c.status}   type="status" />
                </div>
              </div>

              {/* Category + Location */}
              <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
                {c.category} · {c.location}
              </div>

              {/* AI Reason Box */}
              <div style={{
                background: "#f8f8f6", border: "1px solid #eee",
                borderLeft: "3px solid #4a90d9", borderRadius: 8,
                padding: "8px 12px", marginBottom: 10
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#4a90d9", marginBottom: 3, letterSpacing: 0.3 }}>
                  AI ANALYSIS
                </div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                  {c.reason && c.reason.trim() !== ""
                    ? c.reason
                    : "Priority assigned based on complaint category and description analysis"}
                </div>
              </div>

              {/* ── Evidence image (expandable) ── */}
              {c.image_url && (
                <div style={{ marginBottom: 10 }}>
                  {expanded === c._id ? (
                    <div>
                      <img
                        src={c.image_url}
                        alt="Evidence"
                        style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 10, border: "1px solid #eee", objectFit: "cover", display: "block", cursor: "pointer" }}
                        onClick={() => window.open(c.image_url, "_blank")}
                        title="Click to open full image"
                      />
                      <button
                        onClick={() => setExpanded(null)}
                        style={{ marginTop: 6, fontSize: 12, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        ▲ Hide image
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpanded(c._id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 12, color: "#4a90d9", background: "none",
                        border: "1px solid #d0e4f7", borderRadius: 8,
                        padding: "5px 12px", cursor: "pointer"
                      }}
                    >
                      🖼 View evidence image
                    </button>
                  )}
                </div>
              )}

              {/* Complaint ID + Date */}
              <div style={{ fontSize: 11, color: "#ccc", display: "flex", justifyContent: "space-between" }}>
                <span>ID: {c._id}</span>
                <span>{c.createdAt}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}